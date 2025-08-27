import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const cwd = process.cwd()
export const fromPkg = (rel) => fileURLToPath(new URL(rel, import.meta.url))

export function ensureWrite(dest, content) {
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, content)
}

export function copyTemplate(srcRelUrl, destAbsPath, label, fallback) {
  try {
    const src = fromPkg(srcRelUrl)
    if (existsSync(src)) {
      mkdirSync(dirname(destAbsPath), { recursive: true })
      copyFileSync(src, destAbsPath)
      console.log(`✓ ${label} created`)
      return
    }
  } catch {}
  if (fallback) {
    ensureWrite(destAbsPath, fallback)
    console.log(`✓ ${label} created (fallback)`)
  } else {
    console.warn(`⚠︎ ${label} missing and no fallback provided`)
  }
}

export function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}
export function saveJson(path, obj) {
  ensureWrite(path, JSON.stringify(obj, null, 2))
}
export const paths = {
  pkg: join(cwd, 'package.json'),
  vscodeDir: join(cwd, '.vscode'),
  settings: join(cwd, '.vscode', 'settings.json'),
  extensions: join(cwd, '.vscode', 'extensions.json'),
  prettierIgnore: join(cwd, '.prettierignore')
}
