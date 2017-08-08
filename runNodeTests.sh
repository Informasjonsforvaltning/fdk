#!/usr/bin/env bash
set -e

cd registrering-gui
npm install --no-progress
npm run-script ng e2e
cd ..

echo "Node e2e tests done";