require('dotenv').config();

const markdownIt = require('markdown-it');
const { paginate, paginateCategory } = require('./src/_includes/utils/pagination');

module.exports = function(eleventyConfig) {
  
  // Markdown設定
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  // markdownifyフィルター追加
  eleventyConfig.addFilter("markdownify", function(content) {
    return md.render(content);
  });
  
  // パススルーコピー
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // ウォッチ対象
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // フィルター追加
  eleventyConfig.addFilter("dateFormat", function(date) {
    if (!date) return '日付不明';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return '無効な日付';
      }
      return dateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('日付フォーマットエラー:', error);
      return '日付エラー';
    }
  });

  eleventyConfig.addFilter("slice", function(array, start, end) {
    return array.slice(start, end);
  });

  // 数値計算フィルター追加
  eleventyConfig.addFilter("max", function(array) {
    if (!Array.isArray(array)) return array;
    return Math.max(...array);
  });

  eleventyConfig.addFilter("min", function(array) {
    if (!Array.isArray(array)) return array;
    return Math.min(...array);
  });

  // 範囲生成フィルター追加
  eleventyConfig.addFilter("range", function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  // オブジェクトキー取得フィルター追加
  eleventyConfig.addFilter("keys", function(obj) {
    return Object.keys(obj || {});
  });

  // デフォルトフィルター追加
  eleventyConfig.addFilter("default", function(value, defaultValue) {
    return value !== undefined ? value : defaultValue;
  });

  // 配列結合フィルター追加
  eleventyConfig.addFilter("join", function(array, separator) {
    if (!Array.isArray(array)) return array;
    return array.join(separator || '');
  });

  // オブジェクトダンプフィルター追加
  eleventyConfig.addFilter("dump", function(obj) {
    return JSON.stringify(obj, null, 2);
  });

  // カテゴリー絞り込みフィルター追加
  eleventyConfig.addFilter("selectattr", function(array, attr, operator, value) {
    if (!array || !Array.isArray(array)) return [];
    
    switch (operator) {
      case 'equalto':
        return array.filter(item => item[attr] === value);
      case 'in':
        return array.filter(item => item[attr] && item[attr].includes(value));
      default:
        return array;
    }
  });

  // ページネーション フィルター追加
  eleventyConfig.addFilter("paginate", paginate);
  eleventyConfig.addFilter("paginateCategory", paginateCategory);

  // ショートコード追加
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
