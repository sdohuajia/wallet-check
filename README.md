# 多链钱包余额查询工具

一个功能强大的多链钱包余额查询工具,支持所有主流 EVM 兼容区块链网络。

## ✨ 功能特性

- 🌐 **支持 16+ 主流区块链**
  - Ethereum, BSC, Polygon, Arbitrum, Optimism, Base
  - Avalanche, Fantom, Linea, zkSync Era, Scroll
  - Mantle, Blast, opBNB, Celo, Gnosis Chain

- 💰 **全面的余额查询**
  - 原生代币余额 (ETH, BNB, MATIC 等)
  - ERC-20 代币余额 (USDT, USDC, DAI 等)
  - 批量查询多个钱包地址
  - 自定义代币列表

- 📊 **灵活的输出格式**
  - 美化的控制台表格显示
  - JSON 格式导出
  - CSV 格式导出
  - 可过滤零余额

- ⚙️ **高级配置选项**
  - 自定义 RPC 节点
  - 重试机制和超时设置
  - 支持代理配置

## 📦 安装

### 前置要求

- Node.js 16.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆或下载项目到本地

2. 安装依赖:
```bash
npm install
```

## 🚀 快速开始

### 1. 创建配置文件

复制示例配置文件并修改:

```bash
cp config.example.json config.json
```

### 2. 编辑配置文件

打开 `config.json` 并修改以下内容:

```json
{
  "wallets": [
    "0x你的钱包地址1",
    "0x你的钱包地址2"
  ],
  "chains": [
    "ethereum",
    "bsc",
    "polygon",
    "arbitrum"
  ],
  "tokens": {
    "ethereum": ["USDT", "USDC", "WETH"],
    "bsc": ["USDT", "USDC", "WBNB"],
    "polygon": ["USDT", "USDC", "WMATIC"],
    "arbitrum": ["USDT", "USDC", "ARB"]
  }
}
```

### 3. 运行查询

```bash
npm start
```

或使用自定义配置文件:

```bash
node index.js --config my-config.json
```

## 📖 配置说明

### 完整配置示例

```json
{
  "wallets": [
    "0x0000000000000000000000000000000000000000"
  ],
  "chains": [
    "ethereum",
    "bsc",
    "polygon",
    "arbitrum",
    "optimism",
    "base"
  ],
  "tokens": {
    "ethereum": ["USDT", "USDC", "WETH"],
    "bsc": ["USDT", "USDC", "WBNB"],
    "polygon": ["USDT", "USDC", "WMATIC"],
    "arbitrum": ["USDT", "USDC", "ARB"],
    "optimism": ["USDT", "USDC", "OP"],
    "base": ["USDC", "WETH"]
  },
  "customRpc": {
    "ethereum": "https://your-custom-rpc.com"
  },
  "output": {
    "console": true,
    "json": true,
    "csv": true,
    "jsonFile": "balances.json",
    "csvFile": "balances.csv"
  },
  "options": {
    "showZeroBalances": false,
    "retryAttempts": 3,
    "timeout": 30000
  }
}
```

### 配置项说明

| 配置项 | 说明 | 必填 |
|--------|------|------|
| `wallets` | 要查询的钱包地址数组 | ✅ |
| `chains` | 要查询的区块链列表 | ✅ |
| `tokens` | 每条链要查询的代币列表 | ❌ |
| `customRpc` | 自定义 RPC 节点 | ❌ |
| `output.console` | 是否在控制台显示 | ❌ |
| `output.json` | 是否导出 JSON | ❌ |
| `output.csv` | 是否导出 CSV | ❌ |
| `options.showZeroBalances` | 是否显示零余额 | ❌ |
| `options.retryAttempts` | 失败重试次数 | ❌ |
| `options.timeout` | 请求超时时间(毫秒) | ❌ |

## 🌐 支持的区块链

