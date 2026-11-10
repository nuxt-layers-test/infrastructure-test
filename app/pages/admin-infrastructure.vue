<script setup lang="ts">
definePageMeta({ path: '/admin/infrastructure' })
type Probe = { status: 'passed' | 'failed' | 'not-configured'; detail: string }
type Report = { postgres: Probe; temporal: Probe; checkedAt: string }
const report = ref<Report | null>(null)
const error = ref('')
const pending = ref(false)

async function checkConnections() {
  pending.value = true
  error.value = ''
  report.value = null
  try {
    report.value = await $fetch<Report>('/api/infrastructure/status')
  } catch {
    error.value = 'Infrastructure diagnostics are unavailable. Ensure development mode, local access and the server-only configuration are enabled.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-5xl space-y-step-lg" aria-labelledby="infrastructure-title">
    <header class="space-y-step-xs">
      <NuxtLink to="/admin" class="text-body text-pen-primary-default underline">Back to test dashboard</NuxtLink>
      <h1 id="infrastructure-title" class="text-title font-bold text-pen-base-default">Infrastructure integration</h1>
      <p class="text-body text-pen-muted-default">Server-side connectivity diagnostics for the local development stack. No credentials are sent to the browser.</p>
    </header>
    <button type="button" :disabled="pending" class="rounded-control border border-edge-primary-default bg-fill-primary-default px-step-md py-step-sm font-medium text-pen-primary-default disabled:opacity-60" @click="checkConnections">
      {{ pending ? 'Checking connections…' : 'Check connections' }}
    </button>
    <p v-if="error" role="alert" class="text-body text-pen-base-default">{{ error }}</p>
    <div v-if="report" class="grid gap-step-md md:grid-cols-2" aria-live="polite">
      <article v-for="item in ([{ name: 'Application PostgreSQL', probe: report.postgres }, { name: 'Temporal frontend', probe: report.temporal }])" :key="item.name" class="rounded-card border border-edge-base-default bg-fill-base-default p-step-md">
        <h2 class="text-heading font-bold text-pen-base-default">{{ item.name }}</h2>
        <p class="mt-step-xs text-body font-semibold text-pen-base-default">{{ item.probe.status }}</p>
        <p class="mt-step-xs text-body text-pen-muted-default">{{ item.probe.detail }}</p>
      </article>
      <p class="text-label text-pen-muted-default md:col-span-2">Checked {{ report.checkedAt }}. These probes do not establish security isolation or Temporal Gateway compatibility.</p>
    </div>
  </section>
</template>
