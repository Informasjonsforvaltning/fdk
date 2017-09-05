#!/usr/bin/env bash
set -e

cd registration
npm install --no-progress
npm install -g protractor
webdriver-manager update
protractor --specs='e2e/app.e2e-spec.ts'
#npm run-script ng e2e
cd ..

echo "Node e2e tests done";