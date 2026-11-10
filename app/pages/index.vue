<template>
  <div class="min-h-screen bg-fill-floor-default text-pen-floor-default">
    <header class="flex flex-wrap items-center justify-between gap-step-md border-b border-edge-base-default bg-fill-base-default px-step-lg py-step-md">
      <NuxtLink to="/" class="flex items-center gap-step-sm font-semibold text-pen-base-default no-underline focus-visible:outline-focus focus-visible:outline-edge-base-focus">
        <TestBrand />
      </NuxtLink>
      <NuxtLink to="/admin" class="rounded-control border border-edge-primary-default bg-fill-primary-default px-step-sm py-step-xs font-medium text-pen-primary-default no-underline hover:border-edge-primary-hover hover:bg-fill-primary-hover hover:text-pen-primary-hover focus-visible:outline-focus focus-visible:outline-edge-primary-focus">Enter test area</NuxtLink>
    </header>
    <main id="main-content" class="mx-auto max-w-5xl p-step-lg md:p-step-2xl">
      <section class="space-y-step-md" aria-labelledby="home-title">
        <p class="text-label text-pen-muted-default">Application Test Template</p>
        <h1 id="home-title" class="text-title font-bold text-pen-floor-default">Nuxt Layers capability testing</h1>
        <p class="max-w-2xl text-body text-pen-muted-default">A shared foundation for independently testing Nuxt capability layers. The administration and test screens are kept in a separate workspace.</p>
        <NuxtLink to="/admin" class="inline-block rounded-control border border-edge-primary-default bg-fill-primary-default px-step-md py-step-sm font-semibold text-pen-primary-default no-underline hover:border-edge-primary-hover hover:bg-fill-primary-hover hover:text-pen-primary-hover focus-visible:outline-focus focus-visible:outline-edge-primary-focus">Open test dashboard</NuxtLink>
      </section>
    </main>
  </div>
</template>
