#!/bin/bash

echo "=== Testing Vite Setup ==="
echo ""

echo "1. Checking Node.js version..."
node --version

echo ""
echo "2. Checking npm version..."
npm --version

echo ""
echo "3. Checking if vite is installed..."
npm list vite

echo ""
echo "4. Checking package.json scripts..."
cat package.json | grep -A 6 '"scripts"'

echo ""
echo "5. Checking if index.html exists..."
ls -la index.html

echo ""
echo "6. Checking if src/index.jsx exists..."
ls -la src/index.jsx

echo ""
echo "7. Testing vite command directly..."
npx vite --version

echo ""
echo "=== Setup looks good! ==="
echo "Now try: npm run dev"
