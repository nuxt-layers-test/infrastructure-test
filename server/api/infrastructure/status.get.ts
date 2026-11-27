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
    const { Pool } = requireDependency('pg') as typeof import('pg')
    const pool = new Pool({
      max: 1,
      idleTimeoutMillis: 1000,
      connectionString: config.databaseUrl,
      connectionTimeoutMillis: 3000,
      query_timeout: 3000,
      application_name: 'nuxt-layers-infrastructure-test',
    })
    let client: import('pg').PoolClient | undefined
    try {
      client = await pool.connect()
      const result = await client.query(
        "SELECT current_database() AS database_name, current_user AS role_name, current_setting('server_version_num') AS version, r.rolsuper, r.rolbypassrls, r.rolcreaterole, r.rolcreatedb, r.rolreplication FROM pg_roles r WHERE r.rolname = current_user"
      )
      const row = result.rows[0]
      const major = Math.floor(Number(row?.version) / 10000)
      if (!row || major !== 18 || row.rolsuper || row.rolbypassrls || row.rolcreaterole || row.rolcreatedb || row.rolreplication) {
        throw new Error('Unsafe diagnostic role or incompatible database')
      }
      // The disposable host fixture includes a protected owner table.
      // Verify existence without querying private records; missing fixture fails closed.
      const grants = await client.query(
        "SELECT c.oid IS NOT NULL AS fixture_exists, CASE WHEN c.oid IS NULL THEN NULL ELSE has_table_privilege(current_user, c.oid, 'SELECT') OR has_table_privilege(current_user, c.oid, 'INSERT') OR has_table_privilege(current_user, c.oid, 'UPDATE') OR has_table_privilege(current_user, c.oid, 'DELETE') END AS unsafe_access FROM (SELECT 1) AS probe LEFT JOIN pg_namespace n ON n.nspname = 'infra_host_fixture' LEFT JOIN pg_class c ON c.relnamespace = n.oid AND c.relname = 'private_record'"
      )
      if (grants.rows[0]?.fixture_exists !== true || grants.rows[0]?.unsafe_access !== false) {
        throw new Error('Missing protected fixture or unsafe diagnostic grants')
      }
      let denied = false
      try {
        await client.query('SELECT id FROM infra_host_fixture.private_record LIMIT 1')
      } catch (error) {
        denied = typeof error === 'object' && error !== null && 'code' in error && error.code === '42501'
      }
      if (!denied) throw new Error('Diagnostic role did not reject private data access')
      // With one checked-out client, the next acquisition must time out.
      let saturated = false
      try {
        const unexpected = await pool.connect()
        unexpected.release()
      } catch (error) {
        saturated = error instanceof Error && error.message === 'timeout exceeded when trying to connect'
      }
      if (!saturated) throw new Error('Pool did not enforce bounded acquisition')
      client.release()
      client = undefined
      const recovered = await pool.query('SELECT 1 AS ok')
      if (recovered.rows[0]?.ok !== 1) throw new Error('Pool recovery failed')
      postgres = { status: 'passed', detail: 'PostgreSQL 18 restricted-role, private data denial and bounded pool recovery succeeded' }
    } catch {
      postgres = { status: 'failed', detail: 'Database connection or read-only SQL probe failed' }
    } finally {
      client?.release()
      try { await pool.end() } catch { /* No credentials or connection internals in output */ }
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
