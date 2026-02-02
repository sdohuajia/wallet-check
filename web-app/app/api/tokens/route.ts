import { NextResponse } from 'next/server';
import { getAllTokens } from '@/lib/tokens';

export async function GET() {
    try {
        const tokensList = getAllTokens();

        return NextResponse.json({
            success: true,
            tokens: tokensList
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '获取代币列表失败' },
            { status: 500 }
        );
    }
}
