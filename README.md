# Infrastructure Test Application

Derived from [application-test-template](https://github.com/nuxt-layers-test/application-test-template). This repository owns infrastructure-specific integration scenarios; the shared test template remains independent of PostgreSQL and Temporal.

## Local setup

Start the services in [nuxt-layers/infrastructure](https://github.com/nuxt-layers/infrastructure) using `.\\scripts\\start.ps1 -Temporal`. The infrastructure should already have passed its PostgreSQL and Temporal acceptance suites.

Copy `.env.example` to `.env` **in this repository** and adjust the PostgreSQL URL to match the development `infrastructure/.env` credentials. Keep all credentials server-side. Do not publish or remotely expose this template: it includes Theme Manager's unauthenticated test mode and development-only diagnostics.

**Dependency lockfile:** This derived repository inherits the template's lockfile, which does not yet contain the new `pg` and `@temporalio/client` packages. After checking out this PR, regenerate and commit the reviewed lockfile locally using `corepack pnpm install --no-frozen-lockfile`. CI should subsequently use `corepack pnpm install --frozen-lockfile`. Do not merge the PR until this is resolved and local/CI validation passes.

```powershell
corepack pnpm install --no-frozen-lockfile
corepack pnpm dev --host 127.0.0.1
```

Open `http://127.0.0.1:3000/admin`, then use **Infrastructure** to visit `/admin/infrastructure` and select **Check connections**.

## What is tested

- PostgreSQL: a real SQL query for connection, configured role and PostgreSQL 18 server version. Queries are read-only and do not expose values to the browser.
- Temporal: a real frontend gRPC system-info request through the TypeScript SDK. This checks the Temporal frontend but not a gateway workflow.

Tests are **opt-in and fail closed**: the API route returns 404 outside development, for non-loopback requests, or unless `NUXT_INFRA_TEST_ENABLED=true`. It returns fixed outcome messages rather than exception contents, credentials or SQL results. Environment settings are read from Nuxt private `runtimeConfig`.

The Temporal Gateway repository currently lacks its public `CONTRACT.md` and implementation. No gateway interface is invented or consumed in this PR. After its public contract is available, a later PR will replace the direct Temporal SDK connectivity probe with a gateway-contract acceptance scenario.

## Out of scope

No application runtime database roles, authorisation, tenant isolation/RLS, capability data mutations, gateway workflow execution, production deployments or backups are established here. The current sample database URL uses disposable development bootstrap credentials; a dedicated least-privilege diagnostic role is required before broader integration.

All tests and builds must be performed by CI or the user's local machine, not by the assistant.

## Shared application shell

The inherited Theme Manager UI, homepage, appearance preferences, `/admin` dashboard and navigation remain available. Continue to use the template's public design vocabulary and host-owned composition.
