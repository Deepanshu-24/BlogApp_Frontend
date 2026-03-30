# Blottr — Local Setup Instructions

## Prerequisites
- Node.js 18+ (https://nodejs.org)
- pnpm: `npm install -g pnpm`

## Steps to Run Locally

### 1. Rename the config files
After extracting, rename these two files:

```
package.standalone.json   →   package.json       (replace the existing one)
vite.standalone.config.ts →   vite.config.ts     (replace the existing one)
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Start the dev server
```bash
pnpm dev
```

The app will run at: http://localhost:5173

---

## Connecting to your FastAPI Backend

Your FastAPI backend must be running at `http://localhost:8000`.

Start your backend:
```bash
uvicorn app.main:app --reload
```

Then open http://localhost:5173 — the frontend will connect automatically.

---

## Changing the Backend URL

Edit `src/lib/api.ts` and change the URL:

```ts
export const API_BASE = "http://localhost:8000";  // change this if needed
```
