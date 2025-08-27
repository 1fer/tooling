#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = process.cwd()
const pkgPath = join(cwd, 'package.json')

if (!existsSync(pkgPath)) {
  console.error('❌ package.json not found. Run this in the project root.')
  process.exit(1)
}

const args = new Set(process.argv.slice(2))
const withInstall = args.has('--install') || args.has('-i')

// helper: resolve file inside this package (works on Win/Mac/Linux)
const fromPkg = (rel) => fileURLToPath(new URL(rel, import.meta.url))

// copy helper
function copyTemplate(srcRelUrl, destAbsPath, label) {
  const src = fromPkg(srcRelUrl)
  mkdirSync(dirname(destAbsPath), { recursive: true })
  copyFileSync(src, destAbsPath)
  console.log(`✓ ${label} created`)
}

// 1) add prettier config + scripts
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.prettier = '@1fer/tooling/prettier'
pkg.scripts ||= {}
pkg.scripts.format ||= 'prettier --write .'
pkg.scripts['format:check'] ||= 'prettier --check .'
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log('✓ Prettier config and scripts added to package.json')

// 2) .vscode/settings.json (prettier-only)
const settingsDest = join(cwd, '.vscode', 'settings.json')
if (!existsSync(settingsDest)) {
  copyTemplate('../vscode/settings.json', settingsDest, '.vscode/settings.json')
} else {
  console.log('• .vscode/settings.json already exists — skipped')
}

// 3) .prettierignore (optional, якщо ти його додаєш)
const ignoreDest = join(cwd, '.prettierignore')
if (!existsSync(ignoreDest)) {
  copyTemplate('../prettier/ignore.txt', ignoreDest, '.prettierignore')
} else {
  console.log('• .prettierignore already exists — skipped')
}

// 4) install prettier if requested
if (withInstall) {
  console.log('Installing Prettier...')
  execSync('npm i -D prettier', { stdio: 'inherit' })
}
