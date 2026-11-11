import { createRequire } from 'node:module'
import type { Connection as TemporalConnection } from '@temporalio/client'

const requireDependency = createRequire(import.meta.url)

type Probe = { status: 'passed' | 'failed' | 'not-configured'; detail: string }
const unavailable = (detail: string): Probe => ({ status: 'not-configured', detail })

export default defineEventHandler(async (event) => {
  // Diagnostics are strictly for a loopback-bound local development server.
  // Nitro's dev request adapter may omit TCP socket addresses altogether.
  // Reject known non-loopback socket peers when available, and also restrict
  // the HTTP Host value (do not honour forwarded host headers).
  // Host checking is defence-in-depth, NOT a substitute for binding to loopback.
  const loopback = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])
  const remoteAddress = event.node.req.socket?.remoteAddress
  const localAddress = event.node.req.socket?.localAddress
  const host = getRequestHost(event, { xForwardedHost: false })
  const localHost = /^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d{1,5})?$/.test(host)

  if (process.env.NODE_ENV !== 'development' ||
      !localHost ||
      (remoteAddress !== undefined && !loopback.has(remoteAddress)) ||
      (localAddress !== undefined && !loopback.has(localAddress))) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const config = useRuntimeConfig(event).infraTest
  if (String(config?.enabled) !== 'true') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  let postgres: Probe = unavailable('No server-side database URL configured')
  if (config.databaseUrl) {
    // Resolve optional service clients only for an authorised diagnostic request.
    const { Client: PgClient } = requireDependency('pg') as typeof import('pg')
    const client = new PgClient({
      connectionString: config.databaseUrl,
      connectionTimeoutMillis: 3000,
      query_timeout: 3000,
      application_name: 'nuxt-layers-infrastructure-test',
    })
    try {
      await client.connect()
      const result = await client.query(
        "SELECT current_database() AS database_name, current_user AS role_name, current_setting('server_version_num') AS version"
      )
      const row = result.rows[0]
      const major = Math.floor(Number(row?.version) / 10000)
      postgres = {
        status: major === 18 ? 'passed' : 'failed',
        detail: major === 18
          ? 'PostgreSQL 18 SQL query succeeded using the configured server-side role'
          : 'Connected PostgreSQL is not version 18',
      }
    } catch {
      postgres = { status: 'failed', detail: 'Database connection or read-only SQL probe failed' }
    } finally {
      try { await client.end() } catch { /* No credentials or connection internals in output */ }
    }
  }

  let temporal: Probe = unavailable('No server-side Temporal frontend address configured')
  if (config.temporalAddress) {
    let connection: TemporalConnection | undefined
    try {
      const { Connection } = requireDependency('@temporalio/client') as typeof import('@temporalio/client')
      connection = await Connection.connect({ address: config.temporalAddress })
      await connection.workflowService.getSystemInfo({})
      temporal = { status: 'passed', detail: 'Temporal frontend responded to a gRPC system-info request' }
    } catch {
      temporal = { status: 'failed', detail: 'Temporal frontend connection or gRPC probe failed' }
    } finally {
      if (connection) await connection.close()
    }
  }

  setHeader(event, 'Cache-Control', 'no-store')
  return { postgres, temporal, checkedAt: new Date().toISOString() }
})
