// カテゴリーページ自動生成用のデータファイル
const { isContentfulConfigured, getContentfulEntries } = require('./contentful-client');

// カテゴリ名からスラッグを生成するヘルパー関数（sidebar.jsと同じ）
function createSlug(name) {
  const slugMap = {
    'PC': 'pc',
    'スマートフォン': 'smartphone',
    'ガジェット': 'gadget',
    'ソフトウェア': 'software',
    'AI': 'ai',
    'Web開発': 'web-dev',
    'ゲーム': 'game',
    'セキュリティ': 'security'
  };
  
  // マッピングがあればそれを使用、なければ自動生成
  if (slugMap[name]) {
    return slugMap[name];
  }
  
  // 日本語カテゴリ名の自動スラッグ生成
  return name
    .toLowerCase()
    .replace(/[\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-') // 日本語文字をハイフンに
    .replace(/[^a-z0-9-]/g, '') // 英数字とハイフン以外を削除
    .replace(/--+/g, '-') // 連続ハイフンを1つに
    .replace(/^-|-$/g, ''); // 先頭・末尾のハイフンを削除
}

module.exports = async function() {
  // Contentfulの設定をチェック
  if (!isContentfulConfigured()) {
    console.warn('Contentfulの設定が不完全です。posts.jsのサンプルデータからカテゴリーを抽出します。');
    return getDataFromPosts();
  }

  try {
    // 記事を取得してカテゴリを抽出
    const entries = await getContentfulEntries();

    // カテゴリを抽出してページ生成用データを作成
    const categorySet = new Set();
    entries.forEach(post => {
      const category = post.fields.category;
      if (category) {
        categorySet.add(category);
      }
    });

    // カテゴリーページ生成用のデータ配列を作成
    const categories = Array.from(categorySet).map(categoryName => ({
      name: categoryName,
      slug: createSlug(categoryName),
      url: `/blog/category/${createSlug(categoryName)}/`,
      permalink: `/blog/category/${createSlug(categoryName)}/`,
      // カテゴリページのメタデータ
      layout: 'category.njk',
      title: `${categoryName}の記事`,
      description: `${categoryName}に関する記事一覧`,
      showLeftSidebar: false,
      showRightSidebar: false
    }));

    return categories;

  } catch (error) {
    console.warn('Contentfulからカテゴリデータを取得できませんでした:', error.message);
    console.log('posts.jsのサンプルデータにフォールバックします。');
    return getDataFromPosts();
  }
};

// posts.jsからデータを取得する関数
async function getDataFromPosts() {
  const postsData = require('./posts.js');
  const posts = await postsData();
  
  if (!posts || posts.length === 0) {
    console.warn('posts.jsからもデータを取得できませんでした。固定のフォールバックデータを使用します。');
    return getFallbackCategories();
  }

  console.log('posts.jsからカテゴリーを抽出します');
  
  // postsデータからカテゴリを抽出
  const categorySet = new Set();
  posts.forEach(post => {
    if (post.category) {
      categorySet.add(post.category);
    }
  });
  
  // カテゴリーページ生成用のデータ配列を作成
  const categories = Array.from(categorySet).map(categoryName => ({
    name: categoryName,
    slug: createSlug(categoryName),
    url: `/blog/category/${createSlug(categoryName)}/`,
    permalink: `/blog/category/${createSlug(categoryName)}/`,
    // カテゴリページのメタデータ
    layout: 'category.njk',
    title: `${categoryName}の記事`,
    description: `${categoryName}に関する記事一覧`,
    showLeftSidebar: false,
    showRightSidebar: false
  }));

  return categories;
}

function getFallbackCategories() {
  const fallbackCategories = [
    'PC',
    'スマートフォン',
    'ガジェット',
    'ソフトウェア'
  ];

  return fallbackCategories.map(categoryName => ({
    name: categoryName,
    slug: createSlug(categoryName),
    url: `/blog/category/${createSlug(categoryName)}/`,
    permalink: `/blog/category/${createSlug(categoryName)}/`,
    layout: 'category.njk',
    title: `${categoryName}の記事`,
    description: `${categoryName}に関する記事一覧`,
    showLeftSidebar: false,
    showRightSidebar: false
  }));
}
