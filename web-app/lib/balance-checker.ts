import { ethers } from 'ethers';
import { ChainConfig } from './chains';
import { TokenConfig } from './tokens';

// ERC-20 ABI
const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
];

// 余额结果类型
export interface BalanceResult {
    chain: string;
    chainKey: string;
    token: string;
    balance: string;
    rawBalance?: string;
    decimals: number;
    isNative: boolean;
    contractAddress?: string;
    error?: string;
}

// 查询选项
export interface QueryOptions {
    retryAttempts?: number;
    timeout?: number;
}

export class BalanceChecker {
    private providers: Map<string, ethers.JsonRpcProvider> = new Map();
    private options: Required<QueryOptions>;

    constructor(options: QueryOptions = {}) {
        this.options = {
            retryAttempts: options.retryAttempts || 3,
            timeout: options.timeout || 10000
        };
    }

    /**
     * 获取或创建 provider
     */
    private getProvider(chainKey: string, chainConfig: ChainConfig): ethers.JsonRpcProvider {
        if (this.providers.has(chainKey)) {
            return this.providers.get(chainKey)!;
        }

        const provider = new ethers.JsonRpcProvider(chainConfig.rpc[0], {
            chainId: chainConfig.chainId,
            name: chainConfig.name
        });

        this.providers.set(chainKey, provider);
        return provider;
    }

    /**
     * 查询原生代币余额
     */
    async getNativeBalance(
        chainKey: string,
        chainConfig: ChainConfig,
        address: string
    ): Promise<BalanceResult> {
        const provider = this.getProvider(chainKey, chainConfig);

        for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
            try {
                const balance = await Promise.race([
                    provider.getBalance(address),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), this.options.timeout)
                    )
                ]);

                return {
                    chain: chainConfig.name,
                    chainKey,
                    token: chainConfig.nativeCurrency.symbol,
                    balance: ethers.formatUnits(balance, chainConfig.nativeCurrency.decimals),
                    rawBalance: balance.toString(),
                    decimals: chainConfig.nativeCurrency.decimals,
                    isNative: true
                };
            } catch (error: any) {
                if (attempt === this.options.retryAttempts) {
                    return {
                        chain: chainConfig.name,
                        chainKey,
                        token: chainConfig.nativeCurrency.symbol,
                        balance: '0',
                        decimals: chainConfig.nativeCurrency.decimals,
                        isNative: true,
                        error: error.message || 'Unknown error'
                    };
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        throw new Error('Failed to query native balance');
    }

    /**
     * 查询 ERC-20 代币余额
     */
    async getTokenBalance(
        chainKey: string,
        chainConfig: ChainConfig,
        address: string,
        tokenSymbol: string,
        tokenConfig: TokenConfig
    ): Promise<BalanceResult> {
        const provider = this.getProvider(chainKey, chainConfig);

        for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
            try {
                const contract = new ethers.Contract(tokenConfig.address, ERC20_ABI, provider);

                const balance = await Promise.race([
                    contract.balanceOf(address),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), this.options.timeout)
                    )
                ]);

                return {
                    chain: chainConfig.name,
                    chainKey,
                    token: tokenSymbol,
                    contractAddress: tokenConfig.address,
                    balance: ethers.formatUnits(balance, tokenConfig.decimals),
                    rawBalance: balance.toString(),
                    decimals: tokenConfig.decimals,
                    isNative: false
                };
            } catch (error: any) {
                if (attempt === this.options.retryAttempts) {
                    return {
                        chain: chainConfig.name,
                        chainKey,
                        token: tokenSymbol,
                        contractAddress: tokenConfig.address,
                        balance: '0',
                        decimals: tokenConfig.decimals,
                        isNative: false,
                        error: error.message || 'Unknown error'
                    };
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        throw new Error('Failed to query token balance');
    }

    /**
     * 查询单个钱包在指定链上的余额
     */
    async queryWalletOnChain(
        chainKey: string,
        chainConfig: ChainConfig,
        address: string,
        tokenConfigs: Record<string, TokenConfig>
    ): Promise<BalanceResult[]> {
        const results: BalanceResult[] = [];

        // 查询原生代币
        const nativeBalance = await this.getNativeBalance(chainKey, chainConfig, address);
        results.push(nativeBalance);

        // 查询 ERC-20 代币
        const tokenPromises = Object.entries(tokenConfigs).map(([symbol, config]) =>
            this.getTokenBalance(chainKey, chainConfig, address, symbol, config)
        );

        const tokenBalances = await Promise.all(tokenPromises);
        results.push(...tokenBalances);

        return results;
    }

    /**
     * 清理资源
     */
    cleanup() {
        this.providers.clear();
    }
}
