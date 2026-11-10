<script setup lang="ts">
import { themeDefinitionToRuntime } from '@nuxt-layers/theme-manager/contracts'

type Mode = 'system' | 'light' | 'dark'
const runtime = useThemeRuntime()
const management = useThemeManagement()
const { preference } = useTestColourMode()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const route = useRoute()
const panelId = useId()
const loading = ref(false)
const error = ref<string | null>(null)
const themes = ref<Array<{ id: string; name: string }>>([])

async function refreshThemes() {
  loading.value = true
  error.value = null
  try {
    themes.value = await management.listThemes()
  }
  catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load themes.'
  }
  finally {
    loading.value = false
  }
}
async function toggle() {
  open.value = !open.value
  if (open.value) await refreshThemes()
}
async function chooseTheme(event: Event) {
  const id = (event.target as HTMLSelectElement).value
  try {
    if (!id) runtime.useDefault()
    else runtime.activate(themeDefinitionToRuntime(await management.loadTheme(id)))
    error.value = null
  }
  catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to select theme.'
  }
}
function chooseMode(value: Mode) { preference.value = value }
function outside(event: MouseEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    open.value = false
    root.value?.querySelector('button')?.focus()
  }
}
watch(() => route.fullPath, () => { open.value = false })
onMounted(() => {
  document.addEventListener('click', outside)
  document.addEventListener('keydown', keydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', outside)
  document.removeEventListener('keydown', keydown)
})
</script>

<template>
  <div ref="root" class="relative">
    <button type="button" class="rounded-control border border-edge-input-default bg-fill-input-default px-step-sm py-step-xs text-pen-input-default hover:border-edge-input-hover hover:bg-fill-input-hover hover:text-pen-input-hover focus-visible:outline-focus focus-visible:outline-edge-input-focus" :aria-expanded="open" :aria-controls="panelId" @click="toggle">
      Appearance <span aria-hidden="true">{{ open ? '▴' : '▾' }}</span>
    </button>
    <div v-if="open" :id="panelId" class="absolute right-0 top-full z-40 mt-step-xs w-72 max-w-[calc(100vw-2rem)] space-y-step-md rounded-panel border border-edge-base-default bg-fill-base-default p-step-md text-pen-base-default shadow-lg">
      <label class="block text-label font-semibold" for="test-theme-select">Theme</label>
      <select id="test-theme-select" class="mt-step-xs w-full rounded-control border border-edge-input-default bg-fill-input-default p-step-xs text-pen-input-default" :disabled="loading" :value="runtime.selectedThemeId.value ?? ''" @change="chooseTheme">
        <option value="">Default Theme</option>
        <option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</option>
      </select>
      <p v-if="error" role="alert" class="text-caption text-pen-error-default">{{ error }}</p>
      <fieldset>
        <legend class="mb-step-xs text-label font-semibold">Colour mode</legend>
        <div class="grid grid-cols-3 gap-step-2xs">
          <button v-for="mode in (['system', 'light', 'dark'] as const)" :key="mode" type="button" :aria-pressed="preference === mode" class="rounded-control border border-edge-input-default bg-fill-input-default px-step-xs py-step-2xs text-caption capitalize text-pen-input-default hover:bg-fill-input-hover hover:text-pen-input-hover aria-pressed:border-edge-input-selected aria-pressed:bg-fill-input-selected aria-pressed:text-pen-input-selected focus-visible:outline-focus focus-visible:outline-edge-input-focus" @click="chooseMode(mode)">{{ mode }}</button>
        </div>
      </fieldset>
    </div>
  </div>
</template>
