const contentful = require('contentful');

// カテゴリ名からスラッグを生成するヘルパー関数
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
  // 環境変数の検証
  if (!process.env.CONTENTFUL_SPACE_ID || 
      !process.env.CONTENTFUL_DELIVERY_TOKEN ||
      process.env.CONTENTFUL_SPACE_ID === 'your_space_id_here' ||
      process.env.CONTENTFUL_DELIVERY_TOKEN === 'your_delivery_token_here') {
    
    console.warn('Contentfulの設定が不完全です。posts.jsのサンプルデータからカテゴリーを抽出します。');
    return getDataFromPosts();
  }

  // Contentfulクライアントの初期化
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
  });

  try {
    // 記事を取得してカテゴリを抽出
    const entries = await client.getEntries({
      content_type: 'blogPost',
      limit: 100,
      order: '-sys.createdAt'
    });

    // カテゴリ別記事数を集計（記事から自動抽出）
    const categoryStats = new Map();
    entries.items.forEach(post => {
      const category = post.fields.category;
      if (category) {
        if (!categoryStats.has(category)) {
          categoryStats.set(category, {
            name: category,
            slug: createSlug(category),
            count: 0,
            url: `/blog/category/${createSlug(category)}/`
          });
        }
        categoryStats.get(category).count++;
      }
    });

    // 「すべて」カテゴリを先頭に追加
    const categories = [
      {
        name: 'すべて',
        slug: 'all',
        count: entries.items.length,
        url: '/blog/'
      },
      ...Array.from(categoryStats.values()).sort((a, b) => a.name.localeCompare(b.name))
    ];

    // 人気記事（最新5件をサンプルとして使用）
    const popularPosts = entries.items.slice(0, 5).map(post => ({
      title: post.fields.title,
      url: `/blog/${post.fields.slug}/`,
      publishDate: post.fields.publishDate,
      category: post.fields.category
    }));

    console.log(`sidebar.js: Contentfulからカテゴリー${categories.length}件、人気記事${popularPosts.length}件を取得`);

    return {
      categories,
      popularPosts,
      affiliateProducts: getAffiliateProducts()
    };

  } catch (error) {
    console.warn('Contentfulからサイドバーデータを取得できませんでした:', error.message);
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
    return getFallbackData();
  }

  console.log('sidebar.js: posts.jsからカテゴリーを抽出します');
  
  // カテゴリ別記事数を集計（記事から自動抽出）
  const categoryStats = new Map();
  posts.forEach(post => {
    const category = post.category;
    if (category) {
      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          name: category,
          slug: createSlug(category),
          count: 0,
          url: `/blog/category/${createSlug(category)}/`
        });
      }
      categoryStats.get(category).count++;
    }
  });

  // 「すべて」カテゴリを先頭に追加
  const categories = [
    {
      name: 'すべて',
      slug: 'all',
      count: posts.length,
      url: '/blog/'
    },
    ...Array.from(categoryStats.values()).sort((a, b) => a.name.localeCompare(b.name))
  ];

  // 人気記事（最新記事をサンプルとして使用）
  const popularPosts = posts.slice(0, 5).map(post => ({
    title: post.title,
    url: post.url,
    publishDate: post.publishDate,
    category: post.category
  }));

  console.log(`sidebar.js: posts.jsからカテゴリー${categories.length}件、人気記事${popularPosts.length}件を生成`);
  categories.forEach(cat => console.log(`- ${cat.name} (${cat.count}件)`));

  return {
    categories,
    popularPosts,
    affiliateProducts: getAffiliateProducts()
  };
}

function getFallbackData() {
  return {
    categories: [
      { name: 'すべて', slug: 'all', count: 2, url: '/blog/' },
      { name: 'PC', slug: 'pc', count: 1, url: '/blog/category/pc/' },
      { name: 'スマートフォン', slug: 'smartphone', count: 1, url: '/blog/category/smartphone/' },
      { name: 'ガジェット', slug: 'gadget', count: 0, url: '/blog/category/gadget/' },
      { name: 'ソフトウェア', slug: 'software', count: 0, url: '/blog/category/software/' }
    ],
    popularPosts: [
      {
        title: 'サンプル記事: PC選びのポイント',
        url: '/blog/sample-pc-selection-guide/',
        publishDate: '2025-07-01',
        category: 'PC'
      },
      {
        title: 'サンプル記事: 最新スマートフォンレビュー',
        url: '/blog/sample-smartphone-review/',
        publishDate: '2025-07-02',
        category: 'スマートフォン'
      }
    ],
    affiliateProducts: getAffiliateProducts()
  };
}

function getAffiliateProducts() {
  return [
    {
      title: 'おすすめノートPC',
      description: '高性能で持ち運びやすい最新モデル',
      price: '¥89,800',
      link: '#',
      image: '/images/og-image.png'
    },
    {
      title: '最新スマートフォン',
      description: 'カメラ性能抜群の人気機種',
      price: '¥79,800',
      link: '#',
      image: '/images/og-image.png'
    }
  ];
}
