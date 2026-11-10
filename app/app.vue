<template>
  <NuxtRouteAnnouncer />
  <NuxtPage v-if="route.path === '/'" />
  <div v-else class="test-shell bg-fill-floor-default text-pen-floor-default">
    <aside id="test-navigation" class="test-sidebar gap-step-md p-step-md border-edge-base-default bg-fill-base-default text-pen-base-default" :class="{ 'test-sidebar--collapsed': collapsed, 'test-sidebar--open': mobileOpen }" aria-label="Test application navigation">
      <div class="test-brand gap-step-xs">
        <NuxtLink to="/" class="test-brand__title gap-step-xs" @click="mobileOpen = false">
          <TestBrand :show-name="!collapsed || mobileOpen" compact />
        </NuxtLink>
        <button class="test-icon-button rounded-control px-step-xs py-step-2xs test-sidebar__collapse border-edge-base-default bg-fill-base-default text-pen-base-default hover:border-edge-base-hover hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" type="button" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" :aria-expanded="!collapsed" @click="collapsed = !collapsed">
          {{ collapsed ? '»' : '«' }}
        </button>
        <button class="test-icon-button rounded-control px-step-xs py-step-2xs test-sidebar__close border-edge-base-default bg-fill-base-default text-pen-base-default hover:border-edge-base-hover hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" type="button" aria-label="Close navigation" @click="mobileOpen = false">×</button>
      </div>
      <nav class="test-nav gap-step-2xs" aria-label="Capability navigation">
        <NuxtLink to="/admin" class="test-nav__link gap-step-sm rounded-control p-step-sm text-pen-base-default hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" active-class="test-nav__link--active bg-fill-primary-selected text-pen-primary-selected border-edge-primary-selected" exact-active-class="test-nav__link--active bg-fill-primary-selected text-pen-primary-selected border-edge-primary-selected" @click="mobileOpen = false">
          <span aria-hidden="true">⌂</span><span v-if="!collapsed || mobileOpen">Dashboard</span>
        </NuxtLink>
        <div class="test-nav__section">
          <button type="button" class="test-nav__section-toggle gap-step-sm rounded-control p-step-sm text-pen-base-default hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" :aria-expanded="capabilitiesOpen" aria-controls="test-capability-links" @click="capabilitiesOpen = !capabilitiesOpen">
            <span aria-hidden="true">▦</span><span v-if="!collapsed || mobileOpen">Capabilities</span><span v-if="!collapsed || mobileOpen" aria-hidden="true">{{ capabilitiesOpen ? '⌄' : '›' }}</span>
          </button>
          <div v-if="capabilitiesOpen" id="test-capability-links">
            <NuxtLink to="/theme-manager" class="test-nav__link gap-step-sm rounded-control p-step-sm text-pen-base-default hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" active-class="test-nav__link--active bg-fill-primary-selected text-pen-primary-selected border-edge-primary-selected" @click="mobileOpen = false">
              <img v-if="!themeManagerLogoFailed" src="/theme-manager-logo.png" alt="" class="size-6 shrink-0 rounded-control object-contain" @error="themeManagerLogoFailed = true" /><span v-else aria-hidden="true">◈</span><span v-if="!collapsed || mobileOpen">Theme Manager</span>
            </NuxtLink>
          </div>
        </div>
      </nav>
      <p v-if="!collapsed || mobileOpen" class="test-sidebar__footer text-caption text-pen-muted-default">Local capability testing only</p>
    </aside>
    <button v-if="mobileOpen" class="test-backdrop bg-fill-floor-default opacity-70" type="button" aria-label="Close navigation" @click="mobileOpen = false" />
    <div class="test-content">
      <header class="test-header gap-step-sm px-step-lg border-edge-base-default bg-fill-base-default text-pen-base-default">
        <button type="button" class="test-icon-button rounded-control px-step-xs py-step-2xs test-mobile-toggle border-edge-base-default bg-fill-base-default text-pen-base-default hover:border-edge-base-hover hover:bg-fill-base-hover hover:text-pen-base-hover focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-edge-base-focus" aria-label="Open navigation" aria-controls="test-navigation" :aria-expanded="mobileOpen" @click="mobileOpen = true">☰</button>
        <NuxtLink to="/" class="flex min-w-0 items-center gap-step-sm text-pen-base-default no-underline focus-visible:outline-focus focus-visible:outline-edge-base-focus">
          <TestBrand class="test-toolbar-brand" compact />
        </NuxtLink>
        <NuxtLink to="/admin" class="hidden rounded-control px-step-xs py-step-2xs text-caption text-pen-link-default hover:bg-fill-link-hover hover:text-pen-link-hover focus-visible:outline-focus focus-visible:outline-edge-link-focus sm:inline">Test dashboard</NuxtLink>
        <div class="ml-auto flex flex-wrap items-center justify-end gap-step-sm">
          <TestAppearanceMenu />
          <div class="flex items-center gap-step-xs rounded-control border border-edge-base-default bg-fill-base-default px-step-sm py-step-xs text-caption text-pen-muted-default" role="status" aria-label="Authentication status">
            <span class="size-2 rounded-full bg-fill-muted-default" aria-hidden="true"></span>
            Not signed in
          </div>
        </div>
      </header>
      <main id="main-content" class="test-main p-step-md md:p-step-lg">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const collapsed = ref(false)
const mobileOpen = ref(false)
const capabilitiesOpen = ref(true)
const themeManagerLogoFailed = ref(false)
</script>

<style>
/* Only positioning and responsive shell mechanics live here; presentation uses public Theme Manager utilities. */
.test-shell{display:flex;min-height:100dvh}
.test-sidebar{position:sticky;top:0;display:flex;flex-direction:column;width:16rem;min-width:16rem;height:100dvh;border-right-width:1px;transition:width .2s,min-width .2s;z-index:20}
.test-sidebar--collapsed{width:4.5rem;min-width:4.5rem}
.test-brand{display:flex;align-items:center;justify-content:space-between;min-height:2.5rem}
.test-brand__title{display:flex;align-items:center;color:inherit;text-decoration:none;font-weight:700;white-space:nowrap}
.test-icon-button{border-width:1px;cursor:pointer}
.test-nav{display:grid}
.test-nav__link,.test-nav__section-toggle{display:flex;width:100%;align-items:center;border-width:1px;border-color:transparent;text-decoration:none;text-align:left;cursor:pointer;white-space:nowrap}
.test-nav__section-toggle span:last-child{margin-left:auto}
.test-sidebar__footer{margin-top:auto}
.test-content{flex:1;min-width:0}
.test-header{display:flex;align-items:center;flex-wrap:wrap;min-height:3.75rem;border-bottom-width:1px;font-weight:600}
.test-mobile-toggle,.test-sidebar__close{display:none}
.test-backdrop{display:none}
.test-toolbar-brand > span:last-child{display:none}
@media(min-width:640px){.test-toolbar-brand > span:last-child{display:inline}}
@media(max-width:700px){
  .test-sidebar{position:fixed;left:0;top:0;transform:translateX(-100%);transition:transform .2s;width:16rem;min-width:16rem}
  .test-sidebar--open{transform:translateX(0)}
  .test-sidebar--open .test-sidebar__collapse{display:none}
  .test-sidebar__close,.test-mobile-toggle{display:inline-flex}
  .test-backdrop{display:block;position:fixed;inset:0;border:0;z-index:10}
}
@media(prefers-reduced-motion:reduce){.test-sidebar{transition:none}}
</style>