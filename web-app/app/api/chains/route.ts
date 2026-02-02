import { NextResponse } from 'next/server';
import { getAllChains } from '@/lib/chains';

export async function GET() {
    try {
        const chainsList = getAllChains();

        return NextResponse.json({
            success: true,
            chains: chainsList
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '获取链列表失败' },
            { status: 500 }
        );
    }
}
