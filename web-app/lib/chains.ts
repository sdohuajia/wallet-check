// 链配置类型定义
export interface ChainConfig {
    chainId: number;
    name: string;
    rpc: string[];
    explorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
}

// 支持的链配置
export const chains: Record<string, ChainConfig> = {
    ethereum: {
        chainId: 1,
        name: "Ethereum",
        rpc: [
            "https://eth.llamarpc.com",
            "https://rpc.ankr.com/eth",
            "https://ethereum.publicnode.com"
        ],
        explorer: "https://etherscan.io",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        }
    },
    bsc: {
        chainId: 56,
        name: "BNB Smart Chain",
        rpc: [
            "https://bsc-dataseed.binance.org",
            "https://rpc.ankr.com/bsc",
            "https://bsc.publicnode.com"
        ],
        explorer: "https://bscscan.com",
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
        }
    },
    polygon: {
        chainId: 137,
        name: "Polygon",
        rpc: [
            "https://polygon-rpc.com",
            "https://rpc.ankr.com/polygon",
            "https://polygon.llamarpc.com"
        ],
        explorer: "https://polygonscan.com",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        }
    },
    arbitrum: {
        chainId: 42161,
        name: "Arbitrum One",
        rpc: [
            "https://arb1.arbitrum.io/rpc",
            "https://rpc.ankr.com/arbitrum",
            "https://arbitrum.llamarpc.com"
        ],
        explorer: "https://arbiscan.io",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        }
    },
    optimism: {
        chainId: 10,
        name: "Optimism",
        rpc: [
            "https://mainnet.optimism.io",
            "https://rpc.ankr.com/optimism",
            "https://optimism.llamarpc.com"
        ],
        explorer: "https://optimistic.etherscan.io",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        }
    },
    base: {
        chainId: 8453,
        name: "Base",
        rpc: [
            "https://mainnet.base.org",
            "https://base.llamarpc.com",
            "https://base.publicnode.com"
        ],
        explorer: "https://basescan.org",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        }
    },
    avalanche: {
        chainId: 43114,
        name: "Avalanche C-Chain",
        rpc: [
            "https://api.avax.network/ext/bc/C/rpc",
            "https://rpc.ankr.com/avalanche",
            "https://avalanche.public-rpc.com"
        ],
        explorer: "https://snowtrace.io",
        nativeCurrency: {
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18
        }
    },
    fantom: {
        chainId: 250,
        name: "Fantom",
        rpc: [
            "https://rpc.ftm.tools",
            "https://rpc.ankr.com/fantom",
            "https://fantom.publicnode.com"
        ],
        explorer: "https://ftmscan.com",
        nativeCurrency: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18
        }
    }
};

// 获取所有链的列表
export function getAllChains() {
    return Object.entries(chains).map(([key, config]) => ({
        key,
        ...config
    }));
}

// 获取单个链配置
export function getChainConfig(chainKey: string): ChainConfig | null {
    return chains[chainKey] || null;
}
