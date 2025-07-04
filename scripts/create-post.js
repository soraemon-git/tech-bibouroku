#!/usr/bin/env node

const readline = require('readline');
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// 設定読み込み
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function confirm(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// テンプレート定義（拡張版）
const templates = {
  'product-review': {
    name: '製品レビュー',
    file: 'templates/product-review.md',
    structure: `# [製品名] 完全レビュー

## 📦 開封・外観

## ⚙️ スペック・機能

| 項目 | 詳細 |
|------|------|
| 製品名 | |
| 価格 | |
| 発売日 | |

## 🔧 使用感

### 良い点
- 

### 改善点
- 

## 💰 価格・コストパフォーマンス

## ✅ まとめ

**おすすめ度**: ⭐⭐⭐⭐⭐

**こんな人におすすめ**:
- 

---
*このレビューは実際の使用体験に基づいて作成されています。*`,
    defaultCategory: 'レビュー',
    defaultTags: ['レビュー', '製品']
  },
  'news': {
    name: 'ニュース記事',
    file: 'templates/news-article.md',
    structure: `# [ニュースタイトル]

## 📰 概要

## 🔍 詳細内容

## 💭 業界への影響

## 🎯 まとめ

---
*情報は発表時点のものです。最新情報は公式サイトをご確認ください。*`,
    defaultCategory: 'ニュース',
    defaultTags: ['ニュース']
  },
  'howto': {
    name: 'ハウツー・ガイド',
    file: 'templates/howto-guide.md',
    structure: `# [方法・手順] の完全ガイド

## 🎯 この記事で学べること

- 
- 
- 

## 📋 必要なもの

- 
- 

## 🚀 手順

### Step 1: 準備

### Step 2: 

### Step 3: 

## ⚠️ 注意点・トラブルシューティング

## 🎉 完了！

## 📚 参考リンク

- `,
    defaultCategory: 'ガイド',
    defaultTags: ['ガイド', 'ハウツー']
  },
  'comparison': {
    name: '比較記事',
    file: 'templates/comparison.md',
    structure: `# [製品A] vs [製品B] 徹底比較

## 📋 比較概要

## 📊 スペック比較

| 項目 | [製品A] | [製品B] |
|------|---------|---------|
| 価格 | | |
| 性能 | | |
| デザイン | | |

## 🔍 詳細比較

### デザイン・外観

### 性能・機能

### 価格・コストパフォーマンス

## 🎯 どちらを選ぶべき？

### [製品A]がおすすめな人
- 

### [製品B]がおすすめな人
- 

## ✅ まとめ`,
    defaultCategory: '比較',
    defaultTags: ['比較', 'レビュー']
  }
};

// テンプレートファイルを読み込む関数
function loadTemplateFile(templateKey) {
  const template = templates[templateKey];
  if (!template || !template.file) {
    return template.structure;
  }
  
  const templatePath = path.join(__dirname, '..', template.file);
  try {
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    } else {
      console.log(`⚠️ テンプレートファイル ${template.file} が見つかりません。基本テンプレートを使用します。`);
      return template.structure;
    }
  } catch (error) {
    console.log(`⚠️ テンプレートファイルの読み込みに失敗しました: ${error.message}`);
    return template.structure;
  }
}

async function selectTemplate() {
  console.log('\n📝 記事テンプレートを選択してください:');
  console.log('1. 製品レビュー（詳細版テンプレート）');
  console.log('2. ニュース記事（詳細版テンプレート）');
  console.log('3. ハウツー・ガイド（詳細版テンプレート）');
  console.log('4. 比較記事（詳細版テンプレート）');
  console.log('5. カスタム（テンプレートなし）');
  
  const choice = await ask('\n選択 (1-5)');
  
  switch (choice) {
    case '1': return 'product-review';
    case '2': return 'news';
    case '3': return 'howto';
    case '4': return 'comparison';
    case '5': return null;
    default: 
      console.log('無効な選択です。カスタムテンプレートを使用します。');
      return null;
  }
}

