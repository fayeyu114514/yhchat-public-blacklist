const fs = require('fs-extra');
const path = require('path');
const { parse } = require('csv-parse/sync');
const iconv = require('iconv-lite');
const jschardet = require('jschardet'); // 添加自动检测编码

// 配置
const CSV_DIR = path.join(__dirname, 'csv');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function processCsvFiles() {
  try {
    await fs.ensureDir(OUTPUT_DIR);
    
    const files = await fs.readdir(CSV_DIR);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      console.log('没有找到CSV文件');
      return;
    }
    
    for (const csvFile of csvFiles) {
      const csvPath = path.join(CSV_DIR, csvFile);
      const jsonFileName = path.basename(csvFile, '.csv') + '.json';
      const jsonPath = path.join(OUTPUT_DIR, jsonFileName);
      
      console.log(`处理文件: ${csvFile} -> ${jsonFileName}`);
      
      // 读取文件并检测编码
      const csvBuffer = await fs.readFile(csvPath);
      const detected = jschardet.detect(csvBuffer);
      const encoding = detected.encoding.toLowerCase();
      
      console.log(`检测到编码: ${encoding}`);
      
      // 解码文件内容
      const csvContent = iconv.decode(csvBuffer, encoding);
      
      // 解析CSV
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true
      });
      
      // 写入JSON文件
      await fs.writeFile(jsonPath, JSON.stringify(records, null, 2), 'utf8');
      console.log(`成功生成: ${jsonFileName}`);
    }
    
    console.log('所有CSV文件处理完成');
  } catch (error) {
    console.error('处理过程中出错:', error);
    process.exit(1);
  }
}

processCsvFiles();