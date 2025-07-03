console.log('=== test.js が実行されました ===');

module.exports = function() {
  console.log('=== test.js 関数が実行されました ===');
  return {
    message: "テストデータです",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  };
};
