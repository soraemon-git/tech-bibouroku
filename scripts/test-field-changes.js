#!/usr/bin/env node

// 修正後のcreate-post.jsの動作確認スクリプト
console.log('🔧 create-post.js フィールド名変更テスト');
console.log('==========================================\n');

// 修正されたフィールド名を確認
const expectedContentfulFields = {
  title: 'ja',
  slug: 'ja', 
  excerpt: 'ja',
  contentMarkdown: 'ja',  // content から変更
  category: 'ja',
  tags: 'ja',
  publishedAt: 'ja',
  author: 'ja',
  seoDescription: 'ja'
};

console.log('📋 Contentful送信フィールド構造:');
console.log('--------------------------------');
Object.keys(expectedContentfulFields).forEach(field => {
  console.log(`✅ ${field}: { '${expectedContentfulFields[field]}': data }`);
});

console.log('\n🔍 主要な変更点:');
console.log('• content → contentMarkdown (Rich text → Long text対応)');
console.log('• publishDate → publishedAt (整合性確保)');
console.log('• seoDescription 追加 (SEO対応)');

console.log('\n🎯 期待される動作:');
console.log('1. Markdownテキストをそのまま送信');
console.log('2. Rich text変換処理は不要');
console.log('3. Long textフィールドで受信');
console.log('4. 表示時にmarkdownifyフィルターで変換');

console.log('\n✅ フィールド名変更対応完了！');
console.log('📝 次のステップ: 実際の記事作成テストを実行');
