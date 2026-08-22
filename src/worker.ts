import { env } from "./config/env";

// BullMQ queue processors (email notifications, etc.) are registered here.
// They are added in the background-jobs stage; this entrypoint owns the
// worker process lifecycle (startup logging, graceful shutdown) independent
// of that.

// eslint-disable-next-line no-console
console.log(`TaskFlow worker starting [${env.nodeEnv}]`);

function shutdown(signal: string): void {
  // eslint-disable-next-line no-console
  console.log(`Worker received ${signal}, shutting down gracefully...`);
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
