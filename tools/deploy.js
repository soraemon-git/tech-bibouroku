// デプロイスクリプト
const fs = require('fs');
const path = require('path');

console.log('🚀 デプロイを開始します...');

// ビルドディレクトリの確認
const buildDir = path.join(__dirname, '../_site');

if (!fs.existsSync(buildDir)) {
    console.error('❌ ビルドディレクトリが見つかりません。先に npm run build を実行してください。');
    process.exit(1);
}

// ファイル数をカウント
function countFiles(dir) {
    let fileCount = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            fileCount += countFiles(filePath);
        } else {
            fileCount++;
        }
    });
    
    return fileCount;
}

const fileCount = countFiles(buildDir);
console.log(`📁 ${fileCount} 個のファイルが生成されました`);

// デプロイの準備完了
console.log('✅ デプロイの準備が完了しました');
console.log('🔗 Netlify または Vercel にデプロイしてください');

// 環境変数の確認
console.log('\n📋 環境変数の確認:');
const requiredEnvVars = [
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ACCESS_TOKEN'
];

requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`✅ ${envVar}: 設定済み`);
    } else {
        console.log(`❌ ${envVar}: 未設定`);
    }
});

console.log('\n🎉 デプロイスクリプト完了!');
