# Infrastructure Test Application

Derived from [application-test-template](https://github.com/nuxt-layers-test/application-test-template). This repository owns infrastructure-specific integration scenarios; the shared test template remains independent of PostgreSQL and Temporal.

## Local setup

Start the services in [nuxt-layers/infrastructure](https://github.com/nuxt-layers/infrastructure) using `.\\scripts\\start.ps1 -Temporal`. The infrastructure should already have passed its PostgreSQL and Temporal acceptance suites.

Copy `.env.example` to `.env` **in this repository** and set the PostgreSQL URL to a separately provisioned diagnostic login. Never use the infrastructure bootstrap administrator. Enable diagnostics explicitly. Keep all credentials server-side. Do not publish or remotely expose this template: it includes Theme Manager's unauthenticated test mode and development-only diagnostics.

**Development toolchain:** Node.js 26.13.0, Corepack 0.36.0 and pnpm 12.16.1. Run `./scripts/verify-toolchain.ps1` on Windows. Nuxt 4.6.4 (security patch), TypeScript 6.0.3 and vue-tsc 3.3.14 are pinned in `package.json`; run `corepack pnpm typecheck` and `corepack pnpm build` locally or in CI. The assistant does not execute these commands.

**Dependency lockfile:** pnpm 12 uses a multi-document lockfile; the second YAML document contains the application dependency graph, including pg 8.16.3 and @temporalio/client 1.24.0. Use `corepack pnpm install --frozen-lockfile`. Do not regenerate the lockfile unnecessarily.

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm typecheck
```

Open `http://127.0.0.1:3000/admin/infrastructure` and select **Check connections**, or from another terminal run `Invoke-RestMethod http://127.0.0.1:3000/api/infrastructure/status | ConvertTo-Json -Depth 4`. Expect PostgreSQL passed and Temporal not-configured. Quit Nuxt in the launcher terminal to trigger disposable database cleanup.

## Local acceptance evidence

Owner typecheck passed on 27 November 2026; browser diagnostics at 20:38:52 UTC confirmed PostgreSQL restricted role, private data denial and bounded pool recovery passed, with Temporal not configured. Tested implementation ae1d44d and infrastructure launcher b5269ea. Frozen install/build and final launcher cleanup evidence remain outstanding.

## What is tested

- PostgreSQL: real restricted login, PostgreSQL 18 version and dangerous role-flag rejection, protected owner-table grant inspection and actual access rejection (SQLSTATE 42501), bounded one-client pool acquisition timeout and successful reacquisition. Queries are read-only; no row values or credentials are exposed. This is a client pool fixture, not complete proof of diagnostic grants or tenant isolation.
- Temporal: a real frontend gRPC system-info request through the TypeScript SDK. This checks the Temporal frontend but not a gateway workflow.

Tests are **opt-in and fail closed**: the API route returns 404 outside development, for non-loopback requests, or unless `NUXT_INFRA_TEST_ENABLED=true`. It returns fixed outcome messages rather than exception contents, credentials or SQL results. Environment settings are read from Nuxt private `runtimeConfig`.

The Temporal Gateway repository currently lacks its public `CONTRACT.md` and implementation. No gateway interface is invented or consumed in this PR. After its public contract is available, a later PR will replace the direct Temporal SDK connectivity probe with a gateway-contract acceptance scenario.

## Out of scope

No application runtime database roles, authorisation, tenant isolation/RLS, capability data mutations, gateway workflow execution, production deployments or backups are established here. The sample database URL is empty; a separately provisioned least-privilege diagnostic role is mandatory. The endpoint refuses powerful role flags but the infrastructure acceptance suite must prove actual grants.

All tests and builds must be performed by CI or the user's local machine, not by the assistant.

## Shared application shell

The inherited Theme Manager UI, homepage, appearance preferences, `/admin` dashboard and navigation remain available. Continue to use the template's public design vocabulary and host-owned composition.

## Windows ESM SSR failure triage

If the root route shows `ERR_UNSUPPORTED_ESM_URL_SCHEME` with a drive-letter protocol such as `d:`, the error occurs during Windows server module loading, before the infrastructure diagnostics run. The observed error string also appears in a known Nuxt Rspack/Webpack issue, but this project has **not** selected that builder. Do not claim this issue is conclusively fixed by updating Nuxt. After a locked reinstall and regeneration of `.nuxt`, rerun the local dev server and inspect the full server-side stack trace if it persists. Avoid globally disabling SSR, Node module security or replacing all absolute paths by string substitution. Server-only Temporal and PostgreSQL SDK imports have been deferred to authorised diagnostic requests to reduce eager server module loading.

## Local diagnostics access

Nuxt's dev request adapter may omit TCP socket metadata even for direct requests to `127.0.0.1`; an absent socket is therefore not sufficient evidence of a remote client. The API requires development mode, `NUXT_INFRA_TEST_ENABLED=true`, a loopback HTTP Host value (without trusting forwarded-host headers), and rejects non-loopback TCP addresses when they are supplied. **The actual access boundary is the Nuxt development server's listener bound to `127.0.0.1`** in `nuxt.config.ts`. Never override it with `--host 0.0.0.0`, `--public`, a tunnel or a network-facing reverse proxy. Host headers alone are spoofable and must never be treated as authentication. These diagnostics must not be used beyond this disposable local test environment.

The diagnostics page is registered at `/admin/infrastructure` through the Nuxt `pages:extend` hook, retaining a flat page rather than requiring a nested `<NuxtPage />` in `/admin`.
