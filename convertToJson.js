const fs = require('fs');
const csv = require('csv-parser');

const data = [];

// 读取CSV文件并转换为JSON
fs.createReadStream('签诗.csv')
  .pipe(csv())
  .on('data', (row) => {
    // 确保所有字段都被正确处理
    const processedRow = {
      '序号': row['序号'],
      '签诗名称': row['签诗名称'],
      '原签诗': row['原签诗'],
      '核心解读': row['核心解读'],
      '深度解析': row['深度解析'],
      '运势维度解释': row['运势维度解释'],
      '有利时辰': row['有利时辰'],
      '方位指引': row['方位指引'],
      '签诗类型': row['签诗类型'] || '',
      '化解方法': row['化解方法'] || ''
    };
    data.push(processedRow);
  })
  .on('end', () => {
    // 将数据写入JSON文件
    fs.writeFileSync('签诗.json', JSON.stringify(data, null, 2));
    console.log('CSV文件已成功转换为JSON格式');
  });