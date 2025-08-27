import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { loadJson, saveJson, paths } from '../utils/fs.mjs'
import { installDev } from '../utils/pm.mjs'

export async function applyStorybook(ctx) {
  // 1) deps
  if (ctx.withInstall) {
    console.log('Installing Storybook deps...')
    installDev([
      '@nuxtjs/storybook',
      'storybook',
      '@storybook/vue3-vite',
      '@vitejs/plugin-vue'
    ])
  }

  // 2) scripts
  const pkg = loadJson(paths.pkg)
  pkg.scripts ||= {}
  pkg.scripts.storybook ||= 'nuxt storybook'
  pkg.scripts['storybook:build'] ||= 'nuxt storybook build'
  saveJson(paths.pkg, pkg)
  console.log('✓ Storybook scripts added to package.json')

  // 3) .storybook files
  const sbDir = join(process.cwd(), '.storybook')
  mkdirSync(sbDir, { recursive: true })

  const mainPath = join(sbDir, 'main.ts')
  if (!existsSync(mainPath)) {
    const mainContent = `import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  framework: { name: '@storybook/vue3-vite', options: {} },
  stories: ['../components/**/*.stories.@(ts)'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-docs'],
  viteFinal: async (config) => {
    config.plugins ||= []
    config.plugins.push(vue())
    return config
  },
}
export default config
`
    writeFileSync(mainPath, mainContent)
    console.log('✓ .storybook/main.ts created')
  } else {
    console.log('• .storybook/main.ts exists — skipped')
  }

  const previewPath = join(sbDir, 'preview.ts')
  if (!existsSync(previewPath)) {
    const previewContent = `import type { Preview } from '@storybook/vue3'
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ }
    }
  }
}
export default preview
`
    writeFileSync(previewPath, previewContent)
    console.log('✓ .storybook/preview.ts created')
  } else {
    console.log('• .storybook/preview.ts exists — skipped')
  }
}
