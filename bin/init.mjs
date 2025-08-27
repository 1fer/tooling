#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

// Current working directory (project root where the script is executed)
const cwd = process.cwd()
const pkgPath = join(cwd, 'package.json')

// Ensure that package.json exists
if (!existsSync(pkgPath)) {
  console.error('❌ package.json not found. Run this in the project root.')
  process.exit(1)
}

// Load package.json
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

// Add Prettier config reference to package.json
pkg.prettier = '@1fer/tooling/prettier'

// Ensure scripts object exists and add Prettier scripts if not already defined
pkg.scripts ||= {}
pkg.scripts.format ||= 'prettier --write .'
pkg.scripts['format:check'] ||= 'prettier --check .'

// Save updated package.json
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log('✓ Prettier config and scripts added to package.json')

// Copy default .prettierignore from tooling package if it does not exist in the project
const ignoreSrc = join(new URL('../prettier/ignore.txt', import.meta.url).pathname)
const ignoreDest = join(cwd, '.prettierignore')
if (!existsSync(ignoreDest)) {
  copyFileSync(ignoreSrc, ignoreDest)
  console.log('✓ .prettierignore created')
}

// If --install flag is provided, install Prettier automatically
if (process.argv.includes('--install') || process.argv.includes('-i')) {
  console.log('Installing Prettier...')
  execSync('npm i -D prettier', { stdio: 'inherit' })
}
