[ 繁體中文 ](./readme/README.zh-TW.md)

# Cloudflare Guestbook Worker

![License](https://img.shields.io/github/license/hsiehyunju/cloudflare-guestbook)

This is a guestbook backend API built with Cloudflare Workers, using [chanfana](https://github.com/cloudflare/chanfana) (OpenAPI 3.1) and the [Hono](https://github.com/honojs/hono) framework.

This project supports auto-generation of `openapi.json` documentation, stores comments using a D1 database, and integrates Cloudflare Turnstile for verification.

## Quick Start

1.  **Install Dependencies**
    Since Cloudflare Workers relies on a Node.js environment for building, you still need to use npm to install packages:
    ```bash
    npm install
    ```

2.  **Login to Cloudflare**
    ```bash
    npx wrangler login
    ```

## D1 Database Setup

This project uses Cloudflare D1 as the database.

### 1. Create Database
If you haven't created a database yet, run:
```bash
npx wrangler d1 create guestbook-db
```
After running this, paste the output `database_id` into the `d1_databases` block in `wrangler.jsonc`.

### 2. Binding & Migrations
When using it for the first time or when the database schema changes, you need to execute the migration file `migrations/0000_init.sql`.

**Local Development Environment:**
```bash
npx wrangler d1 migrations execute guestbook-db --local
```

**Production Environment (Remote):**
```bash
npx wrangler d1 migrations execute guestbook-db --remote
```
*(Note: `guestbook-db` is the `database_name` configured in `wrangler.jsonc`)*

## Environment Variables

This project requires the following environment variables to enable Turnstile verification.

### Variable Description
- `TURNSTILE_ENABLED` (boolean): Whether to enable Turnstile verification (e.g., `true` or `false`).
- `TURNSTILE_SECRET_KEY` (string): The Secret Key for Cloudflare Turnstile.

### Local Development (.dev.vars)
Create a `.dev.vars` file in the project root directory and add:
```bash
TURNSTILE_ENABLED=true
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Production Environment (Secrets)
Use the `wrangler secret put` command to set encrypted variables:

```bash
# Set Secret Key
npx wrangler secret put TURNSTILE_SECRET_KEY

# If you need to control the enabled state via variables in production (usually set in wrangler.jsonc [vars], but secrets are safer)
npx wrangler secret put TURNSTILE_ENABLED
```
*Or configure it directly in the Cloudflare Dashboard under Worker Settings > Variables.*

## Development & Deployment

### Start Local Development Server
Use Wrangler to start the local server:
```bash
npx wrangler dev
```
Once started, open the displayed URL in your browser (e.g., `http://localhost:8787/`) to see the Swagger UI interface for testing.

### Deploy to Cloudflare
Use Wrangler to deploy to Cloudflare:
```bash
npx wrangler deploy
```

## Project Structure
- `src/index.ts`: Main router entry point.
- `src/endpoints/`: Logic for each API endpoint.
- `migrations/`: D1 database migration files.
