#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for the static SPA.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/3] vite build"
bun run build

echo "[2/3] assemble .vercel/output (static SPA)"
rm -rf .vercel/output
mkdir -p .vercel/output/static
cp -R dist/* .vercel/output/static/
cp -R api .vercel/output/api

echo "[3/3] configure Vercel"
cat > .vercel/output/config.json <<'JSON'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/(.*)", "dest": "/api/early-access" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
JSON

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
