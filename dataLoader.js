// 数据加载模块

// 读取JSON文件
function loadJSON(filePath) {
  return fetch(filePath)
    .then(response => response.json());
}

// 导出模块
module.exports = {
  loadJSON
};