[ English ](./README.md)

# Cloudflare Guestbook Worker

這是一個使用 Cloudflare Workers 建構的訪客留言板後端 API，使用了 [chanfana](https://github.com/cloudflare/chanfana) (OpenAPI 3.1) 和 [Hono](https://github.com/honojs/hono) 框架。

本專案支援自動生成 `openapi.json` 文檔，並且使用 D1 資料庫存儲留言，整合 Cloudflare Turnstile 進行驗證。

## 快速開始 (Quick Start)

1.  **安裝依賴**
    由於 Cloudflare Workers 依賴 Node.js 環境進行構建，仍需使用 npm 安裝套件：
    ```bash
    npm install
    ```

2.  **登入 Cloudflare**
    ```bash
    npx wrangler login
    ```

## D1 資料庫設定 (Database Setup)

本專案使用 Cloudflare D1 作為資料庫。

### 1. 建立資料庫
如果您尚未建立資料庫，請執行：
```bash
npx wrangler d1 create guestbook-db
```
執行後，請將輸出的 `database_id` 填入 `wrangler.jsonc` 中的 `d1_databases` 區塊。

### 2. 綁定流程 & 執行遷移 (Migrations)
初次使用或資料庫架構變更時，需要執行遷移文件 `migrations/0000_init.sql`。

**本地開發環境 (Local):**
```bash
npx wrangler d1 migrations execute guestbook-db --local
```

**正式環境 (Remote):**
```bash
npx wrangler d1 migrations execute guestbook-db --remote
```
*(注意：`guestbook-db` 是 `wrangler.jsonc` 中設定的 `database_name`)*

## 環境變數設定 (Environment Variables)

本專案需要以下環境變數來啟用 Turnstile 驗證功能。

### 變數說明
- `TURNSTILE_ENABLED` (boolean): 是否啟用 Turnstile 驗證 (例如: `true` 或 `false`)。
- `TURNSTILE_SECRET_KEY` (string): Cloudflare Turnstile 的 Secret Key。

### 本地開發 (.dev.vars)
在專案根目錄建立 `.dev.vars` 檔案，並填入：
```bash
TURNSTILE_ENABLED=true
TURNSTILE_SECRET_KEY=您的_turnstile_secret_key
```

### 正式環境 (Secrets)
使用 `wrangler secret put` 指令設定加密變數：

```bash
# 設定 Secret Key
npx wrangler secret put TURNSTILE_SECRET_KEY

# 如果需要在正式環境透過變數控制啟用狀態 (通常在 wrangler.jsonc [vars] 設定即可，但 secret 較安全)
npx wrangler secret put TURNSTILE_ENABLED
```
*或是直接在 Cloudflare Dashboard 的 Worker Settings > Variables 中設定。*

## 開發與部署

### 啟動本地開發伺服器 (Development)
使用 Wrangler 啟動本地伺服器：
```bash
npx wrangler dev
```
啟動後，瀏覽器打開顯示的網址 (例如 `http://localhost:8787/`) 即可看到 Swagger UI 介面進行測試。

### 部署到 Cloudflare (Deploy)
使用 Wrangler 發布到 Cloudflare：
```bash
npx wrangler deploy
```

## 專案結構
- `src/index.ts`: 主要路由入口。
- `src/endpoints/`: 各個 API 端點的邏輯。
- `migrations/`: D1 資料庫遷移文件。
