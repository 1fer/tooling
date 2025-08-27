import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { loadJson, saveJson, paths } from '../utils/fs.mjs'
import { installDev } from '../utils/pm.mjs'

export async function applyESLint(ctx) {
  if (!existsSync(paths.pkg)) {
    console.error('❌ package.json not found. Run in project root.')
    process.exit(1)
  }

  // 1) ensure dev deps
  if (ctx.withInstall) {
    console.log('Installing ESLint stack...')
    installDev([
      'eslint',
      '@nuxt/eslint',
      'eslint-config-prettier',
      'eslint-plugin-simple-import-sort',
      'eslint-plugin-unused-imports'
    ])
  }

  // 2) write eslint.config.mjs if missing
  const eslintConfigPath = join(process.cwd(), 'eslint.config.mjs')
  if (!existsSync(eslintConfigPath)) {
    mkdirSync(dirname(eslintConfigPath), { recursive: true })
    writeFileSync(eslintConfigPath, "import cfg from '@1fer/tooling/eslint'\nexport default cfg\n")
    console.log('✓ eslint.config.mjs created')
  } else {
    console.log('• eslint.config.mjs exists — skipped')
  }

  // 3) add scripts
  const pkg = loadJson(paths.pkg)
  pkg.scripts ||= {}
  pkg.scripts.lint ||= 'eslint .'
  pkg.scripts['lint:fix'] ||= 'eslint . --fix'
  saveJson(paths.pkg, pkg)
  console.log('✓ ESLint scripts added to package.json')

  // 4) replace VSCode settings with ESLint-aware preset (if not present)
  const { copyTemplate, paths: p } = await import('../utils/fs.mjs')
  const SETTINGS_ESLINT = JSON.stringify({
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "eslint.experimental.useFlatConfig": true,
    "eslint.validate": ["javascript", "javascriptreact", "typescript", "vue"],
    "eslint.format.enable": false
  }, null, 2)

  copyTemplate('../../vscode/settings.eslint.json', p.settings, '.vscode/settings.json', SETTINGS_ESLINT)

  console.log('✓ VSCode settings updated for ESLint')
}
