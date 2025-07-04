// Contentful接続用の共通モジュール
const { createClient } = require('contentful');

/**
 * Contentfulの設定が有効かチェックする
 * @returns {boolean} 設定が有効な場合true
 */
function isContentfulConfigured() {
  // 環境変数が存在するかチェック
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return false;
  }
  
  // プレースホルダー値でないかチェック
  const isPlaceholder = 
    process.env.CONTENTFUL_SPACE_ID === 'your_space_id_here' ||
    process.env.CONTENTFUL_ACCESS_TOKEN === 'your_delivery_api_token_here' ||
    process.env.CONTENTFUL_ACCESS_TOKEN === 'your_access_token_here';
    
  return !isPlaceholder;
}

/**
 * Contentfulクライアントを作成する
 * @returns {Object|null} Contentfulクライアント、または設定が無効な場合null
 */
function createContentfulClient() {
  if (!isContentfulConfigured()) {
    return null;
  }
  
  return createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
}

/**
 * Contentfulから記事を取得する共通関数
 * @param {Object} options 取得オプション
 * @returns {Promise<Array>} 記事配列
 */
async function getContentfulEntries(options = {}) {
  const client = createContentfulClient();
  
  if (!client) {
    throw new Error('Contentful設定が不完全です');
  }
  
  const defaultOptions = {
    content_type: 'blogPost',
    order: '-sys.createdAt',
    limit: 100
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const entries = await client.getEntries(finalOptions);
    return entries.items;
  } catch (error) {
    console.error('Contentfulからのデータ取得エラー:', error.message);
    throw error;
  }
}

/**
 * 記事データを統一形式に変換する
 * @param {Array} items Contentfulの記事アイテム
 * @returns {Array} 統一形式の記事配列
 */
function transformContentfulItems(items) {
  return items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    category: item.fields.category,
    tags: item.fields.tags || [],
    publishDate: item.fields.publishedAt || item.fields.publishDate,
    featuredImage: item.fields.featuredImage,
    author: item.fields.author,
    url: `/blog/${item.fields.slug}/`
  }));
}

module.exports = {
  isContentfulConfigured,
  createContentfulClient,
  getContentfulEntries,
  transformContentfulItems
};
