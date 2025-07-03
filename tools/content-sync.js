// Contentful同期スクリプト
const { createClient } = require('contentful');
require('dotenv').config();

async function syncContent() {
    console.log('🔄 Contentfulからコンテンツを同期中...');
    
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
        console.error('❌ Contentfulの環境変数が設定されていません');
        console.log('以下の環境変数を .env ファイルに設定してください:');
        console.log('- CONTENTFUL_SPACE_ID');
        console.log('- CONTENTFUL_ACCESS_TOKEN');
        process.exit(1);
    }
    
    const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
    });
    
    try {
        // コンテンツタイプの確認
        const contentTypes = await client.getContentTypes();
        console.log(`📋 ${contentTypes.items.length} 個のコンテンツタイプが見つかりました:`);
        
        contentTypes.items.forEach(contentType => {
            console.log(`  - ${contentType.name} (${contentType.sys.id})`);
        });
        
        // ブログ記事の取得
        const entries = await client.getEntries({
            content_type: 'blogPost',
            limit: 10
        });
        
        console.log(`📝 ${entries.items.length} 個の記事が見つかりました`);
        
        if (entries.items.length > 0) {
            console.log('\n最新の記事:');
            entries.items.slice(0, 5).forEach((item, index) => {
                const title = item.fields.title || 'タイトルなし';
                const date = item.fields.publishDate || item.sys.createdAt;
                console.log(`  ${index + 1}. ${title} (${new Date(date).toLocaleDateString('ja-JP')})`);
            });
        }
        
        console.log('\n✅ コンテンツ同期完了!');
        
    } catch (error) {
        console.error('❌ Contentfulからのコンテンツ取得エラー:', error.message);
        
        if (error.status === 401) {
            console.log('🔑 アクセストークンが無効です。Contentfulの設定を確認してください。');
        } else if (error.status === 404) {
            console.log('🔍 指定されたSpaceまたはコンテンツタイプが見つかりません。');
        }
        
        process.exit(1);
    }
}

// スクリプト実行
if (require.main === module) {
    syncContent();
}

module.exports = { syncContent };
