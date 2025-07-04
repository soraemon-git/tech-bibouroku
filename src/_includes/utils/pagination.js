/**
 * ページネーション用のユーティリティ関数
 */

/**
 * 配列をページネーションする
 * @param {Array} items - ページネーションする配列
 * @param {number} currentPage - 現在のページ番号（1から開始）
 * @param {number} itemsPerPage - 1ページあたりのアイテム数
 * @returns {Object} ページネーション結果
 */
function paginate(items, currentPage = 1, itemsPerPage = 15) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: items.slice(startIndex, endIndex),
    currentPage: currentPage,
    totalPages: totalPages,
    totalItems: totalItems,
    itemsPerPage: itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
}

/**
 * カテゴリページ用のページネーション
 * @param {Array} posts - 全記事
 * @param {string} categoryName - カテゴリ名
 * @param {number} currentPage - 現在のページ番号
 * @param {number} itemsPerPage - 1ページあたりのアイテム数
 * @returns {Object} ページネーション結果
 */
function paginateCategory(posts, categoryName, currentPage = 1, itemsPerPage = 20) {
  const categoryPosts = posts.filter(post => post.category === categoryName);
  return paginate(categoryPosts, currentPage, itemsPerPage);
}

module.exports = {
  paginate,
  paginateCategory
};
