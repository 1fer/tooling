import { applyPrettier } from './prettier.mjs'
import { applyESLint } from './eslint.mjs'
import { applyVSCode } from './vscode.mjs'
import { applyIgnore } from './ignore.mjs'
import { applyStorybook } from './storybook.mjs'

export async function init(ctx) {
  await applyPrettier(ctx)
  await applyESLint(ctx)
  await applyStorybook(ctx)
  await applyVSCode(ctx)
  await applyIgnore(ctx)
  console.log('\nDone. Try:  npm run format')
}
