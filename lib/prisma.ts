import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * One pool per process, on purpose.
 *
 * `new PrismaPg()` builds its own `pg` Pool, so constructing the client on every
 * module evaluation leaks pools — under dev HMR (or any re-import) the stacks
 * add up until the provider refuses new connections and queries start failing
 * with ETIMEDOUT. Both the adapter and the client are therefore cached on
 * globalThis, the only object that survives module re-evaluation.
 */

type PrismaGlobals = {
  prisma?: PrismaClient;
  adapter?: PrismaPg;
};

const globals = globalThis as typeof globalThis & PrismaGlobals;

function connectionString() {
  const value = process.env.DATABASE_URL;

  if (!value) {
    throw new Error("DATABASE_URL is not set. Add it to your .env file.");
  }

  return value;
}

/**
 * Connection-level failures against a managed Postgres. The pooler recycles
 * sockets underneath us, so these surface at random and are safe to retry once
 * the client has reconnected.
 */
const TRANSIENT_CONNECTION_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "EPIPE",
  "ENOTFOUND",
  "EAI_AGAIN",
  "P1001",
  "P1002",
  "P1017",
]);

function isTransientConnectionError(error: unknown) {
  const code = (error as { code?: unknown } | null)?.code;

  return typeof code === "string" && TRANSIENT_CONNECTION_CODES.has(code);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPrismaClient() {
  const adapter =
    globals.adapter ??
    new PrismaPg({
      connectionString: connectionString(),
      /* Serverless Postgres counts each socket against the project limit, so
         keep the pool small instead of piling up connections. */
      max: 5,
      /* Recycle idle sockets ourselves rather than handing a dead one to a
         request, which is what the pooler does behind our back. */
      idleTimeoutMillis: 30_000,
      /* A cold process pays for DNS plus TLS on its first query. */
      connectionTimeoutMillis: 30_000,
    });

  globals.adapter = adapter;

  return new PrismaClient({ adapter });
}

const base = globals.prisma ?? createPrismaClient();

/**
 * Single retry for transient connection failures. Without this a recycled
 * socket turns into a user-visible 500 on an otherwise healthy request.
 *
 * Only connection-level codes qualify: a query that reached the server and
 * failed for another reason is re-thrown untouched, so a failed write is never
 * silently applied twice.
 */
export const prisma = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, args, query }) {
        try {
          return await query(args);
        } catch (error) {
          if (!isTransientConnectionError(error)) throw error;

          console.warn(
            `[prisma] retrying ${operation} after a dropped connection (${
              (error as { code?: string }).code
            })`,
          );

          await delay(250);

          return query(args);
        }
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globals.prisma = base;
}