async function createContentfulPost(postData) {
  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    console.log('❌ CONTENTFUL_MANAGEMENT_TOKEN が設定されていません');
    console.log('📋 .env ファイルに以下を追加してください:');
    console.log('CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here');
    console.log('\n🔑 Management APIトークンの取得方法:');
    console.log('1. Contentfulダッシュボードにログイン');
    console.log('2. Settings → API keys → Content management tokens');
    console.log('3. Generate personal token をクリック');
    console.log('4. 生成されたトークンを.envファイルに追加');
    return;
  }

  try {
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
    });
    
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    const entry = await environment.createEntry('blogPost', {
      fields: {
        title: { 'ja': postData.title },
        slug: { 'ja': postData.slug },
        excerpt: { 'ja': postData.excerpt },
        contentMarkdown: { 'ja': postData.content },
        category: { 'ja': postData.category },
        tags: { 'ja': postData.tags },
        publishedAt: { 'ja': postData.publishedAt },
        author: { 'ja': postData.author },
        seoDescription: { 'ja': postData.seoDescription }
      }
    });
    
    console.log(`\n✅ 記事「${postData.title}」を下書きとして作成しました！`);
    console.log(`📝 編集: https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries/${entry.sys.id}`);
    console.log(`🔗 Contentfulで内容を確認・編集後、「Publish」で公開してください。`);
    
    // ローカルファイルとしても保存
    await saveLocalDraft(postData);
    
  } catch (error) {
    console.error('❌ Contentfulへの投稿に失敗しました:', error.message);
    console.log('\n📋 以下を確認してください:');
    console.log('1. CONTENTFUL_MANAGEMENT_TOKEN が正しく設定されているか');
    console.log('2. Contentfulで「blogPost」Content Typeが作成されているか');
    console.log('3. 必要なフィールドが全て設定されているか');
    console.log('4. インターネット接続が正常か');
    console.log('5. APIキーの権限が適切か');
    
    // エラー時もローカルに保存
    console.log('\n💾 ローカルファイルとして保存します...');
    await saveLocalDraft(postData);
  }
}

