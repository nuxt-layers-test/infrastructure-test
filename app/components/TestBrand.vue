<template>
  <span class="inline-flex min-w-0 items-center gap-step-sm">
    <img v-if="logoSrc && !imageFailed" :src="logoSrc" :alt="logoAlt" :class="imageClass" class="shrink-0 rounded-control object-contain" @error="imageFailed = true" />
    <span v-else :class="imageClass" class="grid shrink-0 place-items-center rounded-control border border-edge-primary-default bg-fill-primary-default text-pen-primary-default" aria-hidden="true">◆</span>
    <span v-if="showName && displayName" class="min-w-0 truncate font-semibold">{{ displayName }}</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ showName?: boolean; compact?: boolean }>(), {
  showName: true,
  compact: false,
})
const appConfig = useAppConfig()
const testBrand = computed(() => appConfig.testBrand ?? { name: 'Nuxt Layers Test', logoSrc: '', logoAlt: '' })
const imageFailed = ref(false)
const fallbackName = 'Nuxt Layers Test'
const displayName = computed(() => {
  const configured = testBrand.value.name
  return typeof configured === 'string' && configured.trim() ? configured.trim() : fallbackName
})
const logoSrc = computed(() => typeof testBrand.value.logoSrc === 'string' && /^\/(?!\/)[^?#]*$/.test(testBrand.value.logoSrc) ? testBrand.value.logoSrc : '')
const logoAlt = computed(() => typeof testBrand.value.logoAlt === 'string' ? testBrand.logoAlt : '')
const imageClass = computed(() => props.compact ? 'size-8' : 'size-10')
watch(logoSrc, () => { imageFailed.value = false })
</script>
