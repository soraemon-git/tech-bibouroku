# テクノロジーブログ プロジェクト概要設計書

## プロジェクト概要

テクノロジー系（PC・スマホ等）のブログサイト開発プロジェクト

**作成日**: 2025年7月2日  
**対象読者**: 開発者・保守担当者

---

## 技術選定

### アーキテクチャ
- **ヘッドレスCMS + 静的サイトジェネレーター**
- **データベースレス構成**

### 採用技術スタック

| 分野 | 技術 | 理由 |
|------|------|------|
| フロントエンド | 11ty (Eleventy) | 軽量、高速ビルド、依存パッケージ最小 |
| CMS | Contentful | ヘッドレスCMS、API充実、管理画面優秀 |
| スタイリング | カスタムCSS + CSS Variables | 軽量性、完全カスタマイズ可能 |
| ホスティング | CDN配信 (推奨: Netlify/Vercel) | 高速、低コスト、自動デプロイ |

### 依存パッケージ（現在の構成）
```json
{
  "dependencies": {
    "@11ty/eleventy": "^2.0.1",
    "contentful": "^10.3.6",
    "contentful-management": "^11.54.1",
    "dotenv": "^16.3.1",
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "@11ty/eleventy-dev-server": "^1.0.4"
  }
}
```

---

## システム構成

### データフロー
```
Contentful (記事管理) → 11ty (ビルド処理) → 静的HTML生成 → CDN配信
```

### ディレクトリ構造
```
project/
├── src/
│   ├── _includes/          # テンプレート
│   ├── _data/              # グローバルデータ
│   ├── posts/              # ブログ記事ページ
│   ├── css/                # スタイルシート
│   └── js/                 # JavaScript
├── _site/                  # 生成された静的ファイル
├── doc/                    # ドキュメント
├── scripts/                # スクリプト（記事作成ツール）
├── templates/              # 記事テンプレート
├── tools/                  # 開発ツール
├── .eleventy.js            # 11ty設定ファイル
├── package.json
└── README.md
```

---

## 技術選定の根拠

### 軽量性重視の選択
- **最小依存パッケージ**: 保守性向上、セキュリティリスク低減
- **カスタムCSS**: フレームワーク不要、完全制御可能
- **静的サイト生成**: 高速表示、低サーバーコスト

### Contentful採用理由
- ✅ 豊富なAPI機能
- ✅ 直感的な管理画面
- ✅ 画像最適化機能
- ✅ CDN配信対応
- ✅ 多言語対応可能

### 11ty採用理由
- ✅ 学習コストが低い
- ✅ 高速ビルド
- ✅ 柔軟なテンプレートエンジン対応
- ✅ プラグインエコシステム

---

## 主要機能要件

### 必須機能
- [x] 記事一覧表示
- [x] 記事詳細表示
- [x] カテゴリー分類（自動管理システム）
- [x] レスポンシブデザイン
- [x] SEO対策（メタタグ、構造化データ）
- [x] 検索機能（静的検索）
- [x] ダークモード対応
- [x] サイドバー機能

### 推奨機能
- [x] 検索機能（クライアントサイド検索）
- [x] 目次自動生成
- [x] カテゴリー自動管理
- [x] 記事作成ツール
- [ ] RSS/Atom配信
- [ ] サイトマップ生成
- [ ] ページネーション

### 将来拡張予定
- [ ] コメント機能（Disqus等外部サービス）
- [ ] ソーシャル共有機能
- [ ] Google Analytics連携
- [ ] 多言語対応
- [ ] タグ機能

---

## 開発環境セットアップ

### 前提条件
- Node.js 18.x以上
- npm or yarn
- Contentfulアカウント

### 環境変数
```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
```

### 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run serve

# 記事作成ツール
npm run create-post
npm run new-post

# Contentful接続確認
npm run content-sync

# デプロイ
npm run deploy
```

---

## 運用・保守

### コンテンツ更新フロー
1. Contentfulで記事作成・編集
2. Webhook or 手動でビルドトリガー
3. 自動デプロイ実行
4. CDN配信開始

### パフォーマンス目標
- **First Contentful Paint**: < 1.5秒
- **Largest Contentful Paint**: < 2.5秒
- **Cumulative Layout Shift**: < 0.1

### セキュリティ考慮事項
- 静的サイトのため攻撃面が最小
- ContentfulのAPIキー管理厳重化
- HTTPS必須
- CSP (Content Security Policy) 設定推奨

---

## コスト試算

### 月額想定コスト
- **Contentful**: 無料プラン（月25,000レコード）
- **ホスティング**: 無料〜$20（Netlify/Vercel）
- **ドメイン**: $10〜15/年

**総計**: ほぼ無料〜月$20程度

---

## 参考リソース

- [11ty公式ドキュメント](https://www.11ty.dev/)
- [Contentful JavaScript SDK](https://github.com/contentful/contentful.js)
- [JAMstack.org](https://jamstack.org/)

---

## 変更履歴

| 日付 | 変更者 | 変更内容 |
|------|--------|----------|
| 2025-07-02 | 初期作成者 | プロジェクト概要設計書作成 |
| 2025-07-04 | システム | カテゴリー自動管理システム、検索機能、記事作成ツール追加に伴う更新 |
