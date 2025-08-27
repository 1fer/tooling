#!/usr/bin/env node
import { init } from '../src/commands/init.mjs'

const args = new Set(process.argv.slice(2))
const withInstall = args.has('--install') || args.has('-i')
const force = args.has('--force')
const cmd = [...args].find(a => !a.startsWith('-')) || 'init'

const ctx = { withInstall, force }

if (cmd === 'init') {
  await init(ctx)
} else if (cmd === 'prettier') {
  const { applyPrettier } = await import('../src/commands/prettier.mjs')
  await applyPrettier(ctx)
} else if (cmd === 'vscode') {
  const { applyVSCode } = await import('../src/commands/vscode.mjs')
  await applyVSCode(ctx)
} else if (cmd === 'ignore') {
  const { applyIgnore } = await import('../src/commands/ignore.mjs')
  await applyIgnore(ctx)
} else {
  console.error(`Unknown command: ${cmd}
Usage:
  1fer-tooling [init|prettier|vscode|ignore] [--install] [--force]`)
  process.exit(1)
}
