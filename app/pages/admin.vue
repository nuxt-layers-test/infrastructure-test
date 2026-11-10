<template>
  <section class="mx-auto max-w-5xl space-y-step-lg" aria-labelledby="dashboard-title">
    <header>
      <h1 id="dashboard-title" class="text-title font-bold text-pen-base-default">Capability Test Dashboard</h1>
      <p class="mt-step-xs text-body text-pen-muted-default">A consistent home for independent Nuxt capability testing.</p>
    </header>
    <div class="grid gap-step-md md:grid-cols-2">
      <article class="rounded-card border border-edge-base-default bg-fill-base-default p-step-md">
        <h2 class="text-heading font-bold text-pen-base-default">Theme Manager</h2>
        <p class="my-step-sm text-body text-pen-muted-default">Exercise theme selection, creation, editing and preview with the built-in test store.</p>
        <NuxtLink to="/theme-manager" class="inline-block rounded-control border border-edge-primary-default bg-fill-primary-default px-step-sm py-step-xs font-medium text-pen-primary-default focus-visible:outline-focus focus-visible:outline-edge-primary-focus">Open Theme Manager</NuxtLink>
      </article>
      <article class="rounded-card border border-edge-base-default bg-fill-base-default p-step-md">
        <h2 class="text-heading font-bold text-pen-base-default">Future capabilities</h2>
        <p class="mt-step-sm text-body text-pen-muted-default">Each generated test application adds its own navigation entries and acceptance scenarios without changing the shared shell.</p>
      </article>
    </div>
  </section>
</template>
