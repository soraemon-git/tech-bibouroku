# 開発環境構築手順

## 概要

テクノロジーブログプロジェクト（11ty + Contentful）の開発環境構築手順書

**対象OS**: Windows 10/11, macOS, Linux  
**作成日**: 2025年7月2日

---

## 1. Node.js インストール

### 推奨バージョン
- **Node.js**: 18.x LTS以上
- **npm**: 9.x以上

### Windows環境

#### 方法1: 公式インストーラー（推奨）
1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. **LTS版**をダウンロード
3. インストーラーを実行
4. 「Add to PATH」にチェックを入れる
5. インストール完了後、PowerShellで確認
```powershell
node --version
npm --version
```

#### 方法2: Chocolatey使用
```powershell
# Chocolateyがインストール済みの場合
choco install nodejs

# バージョン確認
node --version
npm --version
```

#### 方法3: winget使用
```powershell
# Windows Package Manager使用
winget install OpenJS.NodeJS

# バージョン確認
node --version
npm --version
```

### macOS環境

#### 方法1: 公式インストーラー
1. [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード
2. .pkgファイルを実行してインストール

#### 方法2: Homebrew使用（推奨）
```bash
# Homebrewでインストール
brew install node

# バージョン確認
node --version
npm --version
```

#### 方法3: nvm使用（複数バージョン管理）
```bash
# nvmインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# ターミナル再起動後
nvm install --lts
nvm use --lts
```

### Linux環境（Ubuntu/Debian）

#### 方法1: NodeSource リポジトリ（推奨）
```bash
# リポジトリ追加
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Node.js インストール
sudo apt-get install -y nodejs

# バージョン確認
node --version
npm --version
```

#### 方法2: snap使用
```bash
sudo snap install node --classic
```

---

## 2. パッケージマネージャー設定

### npm設定（デフォルト）
```bash
# npmバージョン確認
npm --version

# グローバルパッケージのインストール場所確認
npm config get prefix

# レジストリ確認
npm config get registry
```

### yarn使用する場合（オプション）
```bash
# yarnインストール
npm install -g yarn

# バージョン確認
yarn --version
```

---

## 3. プロジェクト初期化

### ディレクトリ作成
```bash
# プロジェクトディレクトリ作成
mkdir tech-blog
cd tech-blog

# package.json作成
npm init -y
```

### 必要パッケージインストール
```bash
# 11ty本体
npm install @11ty/eleventy

# Contentful SDK
npm install contentful

# 開発用パッケージ（オプション）
npm install --save-dev @11ty/eleventy-dev-server
```

### package.json設定例
```json
{
  "name": "tech-blog",
  "version": "1.0.0",
  "description": "Technology Blog using 11ty and Contentful",
  "main": "index.js",
  "scripts": {
    "dev": "eleventy --serve --watch",
    "build": "eleventy",
    "serve": "eleventy --serve",
    "clean": "rm -rf _site"
  },
  "keywords": ["blog", "11ty", "contentful", "jamstack"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@11ty/eleventy": "^2.0.1",
    "contentful": "^10.3.6"
  },
  "devDependencies": {
    "@11ty/eleventy-dev-server": "^1.0.4"
  }
}
```

---

## 4. Contentful設定

### アカウント作成
1. [Contentful](https://www.contentful.com/)にアクセス
2. 無料アカウントを作成
3. 新しいSpaceを作成

### APIキー取得
1. Contentfulダッシュボードにログイン
2. **Settings** → **API keys**
3. **Add API key**をクリック
4. 以下の情報を控える：
   - Space ID
   - Content Delivery API - access token
   - Content Preview API - access token

### 環境変数設定

#### .envファイル作成
```bash
# プロジェクトルートに.envファイル作成
touch .env
```

#### 環境変数設定内容
```env
# .env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token_here
CONTENTFUL_ENVIRONMENT=master
```

#### .gitignore設定
```gitignore
# .gitignore
node_modules/
_site/
.env
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## 5. 11ty設定

### .eleventy.js作成
```javascript
// .eleventy.js
require('dotenv').config();

module.exports = function(eleventyConfig) {
  // パススルーコピー
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  // ウォッチ対象
  eleventyConfig.addWatchTarget("src/css/");

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
```

### プロジェクト構造作成
```bash
# ディレクトリ構造作成
mkdir -p src/_includes
mkdir -p src/_data
mkdir -p src/css
mkdir -p src/js
mkdir -p src/images
mkdir -p src/posts

# 基本ファイル作成
touch src/index.njk
touch src/_includes/base.njk
touch src/_data/posts.js
touch src/css/main.css
```

---

## 6. 動作確認

### 開発サーバー起動
```bash
# 開発サーバー起動
npm run dev
```

### ブラウザ確認
- ブラウザで `http://localhost:8080` にアクセス
- ホットリロードが動作することを確認

### ビルド確認
```bash
# 本番ビルド実行
npm run build

# _siteディレクトリが生成されることを確認
ls _site/
```

---

## 7. 追加ツール（オプション）

### Git設定
```bash
# Gitリポジトリ初期化
git init

# 初回コミット
git add .
git commit -m "Initial commit"
```

### VS Code拡張機能（推奨）
- **11ty Syntax Highlighting**: 11ty用シンタックスハイライト
- **Nunjucks**: Nunjucksテンプレート支援
- **dotenv**: 環境変数ハイライト

### デバッグ用パッケージ
```bash
# デバッグ用（オプション）
npm install --save-dev @11ty/eleventy-plugin-syntaxhighlight
npm install --save-dev eleventy-plugin-sass
```

---

## トラブルシューティング

### よくある問題と解決方法

#### Node.jsが認識されない
```bash
# PATHの確認
echo $PATH

# Node.jsの場所確認
which node

# 環境変数の再読み込み（Windows）
refreshenv
```

#### npm install でエラー
```bash
# キャッシュクリア
npm cache clean --force

# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 11tyビルドエラー
```bash
# デバッグモードで実行
DEBUG=Eleventy* npx @11ty/eleventy

# 設定ファイル確認
npx @11ty/eleventy --config=.eleventy.js
```

#### Contentful接続エラー
```bash
# 環境変数の確認
echo $CONTENTFUL_SPACE_ID
echo $CONTENTFUL_ACCESS_TOKEN

# APIキーの有効性確認
curl "https://cdn.contentful.com/spaces/$CONTENTFUL_SPACE_ID?access_token=$CONTENTFUL_ACCESS_TOKEN"
```

---

## 次のステップ

1. **コンテンツモデル作成**: Contentfulでブログ記事用のContent Typeを作成
2. **テンプレート作成**: 記事一覧・詳細ページのテンプレート作成
3. **スタイリング**: CSSでデザイン実装
4. **デプロイ設定**: Netlify/Vercelでの自動デプロイ設定

---

## 参考リンク

- [Node.js公式ドキュメント](https://nodejs.org/docs/)
- [11ty公式ドキュメント](https://www.11ty.dev/docs/)
- [Contentful公式ドキュメント](https://www.contentful.com/developers/docs/)
- [npm公式ドキュメント](https://docs.npmjs.com/)

---

## 8. 記事作成の簡易化

### 対話型記事作成ツール

プロジェクトには記事作成を簡易化する対話型CLIスクリプトが含まれています。

#### 8.1 Management APIトークンの取得

記事作成ツールを使用するには、Contentful Management APIトークンが必要です。

1. **Contentfulダッシュボードにログイン**
2. **Settings** → **API keys** → **Content management tokens**
3. **Generate personal token**をクリック
4. トークン名を入力（例：`Blog Management Token`）
5. 生成されたトークンをコピー

#### 8.2 環境変数への追加

`.env`ファイルにManagement APIトークンを追加：

```env
# .env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token_here
CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token_here
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here  # ← 追加
CONTENTFUL_ENVIRONMENT=master
```

#### 8.3 必要パッケージの確認

記事作成ツールに必要なパッケージは既にpackage.jsonに含まれています：

```bash
# 依存関係のインストール（初回セットアップ時）
npm install

# 現在のpackage.jsonに含まれるパッケージ
# - contentful-management: 記事作成ツール用
# - dotenv: 環境変数管理
# - markdown-it: Markdown処理
```

#### 8.4 記事作成ツールの使用方法

##### 基本的な使用方法

```bash
# 記事作成ツールの実行
node scripts/create-post.js
```

##### 実行時の流れ

1. **テンプレート選択**
   ```
   📝 記事テンプレートを選択してください:
   1. 製品レビュー
   2. ニュース記事
   3. ハウツー・ガイド
   4. 比較記事
   5. カスタム（テンプレートなし）
   
   選択 (1-5): 1
   ```

2. **記事情報の入力**
   ```
   📰 記事のタイトル: iPhone 15 Pro Max 完全レビュー
   🔗 スラッグ（URL用）[iphone-15-pro-max-]: 
   📂 カテゴリ [レビュー]: スマートフォン
   📄 記事の抜粋（150文字程度）: 最新のiPhone 15 Pro Maxを実際に使って分かったメリット・デメリットを詳しく解説します
   🏷️ タグ（カンマ区切り）[レビュー, 製品]: iPhone, スマートフォン, Apple
   👤 著者名 [ブログ管理者]: 
   ```

3. **内容確認・作成**
   ```
   📋 作成する記事の情報:
   タイトル: iPhone 15 Pro Max 完全レビュー
   スラッグ: iphone-15-pro-max-
   カテゴリ: スマートフォン
   タグ: iPhone, スマートフォン, Apple
   著者: ブログ管理者
   
   ✅ この内容で作成しますか？ (y/N): y
   ```

#### 8.5 利用可能なテンプレート

##### 1. 製品レビュー
- 開封・外観
- スペック・機能表
- 使用感（良い点・改善点）
- 価格・コストパフォーマンス
- まとめ・おすすめ度

##### 2. ニュース記事
- 概要
- 詳細内容
- 業界への影響
- まとめ

##### 3. ハウツー・ガイド
- 学べること
- 必要なもの
- 手順（Step by Step）
- 注意点・トラブルシューティング
- 参考リンク

##### 4. 比較記事
- 比較概要
- スペック比較表
- 詳細比較
- 選択指針
- まとめ

##### 5. カスタム
- 自由形式（テンプレートなし）

#### 8.6 記事作成後の流れ

1. **Contentfulで確認**
   - 作成された記事はContentfulに下書きとして保存
   - ブラウザでContentfulダッシュボードを開く
   - 記事内容を編集・確認

2. **記事の公開**
   ```bash
   # Contentfulダッシュボードで:
   # 1. 作成された記事を開く
   # 2. 内容を確認・編集
   # 3. 「Publish」ボタンをクリック
   ```

3. **サイトの更新確認**
   ```bash
   # 開発サーバーで確認
   npm run dev
   
   # 本番ビルドで確認
   npm run build
   ```

#### 8.7 トラブルシューティング

##### Management Tokenエラー
```bash
❌ CONTENTFUL_MANAGEMENT_TOKEN が設定されていません
📋 .env ファイルに以下を追加してください:
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
```

**解決方法:**
1. `.env`ファイルを確認
2. Management APIトークンが正しく設定されているか確認
3. トークンの有効期限を確認

##### Content Type エラー
```bash
❌ Contentfulへの投稿に失敗しました: Unknown content type
```

**解決方法:**
1. Contentfulで`blogPost` Content Typeが作成されているか確認
2. 必要なフィールドが全て設定されているか確認

##### 接続エラー
```bash
❌ Contentfulへの投稿に失敗しました: Network Error
```

**解決方法:**
1. インターネット接続を確認
2. ファイアウォール設定を確認
3. APIキーの有効性を確認

---

## 9. 他PCでの展開手順

### 9.1 プロジェクトのクローン

```bash
# GitHubからクローン（リポジトリ作成後）
git clone https://github.com/yourusername/tech-blog.git
cd tech-blog

# 依存パッケージのインストール
npm install
```

### 9.2 環境変数の設定

```bash
# .envファイルをコピー（元PC）
# 内容を新PCの.envファイルに貼り付け

# または新規作成
cp .env.example .env
# .envファイルを編集して適切な値を設定
```

### 9.3 動作確認

```bash
# データ取得テスト
node src/_data/test.js

# 開発サーバー起動
npm run dev

# 記事作成ツール動作確認
node scripts/create-post.js
```

### 9.4 チーム開発での注意点

1. **環境変数の共有**
   - `.env`ファイルは`.gitignore`に含まれている
   - チームメンバーには別途APIキーを共有

2. **Node.jsバージョンの統一**
   - `.nvmrc`ファイルでバージョン指定
   - チーム全体で同じバージョンを使用

3. **パッケージ管理**
   - `package-lock.json`をコミットに含める
   - `npm ci`でのインストールを推奨

### 9.5 新機能の活用

#### カテゴリー自動管理システム
- 記事にカテゴリーを設定するだけで自動的にカテゴリーページを生成
- 詳細は[カテゴリー自動管理ガイド](./CATEGORY_AUTOMATION_GUIDE.md)を参照

#### 検索機能
- 自動的に検索インデックスを生成
- クライアントサイド検索により高速な検索が可能

#### 記事作成ツール
- 対話型インターフェースで記事作成を支援
- 複数のテンプレートから選択可能

---

**最終更新**: 2025年7月4日

## 次のステップ
