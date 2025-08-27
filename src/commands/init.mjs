import { applyPrettier } from './prettier.mjs'
import { applyVSCode } from './vscode.mjs'
import { applyIgnore } from './ignore.mjs'

export async function init(ctx) {
  await applyPrettier(ctx)
  await applyVSCode(ctx)
  await applyIgnore(ctx)
  console.log('\nDone. Try:  npm run format')
}
