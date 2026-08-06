# SBIグループ タスク管理ツール

外部エンジニアとの協業用に、費用ゼロで運用できるシンプルなタスク管理Webアプリです。

## 機能

✅ タスク作成・編集・削除  
✅ 担当者割り当て  
✅ ステータス管理（未着手 → 進行中 → 完了）  
✅ プロジェクト別管理  
✅ シンプルで直感的なUI  

## 技術スタック

- **フロントエンド**: HTML5 + CSS + Vanilla JavaScript
- **バックエンド**: Node.js + Express
- **データベース**: SQLite
- **認証**: シンプルなトークン認証（不要な場合は省略可）

## ローカル開発環境セットアップ

### 前提条件
- Node.js v14以上がインストールされていること
- npm（Node Package Manager）

### 手順

1. **リポジトリをクローン**
   ```bash
   git clone <your-repo-url>
   cd task-management-tool
   ```

2. **依存パッケージをインストール**
   ```bash
   npm install
   ```

3. **ローカルサーバーを起動**
   ```bash
   npm start
   ```

4. **ブラウザで開く**
   ```
   http://localhost:3000
   ```

## デプロイ方法（無料ホスティング）

### オプション 1: Render.com (推奨)

1. **Render.com にサインアップ**
   - https://render.com へアクセス
   - GitHubアカウントで登録

2. **このリポジトリをGitHubにプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. **Render.com で新規サービスを作成**
   - Dashboard → "New +" → "Web Service"
   - GitHubリポジトリを接続
   - 以下の設定で作成:
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

4. **URLが自動生成されるので、外部エンジニアに共有**

### オプション 2: Railway

1. **Railway にサインアップ**
   - https://railway.app へアクセス

2. **プロジェクト作成**
   - "Create New Project" → "Deploy from GitHub repo"
   - このリポジトリを接続

3. **自動デプロイ開始**
   - 数分後に本番URLが生成されます

### オプション 3: Replit

1. **Replit にサインアップ**
   - https://replit.com へアクセス

2. **"Create" → GitHub URLをインポート**

3. **自動的に起動します**

## 使い方

### 基本操作

**プロジェクトを追加**
- 左サイドバーの「新規プロジェクト」に名前を入力
- ➕ボタンをクリック

**タスクを追加**
- 「タスクタイトル」を入力
- 「担当者」を入力（例：太郎、花子）
- 「説明」を入力（オプション）
- 「タスク追加」をクリック

**ステータスを更新**
- タスクの「未着手」「進行中」「完了」ボタンをクリック
- 次のステータスに自動遷移

**担当者を変更**
- タスクの担当者名をクリック
- 新しい名前を入力

**タスクを削除**
- 「削除」ボタンをクリック

## セキュリティ上の注意

このアプリケーションは、**内部用の簡易ツール**を想定しています。

本番環境で使用する場合は以下を推奨します：
- ✅ 認証機能の追加（シンプルなパスワード保護など）
- ✅ HTTPS化（ほとんどのホスティングで自動）
- ✅ 定期的なバックアップ

## ファイル構成

```
.
├── server.js              # Node.jsサーバー（バックエンド）
├── package.json           # 依存パッケージ定義
├── public/
│   └── index.html         # フロントエンド（UI）
└── README.md              # このファイル
```

## トラブルシューティング

### "Cannot find module 'sqlite3'"
```bash
npm install
```

### ポート 3000 が既に使用されている
```bash
PORT=3001 npm start
```

### データベースがリセットされた
```bash
rm tasks.db
npm start
```

## 今後の拡張予定

将来的に以下の機能を追加することも可能です：
- 優先度設定
- 期限設定
- コメント機能
- ファイル添付
- 権限管理

## ライセンス

MIT License

## サポート

問題が発生した場合は、GitHubのIssueで報告してください。

---

**費用**: 0円 ✅  
**セットアップ時間**: 5分  
**導入の簡単さ**: ⭐⭐⭐⭐⭐
