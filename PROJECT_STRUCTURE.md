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
│   ├── 404.njk                    # エラーページ
│   │
│   ├── _includes/                 # テンプレートファイル
│   │   ├── base.njk               # ベーステンプレート
│   │   ├── header.njk             # ヘッダー部分
│   │   ├── footer.njk             # フッター部分
│   │   └── navigation.njk         # ナビゲーション
│   │
│   ├── _data/                     # データファイル
│   │   ├── posts.js               # Contentfulから記事取得
│   │   └── site.json              # サイト設定
│   │
│   ├── css/                       # スタイルシート
│   │   ├── main.css               # メインスタイル
│   │   ├── components/            # コンポーネント別CSS
│   │   │   ├── header.css
│   │   │   ├── navigation.css
│   │   │   ├── post.css
│   │   │   └── footer.css
│   │   └── utilities/             # ユーティリティCSS
│   │       ├── variables.css      # CSS変数
│   │       ├── reset.css          # リセットCSS
│   │       └── responsive.css     # レスポンシブ設定
│   │
│   ├── js/                        # JavaScript
│   │   └── main.js                # メインスクリプト
│   │
│   └── images/                    # 画像ファイル
│       ├── logo.svg               # サイトロゴ
│       └── og-image.png           # OGP画像
│
├── _site/                         # 生成される静的ファイル（Git管理外）
│   ├── index.html
│   ├── blog/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── ...
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
- **`about.njk`**: Aboutページ
- **`404.njk`**: エラーページ

### データファイル

- **`posts.js`**: Contentfulから記事データを取得
- **`site.json`**: サイト共通設定（タイトル、説明文、ナビゲーション）

### スタイルファイル

- **`main.css`**: 全スタイルをインポートするメインファイル
- **`variables.css`**: CSS変数（色、フォント、サイズなど）
- **`reset.css`**: ブラウザのデフォルトスタイルをリセット
- **各コンポーネントCSS**: 部品ごとのスタイル定義

### JavaScriptファイル

- **`main.js`**: ダークモード切替、スムーススクロールなどの機能

### ツールファイル

- **`deploy.js`**: デプロイ前の確認スクリプト
- **`content-sync.js`**: Contentfulとの接続確認

## 開発ワークフロー

1. **開発開始**: `npm run dev` で開発サーバー起動
2. **ファイル編集**: `src/` 以下のファイルを編集
3. **自動リロード**: 変更は自動的にブラウザに反映
4. **ビルド**: `npm run build` で静的ファイル生成
5. **デプロイ**: `npm run deploy` でデプロイ準備

## 重要なポイント

- **環境変数**: `.env` ファイルでContentfulの設定を管理
- **ダークモード**: CSS変数とJavaScriptで実装
- **レスポンシブ**: モバイルファーストで設計
- **SEO対応**: メタタグ、OGP、構造化データ
- **パフォーマンス**: 軽量なCSS、最適化された画像
