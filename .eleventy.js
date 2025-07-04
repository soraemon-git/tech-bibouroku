console.log('=== .eleventy.js が読み込まれました ===');
require('dotenv').config();
console.log('=== dotenv設定完了 ===');

const markdownIt = require('markdown-it');

module.exports = function(eleventyConfig) {
  console.log('=== 11ty設定関数が実行されました ===');
  
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
  
  // ビルド開始時のログ
  eleventyConfig.on('beforeBuild', () => {
    console.log('=== 11ty ビルド開始 ===');
  });

  // ビルド完了時のログ
  eleventyConfig.on('afterBuild', () => {
    console.log('=== 11ty ビルド完了 ===');
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

  // コレクション追加：カテゴリー別記事
  eleventyConfig.addCollection("categoryPages", function(collectionApi) {
    const posts = collectionApi.getAll().filter(item => 
      item.data.category && item.inputPath.includes('.md')
    );
    
    const categories = new Set();
    posts.forEach(post => {
      if (post.data.category) {
        categories.add(post.data.category);
      }
    });
    
    return Array.from(categories).map(category => ({
      category: category,
      slug: category.toLowerCase().replace(/[^a-z0-9]/g, ''),
      count: posts.filter(post => post.data.category === category).length
    }));
  });

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
