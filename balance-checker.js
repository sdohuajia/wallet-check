const { ethers } = require('ethers');
const fs = require('fs').promises;

// ERC-20 ABI (只需要 balanceOf 函数)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

class BalanceChecker {
  constructor(chainConfig, tokenConfig, options = {}) {
    this.chainConfig = chainConfig;
    this.tokenConfig = tokenConfig;
    this.options = {
      retryAttempts: options.retryAttempts || 3,
      timeout: options.timeout || 30000,
      ...options
    };
    this.providers = {};
  }

  /**
   * 获取或创建指定链的 provider
   */
  getProvider(chainKey, customRpc = null) {
    if (this.providers[chainKey]) {
      return this.providers[chainKey];
    }

    const chain = this.chainConfig[chainKey];
    if (!chain) {
      throw new Error(`不支持的链: ${chainKey}`);
    }

    // 使用自定义 RPC 或默认 RPC
    const rpcUrl = customRpc || chain.rpc[0];
    
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: chain.chainId,
      name: chain.name
    });

    this.providers[chainKey] = provider;
    return provider;
  }

  /**
   * 查询原生代币余额
   */
  async getNativeBalance(chainKey, address, customRpc = null) {
    const provider = this.getProvider(chainKey, customRpc);
    const chain = this.chainConfig[chainKey];
    
    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        const balance = await provider.getBalance(address);
        return {
          chain: chain.name,
          chainKey,
          token: chain.nativeCurrency.symbol,
          balance: ethers.formatUnits(balance, chain.nativeCurrency.decimals),
          rawBalance: balance.toString(),
          decimals: chain.nativeCurrency.decimals,
          isNative: true
        };
      } catch (error) {
        if (attempt === this.options.retryAttempts) {
          console.error(`[${chain.name}] 查询原生代币余额失败:`, error.message);
          return {
            chain: chain.name,
            chainKey,
            token: chain.nativeCurrency.symbol,
            balance: '0',
            error: error.message,
            isNative: true
          };
        }
        // 重试前等待
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * 查询 ERC-20 代币余额
   */
  async getTokenBalance(chainKey, address, tokenSymbol, customRpc = null) {
    const provider = this.getProvider(chainKey, customRpc);
    const chain = this.chainConfig[chainKey];
    const tokenInfo = this.tokenConfig[chainKey]?.[tokenSymbol];

    if (!tokenInfo) {
      return {
        chain: chain.name,
        chainKey,
        token: tokenSymbol,
        balance: '0',
        error: `未找到代币配置: ${tokenSymbol}`,
        isNative: false
      };
    }

    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        const contract = new ethers.Contract(tokenInfo.address, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        
        return {
          chain: chain.name,
          chainKey,
          token: tokenSymbol,
          contractAddress: tokenInfo.address,
          balance: ethers.formatUnits(balance, tokenInfo.decimals),
          rawBalance: balance.toString(),
          decimals: tokenInfo.decimals,
          isNative: false
        };
      } catch (error) {
        if (attempt === this.options.retryAttempts) {
          console.error(`[${chain.name}] 查询 ${tokenSymbol} 余额失败:`, error.message);
          return {
            chain: chain.name,
            chainKey,
            token: tokenSymbol,
            contractAddress: tokenInfo.address,
            balance: '0',
            error: error.message,
            isNative: false
          };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * 查询单个钱包在指定链上的所有余额
   */
  async queryWalletOnChain(chainKey, address, tokens = [], customRpc = null) {
    const results = [];
    
    // 查询原生代币
    const nativeBalance = await this.getNativeBalance(chainKey, address, customRpc);
    results.push(nativeBalance);

    // 查询 ERC-20 代币
    for (const tokenSymbol of tokens) {
      const tokenBalance = await this.getTokenBalance(chainKey, address, tokenSymbol, customRpc);
      results.push(tokenBalance);
    }

    return results;
  }

  /**
   * 查询单个钱包在所有指定链上的余额
   */
  async queryWallet(address, chains, tokensConfig = {}, customRpcConfig = {}) {
    const allResults = [];

    for (const chainKey of chains) {
      console.log(`\n正在查询 ${this.chainConfig[chainKey]?.name || chainKey}...`);
      const tokens = tokensConfig[chainKey] || [];
      const customRpc = customRpcConfig[chainKey];
      
      const chainResults = await this.queryWalletOnChain(chainKey, address, tokens, customRpc);
      allResults.push(...chainResults);
    }

    return allResults;
  }

  /**
   * 批量查询多个钱包
   */
  async queryMultipleWallets(addresses, chains, tokensConfig = {}, customRpcConfig = {}) {
    const walletResults = {};

    for (const address of addresses) {
      console.log(`\n========================================`);
      console.log(`查询钱包: ${address}`);
      console.log(`========================================`);
      
      const results = await this.queryWallet(address, chains, tokensConfig, customRpcConfig);
      walletResults[address] = results;
    }

    return walletResults;
  }

  /**
   * 关闭所有 provider 连接
   */
  async cleanup() {
    for (const provider of Object.values(this.providers)) {
      if (provider.destroy) {
        await provider.destroy();
      }
    }
    this.providers = {};
  }
}

module.exports = BalanceChecker;
