#!/usr/bin/env node
import { init } from '../src/commands/init.mjs'

const args = new Set(process.argv.slice(2))
const ctx = {
  withInstall: args.has('--install') || args.has('-i'),
  force: args.has('--force')
}

try {
  await init(ctx)
} catch (err) {
  console.error('❌ 1fer-tooling failed:', err?.message || err)
  process.exit(1)
}
