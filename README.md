# Application Test Template

> **In short:** a minimal Nuxt application template for independent capability acceptance and presentation testing in the Nuxt Layers ecosystem.

## Purpose

Use GitHub's **Use this template** action to create a separate test application for a capability. Each generated repository owns its capability dependencies, server-side composition, scenarios, fixtures and acceptance results. The template owns no capability-specific implementation.

## Getting started

Install the Node.js version declared in `.node-version`, select it with `fnm use`, and use the pnpm version declared in `package.json`. From the generated project:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

The local development server defaults to `http://localhost:3000`.

## Boundaries

- Consume a capability only through its published `CONTRACT.md` and public exports.
- Keep capability behaviour, administrative screens and server-side enforcement in their owning capability.
- Configure application navigation, fixtures and test scenarios in each derived repository.
- Consume Theme Manager's public semantic vocabulary; do not define another theme system.
- Use British English, accessible interaction and Nuxt's built-in internationalisation-friendly primitives.

## Shared test application

The template provides a themed application shell, a separate homepage at `/`, an admin/test dashboard at `/admin`, responsive collapsible navigation and Theme Manager in explicit local `test` mode. Derived test applications add capability-specific scenarios and navigation; they do not need to implement their own application shell.

Open `http://localhost:3000/` for the homepage, `/admin` for the test dashboard or `/theme-manager` to exercise Theme Manager. The homepage has no administration sidebar; the logo in the test-area top bar returns home, while the homepage links into `/admin`. Sidebar sections can be expanded and collapsed, and mobile navigation is overlaid.

This is a **local-only development and test template**. Theme Manager test mode provides unauthenticated management endpoints, so do not publish the template as a public server.

The Theme Manager dependency tracks accepted development `master`; after its revision changes, refresh and commit the dependency lockfile to capture the exact tested commit. Before release adoption, replace the moving Git reference with an immutable release reference.

## Top application bar

The shared shell includes a logo/identity link, a Theme Manager-backed Appearance menu (theme picker and system/light/dark preference), and a reserved authentication-status area.

The authentication area deliberately reports **Not signed in**; no authentication layer or sign-in action is supplied by the template. Derived test applications can connect a real authentication capability later. The colour-mode preference is stored in the test application's `test-colour-mode` cookie; it is separate from Theme Manager's selected-theme cookie. As in the reference site, the host controls the `html.dark` class.

The header is part of the shared test application and does not add UI dependencies to Theme Manager.

## Configurable branding

The homepage, top bar and sidebar share `TestBrand`, which reads `testBrand` from the host application's `app/app.config.ts`. The initial logo is expected at `public/nuxt-layers-logo.png`; until that image is added, a simple fallback mark is shown.

Derived test applications can override `testBrand.name`, `testBrand.logoSrc` and `testBrand.logoAlt` in their own application config without editing shared shell components. The name defaults to **Nuxt Layers Test** if omitted or blank, is rendered as ordinary Vue text (not HTML), and is truncated when space is limited. The logo path must be a local absolute path (for example `/my-brand.png`); invalid paths fall back to the placeholder mark. Text is shown beside the logo on the homepage and expanded sidebar, and on wider toolbar layouts. Keep brand selection host-owned; a future Configuration capability can supply these settings through the host without introducing a Theme Manager dependency.

## Capability navigation identity

The Theme Manager sidebar link uses the `/theme-manager-logo.png` public asset owned by the composed Theme Manager layer. Its text label remains accessible. The image is optional and hidden on load failure. This link requires Theme Manager PR #18 to be merged and the consumer lockfile refreshed to its accepted revision; verify the asset responds at `/theme-manager-logo.png` before merging this integration PR.
