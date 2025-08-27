import { existsSync } from 'node:fs'
import { loadJson, saveJson, paths } from '../utils/fs.mjs'
import { installDev } from '../utils/pm.mjs'

export async function applyPrettier(ctx) {
  if (!existsSync(paths.pkg)) {
    console.error('❌ package.json not found. Run in project root.')
    process.exit(1)
  }
  const pkg = loadJson(paths.pkg)
  pkg.prettier = '@1fer/tooling/prettier'
  pkg.scripts ||= {}
  pkg.scripts.format ||= 'prettier --write .'
  pkg.scripts['format:check'] ||= 'prettier --check .'
  saveJson(paths.pkg, pkg)
  console.log('✓ Prettier config and scripts added to package.json')

  if (ctx.withInstall) {
    console.log('Installing Prettier...')
    installDev(['prettier'])
  }
}
