#!/usr/bin/env bash
set -euo pipefail
cd /home/team/shared/site
echo "=== Git status ==="
git status --short
echo "=== Adding all files ==="
git add -A
echo "=== Committing ==="
git commit -m "Vercel inline-data fix + Capacitor mobile wrapper setup

- Inlined symptoms.json and products.json into src/data/ as JS modules
- Removed all filesystem readFile/path.resolve/import.meta.dir calls
- Added Capacitor config (capacitor.config.ts, capacitor.config.json)
- Added build:mobile npm script
- Installed @capacitor/core, @capacitor/cli, @capacitor/android, @capacitor/ios"
echo "=== Pushing to main ==="
git push -u origin main 2>&1 || git push origin main 2>&1
echo "=== Done ==="