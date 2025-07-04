// テストデータファイル

module.exports = function() {
  return {
    message: "テストデータです",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  };
};
