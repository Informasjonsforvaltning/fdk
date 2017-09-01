#!/usr/bin/env bash
set -e

cd registration
npm install --no-progress
npm run-script ng e2e
cd ..

echo "Node e2e tests done";