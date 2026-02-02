import { NextResponse } from 'next/server';

// CoinGecko token ID 映射
const TOKEN_IDS: Record<string, string> = {
    'ETH': 'ethereum',
    'BNB': 'binancecoin',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'FTM': 'fantom',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'DAI': 'dai',
    'WETH': 'weth',
    'WBNB': 'wbnb',
    'WMATIC': 'wmatic',
    'ARB': 'arbitrum',
    'OP': 'optimism',
    'WAVAX': 'wrapped-avax',
    'WFTM': 'wrapped-fantom'
};

export async function POST(request: Request) {
    try {
        const { tokens } = await request.json();

        if (!tokens || !Array.isArray(tokens)) {
            return NextResponse.json({ success: false, error: 'Invalid tokens' }, { status: 400 });
        }

        // 获取唯一的 token IDs
        const uniqueTokens = [...new Set(tokens)];
        const tokenIds = uniqueTokens
            .map(symbol => TOKEN_IDS[symbol])
            .filter(id => id)
            .join(',');

        if (!tokenIds) {
            return NextResponse.json({ success: true, prices: {} });
        }

        // 调用 CoinGecko API
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }

        const data = await response.json();

        // 转换回 symbol => price 格式
        const prices: Record<string, number> = {};
        for (const [symbol, id] of Object.entries(TOKEN_IDS)) {
            if (data[id]?.usd) {
                prices[symbol] = data[id].usd;
            }
        }

        return NextResponse.json({ success: true, prices });
    } catch (error: any) {
        console.error('Price fetch error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch prices'
        }, { status: 500 });
    }
}
