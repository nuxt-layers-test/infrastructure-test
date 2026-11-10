// Temporary Theme Manager acceptance composition; not for public deployment.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['@nuxt-layers/theme-manager'],
  runtimeConfig: {
    themeManager: { mode: 'test' },
  },
})
