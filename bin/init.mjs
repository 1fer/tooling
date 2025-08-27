#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
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

const fromPkg = (rel) => fileURLToPath(new URL(rel, import.meta.url))
const ensureWrite = (dest, content) => { mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, content) }
function copyTemplate(srcRelUrl, dest, label, fallback) {
  try {
    const src = fromPkg(srcRelUrl)
    if (existsSync(src)) {
      mkdirSync(dirname(dest), { recursive: true })
      copyFileSync(src, dest)
      console.log(`✓ ${label} created`)
      return
    }
  } catch {}
  if (fallback) {
    ensureWrite(dest, fallback)
    console.log(`✓ ${label} created (fallback)`)
  } else {
    console.warn(`⚠︎ ${label} missing in package and no fallback provided`)
  }
}

// 1) package.json → prettier + scripts
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.prettier = '@1fer/tooling/prettier'
pkg.scripts ||= {}
pkg.scripts.format ||= 'prettier --write .'
pkg.scripts['format:check'] ||= 'prettier --check .'
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log('✓ Prettier config and scripts added to package.json')

// 2) VS Code: settings.json (prettier-only)
const SETTINGS_FALLBACK = JSON.stringify({
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}, null, 2)

copyTemplate('../vscode/settings.json', join(cwd, '.vscode', 'settings.json'), '.vscode/settings.json', SETTINGS_FALLBACK)

// 3) VS Code: extensions.json
const EXTENSIONS_FALLBACK = JSON.stringify({
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}, null, 2)

copyTemplate('../vscode/extensions.json', join(cwd, '.vscode', 'extensions.json'), '.vscode/extensions.json', EXTENSIONS_FALLBACK)

// 4) .prettierignore (якщо використовуєш)
const PRETTIERIGNORE_FALLBACK = [
  'node_modules','.nuxt','.output','dist','coverage','.vercel','.husky','.turbo','.idea','.vscode'
].join('\n')
copyTemplate('../prettier/ignore.txt', join(cwd, '.prettierignore'), '.prettierignore', PRETTIERIGNORE_FALLBACK)

// 5) Install prettier (optional)
if (withInstall) {
  console.log('Installing Prettier...')
  execSync('npm i -D prettier', { stdio: 'inherit' })
}
