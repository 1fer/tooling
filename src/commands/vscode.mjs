import { mkdirSync, existsSync } from 'node:fs'
import { paths, copyTemplate } from '../utils/fs.mjs'

export async function applyVSCode() {
  mkdirSync(paths.vscodeDir, { recursive: true })

  const SETTINGS = JSON.stringify({
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[vue]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
    "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }
  }, null, 2)

  const EXT = JSON.stringify({
    "recommendations": ["esbenp.prettier-vscode","dbaeumer.vscode-eslint"]
  }, null, 2)

  if (!existsSync(paths.settings)) {
    copyTemplate('../../vscode/settings.json', paths.settings, '.vscode/settings.json', SETTINGS)
  } else {
    console.log('• .vscode/settings.json exists — skipped')
  }
  if (!existsSync(paths.extensions)) {
    copyTemplate('../../vscode/extensions.json', paths.extensions, '.vscode/extensions.json', EXT)
  } else {
    console.log('• .vscode/extensions.json exists — skipped')
  }
}
