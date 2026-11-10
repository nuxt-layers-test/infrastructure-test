// Temporary Theme Manager acceptance composition; not for public deployment.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: ['@nuxt-layers/theme-manager'],
  runtimeConfig: {
    themeManager: { mode: 'test' },
    // Server-only: do not put credentials or frontend address in public config.
    infraTest: { enabled: false, databaseUrl: '', temporalAddress: '' },
  },
})
