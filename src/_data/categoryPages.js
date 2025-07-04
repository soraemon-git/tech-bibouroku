/**
 * カテゴリページのページネーション用データ生成
 */

const fs = require('fs');
const path = require('path');

module.exports = async function() {
  // postsデータを取得
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../../debug/test-posts.json'), 'utf8'));
  
  // カテゴリデータを取得（非同期）
  const categoriesFunction = require('./categories.js');
  const categories = await categoriesFunction();
  
  // 配列でない場合は配列に変換
  const categoryArray = Array.isArray(categories) ? categories : [];
  
  // 1ページあたりの記事数
  const POSTS_PER_PAGE = 15;
  
  const categoryPages = [];
  
  // 各カテゴリについて処理
  categoryArray.forEach(category => {
    if (category.slug === 'all') return; // 全カテゴリはスキップ
    
    // そのカテゴリの記事を取得
    const categoryPosts = posts.filter(post => post.category === category.name);
    
    if (categoryPosts.length === 0) {
      // 記事がない場合でも1ページ作成
      categoryPages.push({
        name: category.name,
        slug: category.slug,
        title: `${category.name}の記事`,
        description: `${category.name}に関する記事一覧`,
        permalink: `/category/${category.slug}/`,
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          startItem: 0,
          endItem: 0,
          hasNext: false,
          hasPrev: false,
          nextUrl: null,
          prevUrl: null
        }
      });
    } else {
      // 記事がある場合はページネーション
      const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
      
      for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const pagesPosts = categoryPosts.slice(startIndex, endIndex);
        
        // ページネーション情報
        const pagination = {
          currentPage: page,
          totalPages: totalPages,
          totalItems: categoryPosts.length,
          startItem: startIndex + 1,
          endItem: Math.min(endIndex, categoryPosts.length),
          hasNext: page < totalPages,
          hasPrev: page > 1,
          nextUrl: page < totalPages ? (page === 1 ? `/category/${category.slug}/2/` : `/category/${category.slug}/${page + 1}/`) : null,
          prevUrl: page > 1 ? (page === 2 ? `/category/${category.slug}/` : `/category/${category.slug}/${page - 1}/`) : null
        };
        
        categoryPages.push({
          name: category.name,
          slug: category.slug,
          title: `${category.name}の記事${page > 1 ? ' - ' + page + 'ページ目' : ''}`,
          description: `${category.name}に関する記事一覧${page > 1 ? ' (' + page + 'ページ目)' : ''}`,
          permalink: page === 1 ? `/category/${category.slug}/` : `/category/${category.slug}/${page}/`,
          posts: pagesPosts,
          pagination: pagination
        });
      }
    }
  });
  
  return categoryPages;
};
