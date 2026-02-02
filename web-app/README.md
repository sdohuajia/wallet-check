<<<<<<< HEAD
# 多链钱包余额查询 Web 应用

一个现代化的多链钱包余额查询 Web 应用,支持部署到 Vercel。

## ✨ 功能特性

- 🌐 支持 8+ 主流区块链网络
- 💰 查询原生代币和 ERC-20 代币余额
- 🎨 美观的渐变 UI 设计
- 📊 实时查询结果展示
- 📥 支持 JSON/CSV 格式导出
- 📱 完全响应式设计
- ⚡ Vercel 一键部署

## 🚀 本地开发

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📦 部署到 Vercel

### 方法 1: 通过 GitHub (推荐)

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建新仓库
   - 将代码推送到仓库

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js (自动检测)
   - Root Directory: `./web-app` (如果在子目录)
   - Build Command: `npm run build` (自动)
   - Output Directory: `.next` (自动)

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成
   - 获取部署 URL

### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

## 🌐 支持的区块链

| 区块链 | 原生代币 | 支持的代币 |
|--------|----------|------------|
| Ethereum | ETH | USDT, USDC, DAI, WETH |
| BSC | BNB | USDT, USDC, WBNB |
| Polygon | MATIC | USDT, USDC, WMATIC |
| Arbitrum | ETH | USDT, USDC, ARB |
| Optimism | ETH | USDT, USDC, OP |
| Base | ETH | USDC, WETH |
| Avalanche | AVAX | USDT, USDC, WAVAX |
| Fantom | FTM | USDT, USDC, WFTM |

## 🔧 配置

### 添加新的区块链

编辑 `lib/chains.ts`:

```typescript
export const chains: Record<string, ChainConfig> = {
  // ... 现有链
  newchain: {
    chainId: 123,
    name: "New Chain",
    rpc: ["https://rpc.newchain.com"],
    explorer: "https://explorer.newchain.com",
    nativeCurrency: {
      name: "New Token",
      symbol: "NEW",
      decimals: 18
    }
  }
};
```

### 添加新的代币

编辑 `lib/tokens.ts`:

```typescript
export const tokens: Record<string, Record<string, TokenConfig>> = {
  ethereum: {
    // ... 现有代币
    NEWTOKEN: {
      address: "0x...",
      decimals: 18,
      symbol: "NEWTOKEN"
    }
  }
};
```

## 📝 API 端点

### GET /api/chains
获取支持的区块链列表

### GET /api/tokens
获取支持的代币列表

### POST /api/balance
查询钱包余额

请求体:
```json
{
  "address": "0x...",
  "selectedChains": ["ethereum", "bsc"],
  "selectedTokens": {
    "ethereum": ["USDT", "USDC"],
    "bsc": ["USDT", "USDC"]
  }
}
```

## ⚠️ 注意事项

### Vercel 限制

- **Hobby 计划**: API 函数最长执行时间 10 秒
- **Pro 计划**: API 函数最长执行时间 60 秒

建议:
- 限制单次查询的链和代币数量
- 使用更快的 RPC 节点
- 考虑升级到 Pro 计划

### RPC 节点

应用使用免费的公共 RPC 节点,可能会有以下限制:
- 请求速率限制
- 偶尔的不稳定性
- 较慢的响应时间

建议:
- 使用付费 RPC 服务 (Infura, Alchemy)
- 在 `lib/chains.ts` 中配置自定义 RPC

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **区块链**: ethers.js
- **部署**: Vercel

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!
=======
# wallet-check
>>>>>>> 881c61c0ceafb8a483a81b1bf452f92f7159f49f
