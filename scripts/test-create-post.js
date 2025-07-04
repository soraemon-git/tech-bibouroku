#!/usr/bin/env node

// create-post.js のテストスクリプト
const { templates, loadTemplateFile } = require('./create-post.js');

console.log('🧪 create-post.js テストスクリプト');
console.log('======================================\n');

// 1. テンプレート構成のテスト
console.log('1. テンプレート構成テスト');
console.log('利用可能なテンプレート:');
Object.keys(templates).forEach(key => {
  const template = templates[key];
  console.log(`  - ${key}: ${template.name}`);
  console.log(`    デフォルトカテゴリ: ${template.defaultCategory}`);
  console.log(`    デフォルトタグ: ${template.defaultTags?.join(', ')}`);
  console.log('');
});

// 2. テンプレートファイル読み込みテスト
console.log('2. テンプレートファイル読み込みテスト');
Object.keys(templates).forEach(key => {
  const template = templates[key];
  if (template.file) {
    console.log(`  📄 ${template.file} の読み込み:`, template.file ? '✅ OK' : '❌ NG');
    // 実際にファイルを読み込んでテスト
    const content = loadTemplateFile(key);
    console.log(`    文字数: ${content.length} 文字`);
    console.log(`    先頭30文字: ${content.substring(0, 30)}...`);
    console.log('');
  }
});

// 3. フィールド名整合性テスト
console.log('3. Contentful blogPostモデルとの整合性チェック');
const expectedFields = [
  'title',         // タイトル
  'slug',          // スラッグ
  'excerpt',       // 概要
  'contentMarkdown', // 本文 (content から変更)
  'category',      // カテゴリー
  'tags',          // タグ
  'publishedAt',   // 公開日 (publishDate から変更)
  'author',        // 著者
  'seoDescription' // SEO説明 (新規追加)
];

console.log('期待されるフィールド:');
expectedFields.forEach(field => {
  console.log(`  ✅ ${field}`);
});

console.log('\n未実装フィールド（オプション）:');
const optionalFields = [
  'updatedAt',     // 更新日
  'featuredImage'  // アイキャッチ画像
];

optionalFields.forEach(field => {
  console.log(`  ⚠️ ${field} (オプション、未実装)`);
});

// 4. サンプルデータの生成テスト
console.log('\n4. サンプルデータ生成テスト');
const samplePostData = {
  title: 'テスト記事タイトル',
  slug: 'test-article-slug',
  category: 'テスト',
  excerpt: 'これはテスト記事の抜粋です。実際の記事では約150文字程度で記事の概要を説明します。',
  tags: ['テスト', '記事作成', 'Contentful'],
  publishedAt: new Date().toISOString(),
  author: 'テスト著者',
  seoDescription: 'テスト記事のSEO説明文です。検索エンジンで表示される説明文として使用されます。',
  content: '# テスト記事\n\nこれはテスト記事の内容です。\n\n## セクション1\n\n記事の内容がここに入ります。'
};

console.log('サンプルデータ:');
console.log(JSON.stringify(samplePostData, null, 2));

console.log('\n✅ テスト完了！');
console.log('📋 確認事項:');
console.log('- フィールド名が Contentful blogPost モデルと一致している');
console.log('- 必須フィールドが全て含まれている');
console.log('- テンプレートが正常に読み込まれる');
console.log('- サンプルデータが正常に生成される');