| 链名称 | 配置键 | 原生代币 |
|--------|--------|----------|
| Ethereum | `ethereum` | ETH |
| BNB Smart Chain | `bsc` | BNB |
| Polygon | `polygon` | MATIC |
| Arbitrum One | `arbitrum` | ETH |
| Optimism | `optimism` | ETH |
| Base | `base` | ETH |
| Avalanche C-Chain | `avalanche` | AVAX |
| Fantom | `fantom` | FTM |
| Linea | `linea` | ETH |
| zkSync Era | `zksync` | ETH |
| Scroll | `scroll` | ETH |
| Mantle | `mantle` | MNT |
| Blast | `blast` | ETH |
| opBNB | `opbnb` | BNB |
| Celo | `celo` | CELO |
| Gnosis Chain | `gnosis` | xDAI |

## 💎 支持的代币

工具预配置了主流稳定币和代币:

- **稳定币**: USDT, USDC, DAI, BUSD
- **包装代币**: WETH, WBNB, WMATIC, WAVAX
- **原生代币**: ARB, OP, CAKE, LINK
- 更多代币请查看 `tokens.json`

### 添加自定义代币

编辑 `tokens.json` 文件,添加新的代币配置:

```json
{
  "ethereum": {
    "YOUR_TOKEN": {
      "address": "0x代币合约地址",
      "decimals": 18,
      "symbol": "YOUR_TOKEN"
    }
  }
}
```

## 📊 输出示例

### 控制台输出

```
========================================
🔍 多链钱包余额查询工具
========================================

📋 配置信息:
   钱包数量: 1
   查询链数: 3
   链列表: ethereum, bsc, polygon

开始查询...

正在查询 Ethereum...
正在查询 BNB Smart Chain...
正在查询 Polygon...

========================================
📈 查询结果
========================================

钱包: 0x1234...5678
----------------------------------------
┌────────────────────┬───────────────┬─────────────────────────┬───────────────┐
│ 链                 │ 代币          │ 余额                    │ 状态          │
├────────────────────┼───────────────┼─────────────────────────┼───────────────┤
│ Ethereum           │ ETH           │ 1.2345                  │ ✅            │
│ Ethereum           │ USDT          │ 1,000.00                │ ✅            │
│ BNB Smart Chain    │ BNB           │ 0.5678                  │ ✅            │
│ Polygon            │ MATIC         │ 100.00                  │ ✅            │
└────────────────────┴───────────────┴─────────────────────────┴───────────────┘

========================================
📊 查询汇总
========================================
钱包数量: 1
查询链数: 3
查询代币: 12
有余额的: 4
查询失败: 0
========================================

⏱️  查询耗时: 5.23 秒

✅ 已保存到: balances.json
✅ 已保存到: balances.csv
✅ 查询完成!
```

## 🔧 高级用法

### 使用自定义 RPC 节点

在配置文件中添加 `customRpc`:

```json
{
  "customRpc": {
    "ethereum": "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
    "polygon": "https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY"
  }
}
```

### 使用环境变量

创建 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env` 添加 API 密钥或代理设置。

### 批量查询多个钱包

在 `wallets` 数组中添加多个地址:

```json
{
  "wallets": [
    "0x地址1",
    "0x地址2",
    "0x地址3"
  ]
}
```

## ❓ 常见问题

### Q: 查询失败怎么办?

A: 检查以下几点:
1. 网络连接是否正常
2. RPC 节点是否可用(可尝试更换 RPC)
3. 钱包地址是否正确
4. 代币配置是否正确

### Q: 如何加快查询速度?

A: 
1. 使用付费的 RPC 服务(Infura, Alchemy)
2. 减少查询的链和代币数量
3. 使用更稳定的网络连接

### Q: 支持非 EVM 链吗?

A: 目前仅支持 EVM 兼容链。非 EVM 链(如 Solana, Cosmos)需要不同的实现。

### Q: 如何添加新的区块链?

A: 编辑 `chains.json`,按照现有格式添加新链的配置。

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## ⚠️ 免责声明

本工具仅用于查询余额,不涉及任何资金操作。使用本工具时请注意保护好您的私钥,不要将私钥泄露给任何人。
