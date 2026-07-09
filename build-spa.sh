#!/usr/bin/env bash
set -euo pipefail
cd /home/team/shared/site

echo "=== Removing old server-side files ==="
rm -rf src/db src/lib/server-fns.ts src/db.ts vercel-entry.ts build-vercel.sh cap-init.mjs setup-cap.sh 2>/dev/null
echo "Done"

echo "=== Reinstalling npm deps ==="
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps 2>&1 | tail -5

echo "=== Building SPA ==="
npx vite build 2>&1

echo "=== DONE ==="
