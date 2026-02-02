const BalanceChecker = require('./balance-checker');
const {
    isValidAddress,
    loadJsonFile,
    saveJsonFile,
    saveCsvFile,
    filterZeroBalances,
    createBalanceTable,
    displaySummary
} = require('./utils');
const path = require('path');

async function main() {
    console.log('========================================');
    console.log('🔍 多链钱包余额查询工具');
    console.log('========================================\n');

    // 解析命令行参数
    const args = process.argv.slice(2);
    let configPath = 'config.json';

    // 支持 --config 参数指定配置文件
    const configIndex = args.indexOf('--config');
    if (configIndex !== -1 && args[configIndex + 1]) {
        configPath = args[configIndex + 1];
    }

    // 检查配置文件是否存在
    try {
        await loadJsonFile(configPath);
    } catch (error) {
        console.log(`⚠️  未找到配置文件: ${configPath}`);
        console.log(`📝 请复制 config.example.json 为 config.json 并修改配置\n`);

        // 尝试使用示例配置
        configPath = 'config.example.json';
        console.log(`使用示例配置文件: ${configPath}\n`);
    }

    try {
        // 加载配置文件
        const config = await loadJsonFile(configPath);
        const chains = await loadJsonFile('./chains.json');
        const tokens = await loadJsonFile('./tokens.json');

        // 验证配置
        if (!config.wallets || config.wallets.length === 0) {
            throw new Error('配置文件中未指定钱包地址');
        }

        if (!config.chains || config.chains.length === 0) {
            throw new Error('配置文件中未指定要查询的链');
        }

        // 验证钱包地址
        for (const wallet of config.wallets) {
            if (!isValidAddress(wallet)) {
                throw new Error(`无效的钱包地址: ${wallet}`);
            }
        }

        // 验证链配置
        for (const chainKey of config.chains) {
            if (!chains[chainKey]) {
                throw new Error(`不支持的链: ${chainKey}`);
            }
        }

        console.log(`📋 配置信息:`);
        console.log(`   钱包数量: ${config.wallets.length}`);
        console.log(`   查询链数: ${config.chains.length}`);
        console.log(`   链列表: ${config.chains.join(', ')}\n`);

        // 创建余额查询器
        const checker = new BalanceChecker(chains, tokens, config.options);

        // 执行查询
        console.log('开始查询...\n');
        const startTime = Date.now();

        const results = await checker.queryMultipleWallets(
            config.wallets,
            config.chains,
            config.tokens || {},
            config.customRpc || {}
        );

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        // 过滤零余额
        const filteredResults = filterZeroBalances(
            results,
            config.options?.showZeroBalances || false
        );

        // 显示结果
        console.log('\n\n========================================');
        console.log('📈 查询结果');
        console.log('========================================\n');

        for (const [wallet, balances] of Object.entries(filteredResults)) {
            console.log(`\n钱包: ${wallet}`);
            console.log('----------------------------------------');

            if (balances.length === 0) {
                console.log('  (无余额或已过滤零余额)');
            } else {
                console.log(createBalanceTable(balances));
            }
        }

        // 显示汇总
        displaySummary(results);
        console.log(`⏱️  查询耗时: ${duration} 秒\n`);

        // 保存结果
        if (config.output?.json) {
            const jsonFile = config.output.jsonFile || 'balances.json';
            await saveJsonFile(jsonFile, {
                timestamp: new Date().toISOString(),
                duration: `${duration}s`,
                wallets: config.wallets,
                chains: config.chains,
                results: filteredResults
            });
        }

        if (config.output?.csv) {
            const csvFile = config.output.csvFile || 'balances.csv';
            await saveCsvFile(csvFile, filteredResults);
        }

        // 清理
        await checker.cleanup();

        console.log('✅ 查询完成!\n');

    } catch (error) {
        console.error('\n❌ 错误:', error.message);
        console.error('\n请检查配置文件和网络连接\n');
        process.exit(1);
    }
}

// 运行主程序
if (require.main === module) {
    main().catch(console.error);
}

module.exports = main;
