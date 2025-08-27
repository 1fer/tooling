import { existsSync } from 'node:fs'
import { copyTemplate, paths } from '../utils/fs.mjs'

export async function applyIgnore() {
  const fallback = [
    'node_modules','.nuxt','.output','dist','coverage','.vercel','.husky','.turbo','.idea','.vscode'
  ].join('\n')
  if (!existsSync(paths.prettierIgnore)) {
    copyTemplate('../../prettier/ignore.txt', paths.prettierIgnore, '.prettierignore', fallback)
  } else {
    console.log('• .prettierignore exists — skipped')
  }
}
