'use client';

import { useState, useEffect } from 'react';
import { BalanceResult } from '@/lib/balance-checker';

export default function Home() {
  const [address, setAddress] = useState('');
  const [chains, setChains] = useState<any[]>([]);
  const [tokens, setTokens] = useState<Record<string, any>>({});
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<BalanceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载链和代币列表
  useEffect(() => {
    Promise.all([
      fetch('/api/chains').then(r => r.json()),
      fetch('/api/tokens').then(r => r.json())
    ]).then(([chainsData, tokensData]) => {
      if (chainsData.success) setChains(chainsData.chains);
      if (tokensData.success) setTokens(tokensData.tokens);
    });
  }, []);

  // 处理链选择
  const toggleChain = (chainKey: string) => {
    setSelectedChains(prev =>
      prev.includes(chainKey)
        ? prev.filter(k => k !== chainKey)
        : [...prev, chainKey]
    );
  };

  // 处理代币选择
  const toggleToken = (chainKey: string, tokenSymbol: string) => {
    setSelectedTokens(prev => {
      const chainTokens = prev[chainKey] || [];
      const newChainTokens = chainTokens.includes(tokenSymbol)
        ? chainTokens.filter(t => t !== tokenSymbol)
        : [...chainTokens, tokenSymbol];

      return { ...prev, [chainKey]: newChainTokens };
    });
  };

  // 查询余额
  const handleQuery = async () => {
    if (!address) {
      setError('请输入钱包地址');
      return;
    }

    if (selectedChains.length === 0) {
      setError('请至少选择一条区块链');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          selectedChains,
          selectedTokens
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || '查询失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 导出 JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balances-${Date.now()}.json`;
    link.click();
  };

  // 导出 CSV
  const exportCSV = () => {
    const headers = ['链', '代币', '余额', '合约地址', '错误'];
    const rows = results.map(r => [
      r.chain,
      r.token,
      r.balance,
      r.contractAddress || 'Native',
      r.error || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balances-${Date.now()}.csv`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            🔍 多链钱包余额查询
          </h1>
          <p className="text-gray-300 text-lg">
            支持 {chains.length} 条主流区块链 · 实时查询 · 数据导出
          </p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
          {/* 钱包地址输入 */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              钱包地址
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* 链选择 */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              选择区块链 ({selectedChains.length} 已选)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chains.map((chain) => (
                <button
                  key={chain.key}
                  onClick={() => toggleChain(chain.key)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${selectedChains.includes(chain.key)
                      ? 'bg-purple-500 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>

          {/* 代币选择 */}
          {selectedChains.length > 0 && (
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                选择代币 (可选)
              </label>
              <div className="space-y-4">
                {selectedChains.map((chainKey) => {
                  const chainTokens = tokens[chainKey] || {};
                  const tokenList = Object.keys(chainTokens);

                  if (tokenList.length === 0) return null;

                  return (
                    <div key={chainKey} className="bg-white/5 rounded-xl p-4">
                      <div className="text-gray-300 mb-2 font-medium">
                        {chains.find(c => c.key === chainKey)?.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tokenList.map((tokenSymbol) => (
                          <button
                            key={tokenSymbol}
                            onClick={() => toggleToken(chainKey, tokenSymbol)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTokens[chainKey]?.includes(tokenSymbol)
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                              }`}
                          >
                            {tokenSymbol}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 查询按钮 */}
          <div className="flex gap-4">
            <button
              onClick={handleQuery}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? '查询中...' : '🚀 开始查询'}
            </button>
            {results.length > 0 && (
              <>
                <button
                  onClick={exportJSON}
                  className="px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
                >
                  📥 JSON
                </button>
                <button
                  onClick={exportCSV}
                  className="px-6 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
                >
                  📊 CSV
                </button>
              </>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
              ❌ {error}
            </div>
          )}

          {/* 结果展示 */}
          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                📊 查询结果
              </h2>
              <div className="bg-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-semibold">链</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">代币</th>
                        <th className="px-4 py-3 text-right text-white font-semibold">余额</th>
                        <th className="px-4 py-3 text-center text-white font-semibold">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, idx) => (
                        <tr key={idx} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3 text-gray-300">{result.chain}</td>
                          <td className="px-4 py-3 text-gray-300">{result.token}</td>
                          <td className="px-4 py-3 text-right text-white font-mono">
                            {parseFloat(result.balance) > 0
                              ? parseFloat(result.balance).toLocaleString(undefined, {
                                maximumFractionDigits: 6
                              })
                              : '0'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {result.error ? (
                              <span className="text-red-400">❌</span>
                            ) : parseFloat(result.balance) > 0 ? (
                              <span className="text-green-400">✅</span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm">总查询数</div>
                  <div className="text-white text-2xl font-bold">{results.length}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm">有余额</div>
                  <div className="text-green-400 text-2xl font-bold">
                    {results.filter(r => parseFloat(r.balance) > 0).length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-gray-400 text-sm">查询失败</div>
                  <div className="text-red-400 text-2xl font-bold">
                    {results.filter(r => r.error).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-8 text-gray-400">
          <p>支持 Ethereum · BSC · Polygon · Arbitrum · Optimism · Base · Avalanche · Fantom</p>
        </div>
      </div>
    </main>
  );
}
