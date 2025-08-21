const fs = require('fs-extra');
const path = require('path');
const { parse } = require('csv-parse/sync');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');

// 配置
const CSV_DIR = path.join(__dirname, 'csv');
const STATIC_DIR = path.join(__dirname, 'files'); // 静态文件目录
const OUTPUT_DIR = path.join(__dirname, '../public');

async function copyStaticFiles() {
  try {
    // 检查静态文件目录是否存在
    const staticExists = await fs.pathExists(STATIC_DIR);
    if (!staticExists) {
      console.log('静态文件目录不存在，跳过复制');
      return;
    }

    // 复制整个静态文件目录到输出目录
    await fs.copy(STATIC_DIR, OUTPUT_DIR, {
      overwrite: true,
      errorOnExist: false
    });
    
    console.log('静态文件复制完成');
  } catch (error) {
    console.error('复制静态文件时出错:', error);
  }
}

async function processCsvFiles() {
  try {
    // 确保输出目录存在
    await fs.ensureDir(OUTPUT_DIR);
    
    // 检查CSV目录是否存在
    const csvDirExists = await fs.pathExists(CSV_DIR);
    if (!csvDirExists) {
      console.log('CSV目录不存在，跳过CSV处理');
      return;
    }
    
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
      
      console.log(`处理CSV文件: ${csvFile} -> ${jsonFileName}`);
      
      // 读取文件并检测编码
      const csvBuffer = await fs.readFile(csvPath);
      const detected = jschardet.detect(csvBuffer);
      const encoding = detected.encoding ? detected.encoding.toLowerCase() : 'utf8';
      
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
      console.log(`成功生成JSON: ${jsonFileName}`);
    }
    
    console.log('所有CSV文件处理完成');
  } catch (error) {
    console.error('处理CSV文件时出错:', error);
  }
}

async function main() {
  console.log('开始构建...');
  
  // 1. 首先复制静态文件
  await copyStaticFiles();
  
  // 2. 然后处理CSV文件
  await processCsvFiles();
  
  console.log('构建完成！');
}

main().catch(console.error);