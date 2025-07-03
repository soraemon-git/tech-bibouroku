# Tech Blog

テクノロジー・PC・スマホに関する最新情報をお届けするブログサイト

## 🚀 技術スタック

- **フロントエンド**: 11ty (Eleventy)
- **CMS**: Contentful
- **スタイリング**: カスタムCSS
- **ホスティング**: Netlify/Vercel

## 📦 プロジェクト構成

```
tech-blog/
├── src/                    # ソースコード
│   ├── _includes/          # テンプレート
│   ├── _data/              # データファイル
│   ├── css/                # スタイルシート
│   ├── js/                 # JavaScript
│   └── images/             # 画像ファイル
├── _site/                  # 生成ファイル
└── tools/                  # 開発ツール
```

## � セットアップ

### 📋 要件
- **Node.js**: 18.x LTS以上  
- **npm**: 9.x以上  
- **Contentful**: 無料アカウント

### �🛠 他PCでの初期セットアップ

#### 1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/tech-blog.git
cd tech-blog
```

#### 2. 依存関係のインストール
```bash
npm install
```

#### 3. 環境変数の設定
```bash
# .env.exampleを.envにコピー
copy .env.example .env
# または Linux/Mac の場合
cp .env.example .env
```

`.env`ファイルを編集して実際の値を設定：
```env
CONTENTFUL_SPACE_ID=your_actual_space_id
CONTENTFUL_ACCESS_TOKEN=your_actual_delivery_token
CONTENTFUL_MANAGEMENT_TOKEN=your_actual_management_token
```

#### 4. Contentful設定の確認
```bash
# 接続テスト
npm run content-sync
```

#### 5. 開発サーバー起動
```bash
npm run dev
```

ブラウザで `http://localhost:8080` にアクセス

## 📝 利用可能なコマンド

- `npm run dev` - 開発サーバー起動（ファイル監視・自動リロード）
- `npm run build` - 本番ビルド
- `npm run serve` - ビルド済みファイルをプレビュー
- `npm run clean` - 生成ファイル削除
- `npm run deploy` - デプロイ準備
- `npm run content-sync` - Contentful接続確認
- `npm run create-post` - 記事作成ツール起動
- `npm run new-post` - 記事作成ツール起動（短縮版）

## 🎯 主要機能

- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ SEO最適化
- ✅ 高速表示（静的サイト）
- ✅ Contentful CMS連携
- ✅ サンプルデータ表示

## 📖 記事作成

### 🎯 対話型記事作成ツール（推奨）

専用の記事作成ツールを使用して簡単に記事を作成できます：

```bash
# 記事作成ツールを実行
node scripts/create-post.js
```

**利用可能なテンプレート:**
- 製品レビュー
- ニュース記事  
- ハウツー・ガイド
- 比較記事
- カスタム（自由形式）

**セットアップ要件:**
1. `.env`ファイルに`CONTENTFUL_MANAGEMENT_TOKEN`を追加
2. `npm install contentful-management`で追加パッケージをインストール

詳細は[開発環境構築ガイド](./doc/DEVELOPMENT_SETUP.md#8-記事作成の簡易化)を参照してください。

### Contentfulダッシュボードでの作成
1. Contentfulでブログ記事のContent Typeを作成
2. 記事を作成・公開
3. 自動でサイトに反映

### 現在の状態
- プレースホルダー値でサンプル記事を表示
- 実際のContentful設定後は自動切り替え

## 🚀 デプロイ

### Netlify
1. GitHubリポジトリを接続
2. ビルドコマンド: `npm run build`
3. 公開ディレクトリ: `_site`
4. 環境変数を設定

### Vercel
1. GitHubリポジトリを接続
2. フレームワーク: Other
3. ビルドコマンド: `npm run build`
4. 出力ディレクトリ: `_site`

## 📚 ドキュメント

- [プロジェクト概要](./PROJECT_OVERVIEW.md)
- [開発環境構築](./doc/DEVELOPMENT_SETUP.md)
- [プロジェクト構造](./PROJECT_STRUCTURE.md)

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 お問い合わせ

プロジェクトに関する質問は、Issuesページでお気軽にお聞かせください。

---

**作成日**: 2025年7月2日  
**最終更新**: 2025年7月3日

## 🤝 チーム開発・他PC展開

### 🔄 チーム開発の流れ

1. **環境構築**
   ```bash
   git clone [repository-url]
   cd tech-blog
   npm install
   cp .env.example .env
   # .envファイルを編集してAPI設定
   ```

2. **開発開始前**
   ```bash
   git pull origin main
   npm install  # package.jsonの変更があった場合
   npm run content-sync  # Contentful接続確認
   ```

3. **記事作成**
   ```bash
   npm run create-post  # 対話型記事作成
   npm run dev          # 開発サーバーで確認
   ```

4. **コード変更時**
   ```bash
   git add .
   git commit -m "feat: 新機能追加"
   git push origin feature/your-feature
   ```

### 🚨 重要な注意点

- **`.env`ファイルはGitで管理されません** - チームメンバーには別途APIキーを共有
- **`drafts/`ディレクトリは個人用** - Gitで管理されません
- **Node.jsのバージョンを統一** - 推奨: 18.x LTS
- **パッケージのインストール**: `npm ci`を推奨（本番環境と同一構成）

### 📋 新PCでのチェックリスト

- [ ] Node.js 18.x LTS インストール済み
- [ ] Git インストール済み
- [ ] プロジェクトクローン完了
- [ ] `npm install` 実行済み
- [ ] `.env`ファイル作成・設定済み
- [ ] `npm run content-sync`でContentful接続確認済み
- [ ] `npm run dev`で開発サーバー起動確認済み
- [ ] `npm run create-post`で記事作成テスト済み

### 🔧 開発者向けツール

```bash
# プロジェクトの健全性チェック
npm run content-sync

# 記事作成ツールのヘルプ
npm run create-post -- --help

# テンプレート一覧確認
ls templates/

# ローカルドラフト確認
ls drafts/
```
