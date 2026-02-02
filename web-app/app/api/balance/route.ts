import { NextRequest, NextResponse } from 'next/server';
import { BalanceChecker } from '@/lib/balance-checker';
import { chains } from '@/lib/chains';
import { getTokensForChain } from '@/lib/tokens';
import { ethers } from 'ethers';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel Pro plan limit

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { address, selectedChains, selectedTokens } = body;

        // 验证输入
        if (!address || !ethers.isAddress(address)) {
            return NextResponse.json(
                { error: '无效的钱包地址' },
                { status: 400 }
            );
        }

        if (!selectedChains || selectedChains.length === 0) {
            return NextResponse.json(
                { error: '请至少选择一条区块链' },
                { status: 400 }
            );
        }

        // 创建余额查询器
        const checker = new BalanceChecker({
            retryAttempts: 2,
            timeout: 8000 // 8秒超时,留2秒缓冲
        });

        const allResults = [];

        // 查询每条链
        for (const chainKey of selectedChains) {
            const chainConfig = chains[chainKey];
            if (!chainConfig) {
                continue;
            }

            // 获取该链要查询的代币
            const chainTokens = getTokensForChain(chainKey);
            const tokensToQuery = selectedTokens?.[chainKey] || [];

            const tokenConfigs: Record<string, any> = {};
            for (const tokenSymbol of tokensToQuery) {
                if (chainTokens[tokenSymbol]) {
                    tokenConfigs[tokenSymbol] = chainTokens[tokenSymbol];
                }
            }

            try {
                const results = await checker.queryWalletOnChain(
                    chainKey,
                    chainConfig,
                    address,
                    tokenConfigs
                );
                allResults.push(...results);
            } catch (error: any) {
                console.error(`Error querying ${chainKey}:`, error);
                // 继续查询其他链
            }
        }

        // 清理资源
        checker.cleanup();

        return NextResponse.json({
            success: true,
            address,
            results: allResults,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Balance query error:', error);
        return NextResponse.json(
            { error: error.message || '查询失败' },
            { status: 500 }
        );
    }
}
