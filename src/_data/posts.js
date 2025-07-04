const { isContentfulConfigured, getContentfulEntries, transformContentfulItems } = require('./contentful-client');
const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // Contentfulの設定をチェック
  if (!isContentfulConfigured()) {
    console.log('Contentfulの設定が不完全です。サンプルデータを返します。');
    return getSampleData();
  }

  try {
    const items = await getContentfulEntries();
    console.log(`Contentfulから${items.length}件の記事を取得しました。`);
    return transformContentfulItems(items);
  } catch (error) {
    console.error('Contentfulからの記事取得エラー:', error);
    return getSampleData();
  }
};

function getSampleData() {
  try {
    // テスト用JSONファイルからデータを読み込み
    const testDataPath = path.join(__dirname, '../../debug/test-posts.json');
    
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
      return testData;
    } else {
      return [];
    }
  } catch (error) {
    console.error('テストデータ読み込みエラー:', error);
    return [];
  }
}
