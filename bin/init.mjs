#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const cwd = process.cwd()
const pkgPath = join(cwd, 'package.json')

if (!existsSync(pkgPath)) {
  console.error('❌ package.json not found. Run this in the project root.')
  process.exit(1)
}

const args = new Set(process.argv.slice(2))
const withInstall = args.has('--install') || args.has('-i')

// Update package.json with Prettier config + scripts
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.prettier = '@1fer/tooling/prettier'
pkg.scripts ||= {}
pkg.scripts.format ||= 'prettier --write .'
pkg.scripts['format:check'] ||= 'prettier --check .'
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log('✓ Prettier config and scripts added to package.json')

// Ensure .vscode folder exists
const vscodeDir = join(cwd, '.vscode')
mkdirSync(vscodeDir, { recursive: true })

// Copy settings.json (Prettier only) if not exists
const settingsSrc = join(new URL('../vscode/settings.json', import.meta.url).pathname)
const settingsDest = join(vscodeDir, 'settings.json')
if (!existsSync(settingsDest)) {
  copyFileSync(settingsSrc, settingsDest)
  console.log('✓ .vscode/settings.json created (Prettier only)')
} else {
  console.log('• .vscode/settings.json already exists — skipped')
}

// If --install → install Prettier
if (withInstall) {
  console.log('Installing Prettier...')
  execSync('npm i -D prettier', { stdio: 'inherit' })
}