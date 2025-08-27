import { execSync } from 'node:child_process'

export function detectPM() {
  const ua = process.env.npm_config_user_agent || ''
  return ua.includes('pnpm') ? 'pnpm'
       : ua.includes('yarn') ? 'yarn'
       : ua.includes('bun')  ? 'bun'
       : 'npm'
}
export function installDev(deps) {
  if (!deps?.length) return
  const pm = detectPM()
  const cmd = pm === 'yarn' ? `yarn add -D ${deps.join(' ')}`
            : pm === 'pnpm' ? `pnpm add -D ${deps.join(' ')}`
            : pm === 'bun'  ? `bun add -d ${deps.join(' ')}`
            : `npm i -D ${deps.join(' ')}`
  execSync(cmd, { stdio: 'inherit' })
}
