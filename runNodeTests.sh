#!/usr/bin/env bash
set -e

cd registrering-gui
npm install
npm run-script ng e2e
cd ..

echo "YAYAYAYA";