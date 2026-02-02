const { ethers } = require('ethers');
const fs = require('fs').promises;
const { createObjectCsvWriter } = require('csv-writer');

/**
 * 验证以太坊地址
 */
function isValidAddress(address) {
    try {
        return ethers.isAddress(address);
    } catch {
        return false;
    }
}

/**
 * 格式化余额显示
 */
function formatBalance(balance, decimals = 18) {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(4);
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/**
 * 读取 JSON 配置文件
 */
async function loadJsonFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`读取文件失败 ${filePath}: ${error.message}`);
    }
}

/**
 * 保存 JSON 文件
 */
async function saveJsonFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`\n✅ 已保存到: ${filePath}`);
    } catch (error) {
        console.error(`❌ 保存文件失败 ${filePath}:`, error.message);
    }
}

/**
 * 保存 CSV 文件
 */
async function saveCsvFile(filePath, data) {
    try {
        // 扁平化数据结构
        const flatData = [];
        for (const [wallet, balances] of Object.entries(data)) {
            for (const balance of balances) {
                flatData.push({
                    wallet,
                    chain: balance.chain,
                    token: balance.token,
                    balance: balance.balance,
                    contractAddress: balance.contractAddress || 'Native',
                    error: balance.error || ''
                });
            }
        }

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'wallet', title: '钱包地址' },
                { id: 'chain', title: '链' },
                { id: 'token', title: '代币' },
                { id: 'balance', title: '余额' },
                { id: 'contractAddress', title: '合约地址' },
                { id: 'error', title: '错误' }
            ]
        });

        await csvWriter.writeRecords(flatData);
        console.log(`✅ 已保存到: ${filePath}`);
    } catch (error) {
        console.error(`❌ 保存 CSV 文件失败 ${filePath}:`, error.message);
    }
}

/**
 * 过滤零余额
 */
function filterZeroBalances(results, showZero = false) {
    if (showZero) return results;

    const filtered = {};
    for (const [wallet, balances] of Object.entries(results)) {
        filtered[wallet] = balances.filter(b => {
            const balance = parseFloat(b.balance);
            return balance > 0 || b.error;
        });
    }
    return filtered;
}

/**
 * 计算总价值 (需要价格数据,这里只是占位)
 */
function calculateTotalValue(results, prices = {}) {
    // TODO: 集成价格 API (CoinGecko, CoinMarketCap 等)
    return null;
}

/**
 * 创建控制台表格显示
 */
function createBalanceTable(balances) {
    const Table = require('cli-table3');

    const table = new Table({
        head: ['链', '代币', '余额', '状态'],
        colWidths: [20, 15, 25, 15],
        style: {
            head: ['cyan'],
            border: ['grey']
        }
    });

    for (const balance of balances) {
        const status = balance.error ? '❌ 失败' : '✅';
        const balanceStr = balance.error ? balance.error : formatBalance(balance.balance);

        table.push([
            balance.chain,
            balance.token,
            balanceStr,
            status
        ]);
    }

    return table.toString();
}

/**
 * 显示汇总信息
 */
function displaySummary(results) {
    let totalChains = new Set();
    let totalTokens = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const balances of Object.values(results)) {
        for (const balance of balances) {
            totalChains.add(balance.chainKey);
            totalTokens++;
            if (balance.error) {
                errorCount++;
            } else if (parseFloat(balance.balance) > 0) {
                successCount++;
            }
        }
    }

    console.log('\n========================================');
    console.log('📊 查询汇总');
    console.log('========================================');
    console.log(`钱包数量: ${Object.keys(results).length}`);
    console.log(`查询链数: ${totalChains.size}`);
    console.log(`查询代币: ${totalTokens}`);
    console.log(`有余额的: ${successCount}`);
    console.log(`查询失败: ${errorCount}`);
    console.log('========================================\n');
}

/**
 * 延迟函数
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    isValidAddress,
    formatBalance,
    loadJsonFile,
    saveJsonFile,
    saveCsvFile,
    filterZeroBalances,
    calculateTotalValue,
    createBalanceTable,
    displaySummary,
    sleep
};
