// Temporary Theme Manager acceptance composition; not for public deployment.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Development diagnostics are unauthenticated: bind the server to loopback.
  devServer: { host: '127.0.0.1' },
  hooks: {
    'pages:extend'(pages) {
      // Flat page to avoid requiring a nested <NuxtPage> in /admin.
      const infrastructurePage = pages.find((page) =>
        page.file?.replaceAll('\\', '/').endsWith('/app/pages/admin-infrastructure.vue'),
      )
      if (infrastructurePage) infrastructurePage.path = '/admin/infrastructure'
    },
  },
  extends: ['@nuxt-layers/theme-manager'],
  runtimeConfig: {
    themeManager: { mode: 'test' },
    // Server-only: do not put credentials or frontend address in public config.
    infraTest: { enabled: false, databaseUrl: '', temporalAddress: '' },
  },
})
