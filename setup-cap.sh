#!/usr/bin/env bash
cd /home/team/shared/site
echo "=== Adding Android platform ==="
npx cap add android 2>&1
echo "EXIT: $?"
echo "=== Adding iOS platform ==="
npx cap add ios 2>&1
echo "EXIT: $?"
echo "=== Done ==="
