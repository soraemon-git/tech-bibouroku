# プロジェクトファイル構成

## 完全なディレクトリ構造

```
tech-blog/
├── .env                           # 環境変数（Git管理外）
├── .gitignore                     # Git除外設定
├── .eleventy.js                   # 11ty設定ファイル
├── package.json                   # パッケージ管理
├── README.md                      # プロジェクト説明
├── netlify.toml                   # Netlifyデプロイ設定
│
├── src/                           # ソースコード
│   ├── index.njk                  # トップページ
│   ├── about.njk                  # About ページ
│   ├── blog.njk                   # ブログ一覧ページ
│   ├── post.njk                   # 個別記事ページ
│   ├── category.njk               # カテゴリーページ
│   ├── search.njk                 # 検索ページ
│   ├── search-index.njk           # 検索インデックス
│   ├── 404.njk                    # エラーページ
│   │
│   ├── _includes/                 # テンプレートファイル
│   │   ├── base.njk               # ベーステンプレート
│   │   ├── header.njk             # ヘッダー部分
│   │   ├── footer.njk             # フッター部分
│   │   ├── navigation.njk         # ナビゲーション
│   │   └── components/            # コンポーネント
│   │       ├── category-nav.njk   # カテゴリーナビゲーション
│   │       ├── left-sidebar.njk   # 左サイドバー
│   │       ├── right-sidebar.njk  # 右サイドバー
│   │       └── sidebar.njk        # サイドバー
│   │
│   ├── _data/                     # データファイル
│   │   ├── posts.js               # Contentfulから記事取得
│   │   ├── categories.js          # カテゴリー管理
│   │   ├── sidebar.js             # サイドバー情報
│   │   ├── site.json              # サイト設定
│   │   └── test.js                # テストデータ
│   │
│   ├── css/                       # スタイルシート
│   │   ├── main.css               # メインスタイル
│   │   ├── components/            # コンポーネント別CSS
│   │   │   ├── header.css
│   │   │   ├── navigation.css
│   │   │   ├── post.css
│   │   │   ├── post-detail.css
│   │   │   ├── search.css
│   │   │   ├── sidebar.css
│   │   │   └── footer.css
│   │   ├── layout/                # レイアウト用CSS
│   │   │   └── content-wrapper.css
│   │   └── utilities/             # ユーティリティCSS
│   │       ├── variables.css      # CSS変数
│   │       ├── reset.css          # リセットCSS
│   │       └── responsive.css     # レスポンシブ設定
│   │
│   ├── js/                        # JavaScript
│   │   ├── main.js                # メインスクリプト
│   │   ├── search.js              # 検索機能
│   │   └── table-of-contents.js   # 目次機能
│   │
│   └── images/                    # 画像ファイル
│       ├── logo.svg               # サイトロゴ
│       └── og-image.png           # OGP画像
│
├── _site/                         # 生成される静的ファイル（Git管理外）
│   ├── index.html
│   ├── blog/
│   ├── category/
│   ├── search/
│   ├── search-index/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── ...
│
├── doc/                           # ドキュメント
│   ├── PROJECT_OVERVIEW.md        # プロジェクト概要
│   ├── DEVELOPMENT_SETUP.md       # 開発環境構築手順
│   ├── PROJECT_STRUCTURE.md       # プロジェクト構造説明
│   └── CATEGORY_AUTOMATION_GUIDE.md # カテゴリー自動管理ガイド
│
├── scripts/                       # スクリプト
│   └── create-post.js             # 記事作成ツール
│
├── templates/                     # テンプレート
│   ├── comparison.md              # 比較記事テンプレート
│   ├── howto-guide.md             # ハウツーガイドテンプレート
│   ├── news-article.md            # ニュース記事テンプレート
│   └── product-review.md          # 製品レビューテンプレート
│
└── tools/                         # 開発ツール・スクリプト
    ├── deploy.js                  # デプロイスクリプト
    └── content-sync.js            # Contentful同期
```

## ファイル説明

### 設定ファイル

- **`.eleventy.js`**: 11tyの設定ファイル。ビルド処理、フィルター、ショートコードを定義
- **`package.json`**: プロジェクトの依存関係と実行スクリプトを定義
- **`.env`**: 環境変数（Contentful APIキーなど）
- **`.gitignore`**: Gitで管理しないファイルを指定
- **`netlify.toml`**: Netlifyでのビルド・デプロイ設定

### テンプレートファイル

- **`base.njk`**: 全ページの基本レイアウト
- **`header.njk`**: サイトヘッダー
- **`footer.njk`**: サイトフッター
- **`navigation.njk`**: メインナビゲーション

### ページファイル

- **`index.njk`**: トップページ
- **`blog.njk`**: ブログ記事一覧
- **`post.njk`**: 個別記事ページ
- **`category.njk`**: カテゴリーページ（自動生成）
- **`search.njk`**: 検索ページ
- **`search-index.njk`**: 検索インデックス生成ページ
- **`about.njk`**: Aboutページ
- **`404.njk`**: エラーページ

### データファイル

- **`posts.js`**: Contentfulから記事データを取得
- **`categories.js`**: カテゴリー自動管理システム
- **`sidebar.js`**: サイドバー情報管理
- **`site.json`**: サイト共通設定（タイトル、説明文、ナビゲーション）
- **`test.js`**: テストデータ管理

### スタイルファイル

- **`main.css`**: 全スタイルをインポートするメインファイル
- **`variables.css`**: CSS変数（色、フォント、サイズなど）
- **`reset.css`**: ブラウザのデフォルトスタイルをリセット
- **`content-wrapper.css`**: メインレイアウト用CSS
- **各コンポーネントCSS**: 部品ごとのスタイル定義（検索、サイドバー、記事詳細など）

### JavaScriptファイル

- **`main.js`**: ダークモード切替、スムーススクロールなどの基本機能
- **`search.js`**: 検索機能の実装
- **`table-of-contents.js`**: 目次自動生成機能

### スクリプト・ツールファイル

- **`create-post.js`**: 対話型記事作成ツール
- **`deploy.js`**: デプロイ前の確認スクリプト
- **`content-sync.js`**: Contentfulとの接続確認

### テンプレートファイル

- **比較記事、ハウツーガイド、ニュース記事、製品レビューテンプレート**: 記事作成時に使用する各種テンプレート

## 開発ワークフロー

1. **開発開始**: `npm run dev` で開発サーバー起動
2. **ファイル編集**: `src/` 以下のファイルを編集
3. **自動リロード**: 変更は自動的にブラウザに反映
4. **ビルド**: `npm run build` で静的ファイル生成
5. **デプロイ**: `npm run deploy` でデプロイ準備

## 重要なポイント

- **環境変数**: `.env` ファイルでContentfulの設定を管理
- **カテゴリー自動管理**: 記事にカテゴリーを設定するだけで自動的にカテゴリーページが生成
- **検索機能**: 検索インデックスを自動生成し、クライアントサイド検索を実装
- **ダークモード**: CSS変数とJavaScriptで実装
- **レスポンシブ**: モバイルファーストで設計
- **SEO対応**: メタタグ、OGP、構造化データ
- **パフォーマンス**: 軽量なCSS、最適化された画像
- **記事作成ツール**: 対話型ツールでテンプレートベースの記事作成が可能
