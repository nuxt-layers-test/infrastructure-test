export default defineNuxtPlugin(() => {
  const { preference } = useTestColourMode()
  applyTestColourMode(preference.value)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (preference.value === 'system') applyTestColourMode('system')
  })
})
