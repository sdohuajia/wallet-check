// 代币配置类型定义
export interface TokenConfig {
    address: string;
    decimals: number;
    symbol: string;
}

// 代币配置
export const tokens: Record<string, Record<string, TokenConfig>> = {
    ethereum: {
        USDT: {
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decimals: 6,
            symbol: "USDC"
        },
        DAI: {
            address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            decimals: 18,
            symbol: "DAI"
        },
        WETH: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            decimals: 18,
            symbol: "WETH"
        }
    },
    bsc: {
        USDT: {
            address: "0x55d398326f99059fF775485246999027B3197955",
            decimals: 18,
            symbol: "USDT"
        },
        USDC: {
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            decimals: 18,
            symbol: "USDC"
        },
        WBNB: {
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            decimals: 18,
            symbol: "WBNB"
        }
    },
    polygon: {
        USDT: {
            address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
            decimals: 6,
            symbol: "USDC"
        },
        WMATIC: {
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            decimals: 18,
            symbol: "WMATIC"
        }
    },
    arbitrum: {
        USDT: {
            address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            decimals: 6,
            symbol: "USDC"
        },
        ARB: {
            address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
            decimals: 18,
            symbol: "ARB"
        }
    },
    optimism: {
        USDT: {
            address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
            decimals: 6,
            symbol: "USDC"
        },
        OP: {
            address: "0x4200000000000000000000000000000000000042",
            decimals: 18,
            symbol: "OP"
        }
    },
    base: {
        USDC: {
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            decimals: 6,
            symbol: "USDC"
        },
        WETH: {
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
            symbol: "WETH"
        }
    },
    avalanche: {
        USDT: {
            address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            decimals: 6,
            symbol: "USDC"
        },
        WAVAX: {
            address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            decimals: 18,
            symbol: "WAVAX"
        }
    },
    fantom: {
        USDT: {
            address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
            decimals: 6,
            symbol: "USDT"
        },
        USDC: {
            address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
            decimals: 6,
            symbol: "USDC"
        },
        WFTM: {
            address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
            decimals: 18,
            symbol: "WFTM"
        }
    }
};

// 获取指定链的所有代币
export function getTokensForChain(chainKey: string): Record<string, TokenConfig> {
    return tokens[chainKey] || {};
}

// 获取所有代币列表
export function getAllTokens() {
    return tokens;
}
