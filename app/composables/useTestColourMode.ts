export type TestColourMode = 'system' | 'light' | 'dark'
const choices = ['system', 'light', 'dark'] as const

export function useTestColourMode() {
  const cookie = useCookie<TestColourMode | undefined>('test-colour-mode', {
    path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365,
  })
  const preference = computed<TestColourMode>({
    get: () => choices.includes(cookie.value as TestColourMode) ? cookie.value! : 'system',
    set(value) {
      cookie.value = value
      if (import.meta.client) applyTestColourMode(value)
    },
  })
  return { preference }
}

export function applyTestColourMode(mode: TestColourMode) {
  if (!import.meta.client) return
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}