// ローカルドラフト保存機能
async function saveLocalDraft(postData) {
  const draftsDir = path.join(__dirname, '..', 'drafts');
  
  // draftsディレクトリが存在しない場合は作成
  if (!fs.existsSync(draftsDir)) {
    fs.mkdirSync(draftsDir, { recursive: true });
  }
  
  const filename = `${postData.slug}-${Date.now()}.md`;
  const filepath = path.join(draftsDir, filename);
  
  const frontmatter = `---
title: "${postData.title}"
slug: "${postData.slug}"
category: "${postData.category}"
tags: [${postData.tags.map(tag => `"${tag}"`).join(', ')}]
author: "${postData.author}"
publishedAt: "${postData.publishedAt}"
excerpt: "${postData.excerpt}"
seoDescription: "${postData.seoDescription}"
---

`;
  
  const content = frontmatter + postData.content;
  
  try {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`💾 ローカルドラフトを保存しました: ${filepath}`);
    console.log(`📝 編集: code ${filepath}`);
  } catch (error) {
    console.error('❌ ローカル保存に失敗しました:', error.message);
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function createInteractivePost() {
  console.log('🚀 テクノロジーブログ記事作成ツール v2.1');
  console.log('✨ 新機能: 詳細テンプレート・ローカル保存・改善されたエラーハンドリング\n');
  
  try {
    // テンプレート選択
    const templateKey = await selectTemplate();
    const template = templateKey ? templates[templateKey] : null;
    
    // 記事情報入力
    console.log('\n📋 記事情報を入力してください:');
    
    const title = await ask('\n📰 記事のタイトル');
    const suggestedSlug = generateSlug(title);
    const slug = await ask('🔗 スラッグ（URL用）', suggestedSlug);
    
    const category = await ask('📂 カテゴリ', template?.defaultCategory || 'テクノロジー');
    const excerpt = await ask('📄 記事の抜粋（150文字程度）');
    const tagsInput = await ask('🏷️ タグ（カンマ区切り）', template?.defaultTags?.join(', ') || '');
    const author = await ask('👤 著者名', 'ブログ管理者');
    const seoDescription = await ask('🔍 SEO説明（省略可）', excerpt.substring(0, 160));
    
    // テンプレート内容を取得
    let content;
    if (template) {
      content = loadTemplateFile(templateKey);
      // タイトルを自動的に置換
      content = content.replace(/\{\{title\}\}/g, title);
      content = content.replace(/\[製品名\]/g, title);
      content = content.replace(/\[ニュースタイトル\]/g, title);
    } else {
      content = `# ${title}\n\n記事の内容をここに書いてください。`;
    }
    
    const postData = {
      title,
      slug,
      category,
      excerpt,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishedAt: new Date().toISOString(),
      author,
      seoDescription: seoDescription || excerpt.substring(0, 160),
      content
    };
    
    // 確認
    console.log('\n📋 作成する記事の情報:');
    console.log(`📰 タイトル: ${postData.title}`);
    console.log(`🔗 スラッグ: ${postData.slug}`);
    console.log(`📂 カテゴリ: ${postData.category}`);
    console.log(`🏷️ タグ: ${postData.tags.join(', ')}`);
    console.log(`👤 著者: ${postData.author}`);
    console.log(`� SEO説明: ${postData.seoDescription}`);
    console.log(`�📝 テンプレート: ${template ? template.name : 'カスタム（なし）'}`);
    
    const shouldCreate = await confirm('\n✅ この内容で作成しますか？');
    
    if (shouldCreate) {
      await createContentfulPost(postData);
    } else {
      console.log('❌ 記事作成をキャンセルしました。');
    }
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
  } finally {
    rl.close();
  }
}

// 使用方法を表示する関数
function showUsage() {
  console.log(`
🚀 テクノロジーブログ記事作成ツール v2.2

使用方法:
  node scripts/create-post.js                    # 対話型記事作成
  node scripts/create-post.js --json <file>      # JSONファイルから記事作成
  node scripts/create-post.js --template <type>  # JSONテンプレート作成
  npm run create-post                            # 対話型記事作成（npm script版）
  npm run new-post                               # 同上（短縮版）

オプション:
  --json <file>        JSONファイルから記事を作成
  --template <type>    JSONテンプレートを作成（basic/single/multiple）
  --help, -h          このヘルプを表示

機能:
  ✨ 5種類のテンプレート（製品レビュー、ニュース、ガイド、比較、カスタム）
  📝 詳細なテンプレートファイル使用
  🔗 Contentful自動投稿
  💾 ローカルドラフト保存（バックアップ）
  📂 JSONファイルからの一括作成 (NEW!)
  🔧 変数置換機能 (NEW!)
  ⚠️  改善されたエラーハンドリング

JSONファイル例:
  # 単一記事
  {
    "title": "記事タイトル",
    "category": "テクノロジー",
    "template": "product-review",
    "excerpt": "記事の概要",
    "tags": ["タグ1", "タグ2"],
    "variables": {
      "productName": "製品名"
    }
  }

  # 複数記事
  [
    { "title": "記事1", "category": "レビュー" },
    { "title": "記事2", "category": "ニュース" }
  ]

必要な設定:
  📋 .env ファイルに以下の環境変数を設定:
    CONTENTFUL_SPACE_ID=your_space_id
    CONTENTFUL_MANAGEMENT_TOKEN=your_management_token

テンプレートの場所:
  📁 templates/ ディレクトリ
    - product-review.md    (製品レビュー用)
    - news-article.md      (ニュース記事用)
    - howto-guide.md       (ハウツー・ガイド用)
    - comparison.md        (比較記事用)
    - post-template-*.json (JSONテンプレート)

ローカルドラフト:
  📁 drafts/ ディレクトリに自動保存
  🔧 VS Codeで編集可能

詳細なドキュメント:
  📖 doc/DEVELOPMENT_SETUP.md#8-記事作成の簡易化
`);
}

// コマンドライン引数の処理
async function main() {
  const args = process.argv.slice(2);
  
  try {
    // ヘルプオプション
    if (args.includes('--help') || args.includes('-h')) {
      showUsage();
      return;
    }
    
    // JSONファイルからの作成
    if (args.includes('--json')) {
      const jsonIndex = args.indexOf('--json');
      const jsonFile = args[jsonIndex + 1];
      
      if (!jsonFile) {
        console.error('❌ JSONファイルのパスを指定してください');
        console.log('例: node scripts/create-post.js --json templates/posts.json');
        return;
      }
      
      const jsonPath = path.resolve(jsonFile);
      await createPostFromJSON(jsonPath);
      return;
    }
    
    // JSONテンプレートの作成
    if (args.includes('--template')) {
      const templateIndex = args.indexOf('--template');
      const templateType = args[templateIndex + 1] || 'basic';
      
      if (!['basic', 'single', 'multiple'].includes(templateType)) {
        console.error('❌ 有効なテンプレートタイプを指定してください: basic, single, multiple');
        return;
      }
      
      await createJSONTemplate(templateType);
      return;
    }
    
    // デフォルトは対話型作成
    await createInteractivePost();
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// ヘルプオプション（後方互換性のため保持）
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showUsage();
  process.exit(0);
}

// メイン実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createInteractivePost,
  createPostFromJSON,
  createJSONTemplate,
  templates,
  loadTemplateFile,
  validateJSONData,
  processJSONPostData
};

// JSONファイルからの記事作成機能
async function createPostFromJSON(jsonFilePath) {
  try {
    console.log(`📂 JSONファイルを読み込んでいます: ${jsonFilePath}`);
    
    // JSONファイルの存在確認
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSONファイルが見つかりません: ${jsonFilePath}`);
    }
    
    // JSONファイルを読み込み
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // データの検証
    validateJSONData(jsonData);
    
    // 複数記事の処理
    if (Array.isArray(jsonData)) {
      console.log(`📝 ${jsonData.length}件の記事を処理します...`);
      
      for (let i = 0; i < jsonData.length; i++) {
        const data = jsonData[i];
        console.log(`\n🔄 [${i + 1}/${jsonData.length}] 処理中: ${data.title}`);
        
        try {
          const postData = await processJSONPostData(data);
          await createContentfulPost(postData);
          
          // 連続投稿の場合は少し待機
          if (i < jsonData.length - 1) {
            console.log('⏳ 次の記事まで2秒待機...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`❌ 記事「${data.title}」の作成に失敗しました:`, error.message);
          continue; // 次の記事に進む
        }
      }
      
      console.log('\n✅ 全ての記事の処理が完了しました！');
    } else {
      // 単一記事の処理
      console.log(`📝 記事を処理します: ${jsonData.title}`);
      const postData = await processJSONPostData(jsonData);
      await createContentfulPost(postData);
    }
    
  } catch (error) {
    console.error('❌ JSONファイルからの記事作成に失敗しました:', error.message);
    throw error;
  }
}

// JSON データの検証
function validateJSONData(data) {
  const requiredFields = ['title', 'category'];
  const articles = Array.isArray(data) ? data : [data];
  
  articles.forEach((article, index) => {
    const prefix = Array.isArray(data) ? `[${index + 1}] ` : '';
    
    // 必須フィールドの確認
    for (const field of requiredFields) {
      if (!article[field]) {
        throw new Error(`${prefix}必須フィールド「${field}」が不足しています`);
      }
    }
    
    // テンプレートが指定されている場合の確認
    if (article.template && !templates[article.template]) {
      throw new Error(`${prefix}不正なテンプレート「${article.template}」が指定されています`);
    }
    
    // タグの形式確認
    if (article.tags && !Array.isArray(article.tags)) {
      throw new Error(`${prefix}タグは配列形式で指定してください`);
    }
  });
}

// JSON データを記事データに変換
async function processJSONPostData(data) {
  const now = new Date();
  
  // スラッグの生成
  const slug = data.slug || generateSlug(data.title);
  
  // テンプレートの適用
  let content = data.content || '';
  if (data.template && templates[data.template]) {
    const template = templates[data.template];
    content = loadTemplateFile(data.template);
    
    // テンプレート内の変数置換
    content = content.replace(/\{\{title\}\}/g, data.title);
    content = content.replace(/\[製品名\]/g, data.title);
    content = content.replace(/\[ニュースタイトル\]/g, data.title);
  }
  
  // カスタム変数の置換（テンプレート使用の有無に関わらず実行）
  if (data.variables) {
    Object.keys(data.variables).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, data.variables[key]);
    });
  }
  
  // 日付の処理
  const publishedAt = data.publishedAt ? new Date(data.publishedAt).toISOString() : now.toISOString();
  
  // 記事データの構築
  const postData = {
    title: data.title,
    slug: slug,
    category: data.category,
    excerpt: data.excerpt || `${data.title}に関する記事です。`,
    tags: data.tags || [],
    publishedAt: publishedAt,
    author: data.author || 'ブログ管理者',
    seoDescription: data.seoDescription || data.excerpt || `${data.title}に関する記事です。`,
    content: content
  };
  
  return postData;
}

// JSON テンプレートファイルの作成
async function createJSONTemplate(templateType = 'basic') {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  // templatesディレクトリが存在しない場合は作成
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  let templateContent;
  
  switch (templateType) {
    case 'single':
      templateContent = {
        title: "記事タイトル",
        slug: "article-slug",
        category: "テクノロジー",
        template: "product-review",
        excerpt: "この記事の概要を150文字程度で記載してください。",
        tags: ["タグ1", "タグ2"],
        author: "著者名",
        publishedAt: "2025-01-01T00:00:00.000Z",
        seoDescription: "SEO用の説明文",
        variables: {
          productName: "製品名",
          price: "価格",
          customField: "カスタムフィールド"
        },
        content: "# カスタムコンテンツ\n\nここに記事の内容を記載..."
      };
      break;
      
    case 'multiple':
      templateContent = [
        {
          title: "記事1のタイトル",
          category: "レビュー",
          template: "product-review",
          excerpt: "記事1の概要",
          tags: ["レビュー", "製品"]
        },
        {
          title: "記事2のタイトル",
          category: "ニュース",
          template: "news",
          excerpt: "記事2の概要",
          tags: ["ニュース", "テクノロジー"]
        }
      ];
      break;
      
    default:
      templateContent = {
        title: "記事タイトル",
        category: "テクノロジー",
        excerpt: "記事の概要",
        tags: ["タグ1", "タグ2"],
        author: "著者名"
      };
  }
  
  const filename = `post-template-${templateType}.json`;
  const filepath = path.join(templatesDir, filename);
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(templateContent, null, 2), 'utf8');
    console.log(`📝 JSONテンプレートを作成しました: ${filepath}`);
    console.log(`📖 編集: code ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('❌ JSONテンプレート作成に失敗しました:', error.message);
    throw error;
  }
}