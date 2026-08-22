import "dotenv/config";

interface AppEnv {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessTtl: string;
    refreshTtlDays: number;
  };
  bcryptCostFactor: number;
  authRateLimit: {
    windowMs: number;
    max: number;
  };
  corsOrigin: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

function parseIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be an integer, got "${raw}"`);
  }
  return parsed;
}

function loadEnv(): AppEnv {
  const nodeEnv = optionalEnv("NODE_ENV", "development") as AppEnv["nodeEnv"];

  const bcryptCostFactor = parseIntEnv("BCRYPT_COST_FACTOR", 12);
  if (bcryptCostFactor < 12) {
    throw new Error("BCRYPT_COST_FACTOR must be >= 12 for adequate password hashing strength");
  }

  return {
    nodeEnv,
    port: parseIntEnv("PORT", 3000),
    databaseUrl: requireEnv("DATABASE_URL"),
    redis: {
      host: optionalEnv("REDIS_HOST", "localhost"),
      port: parseIntEnv("REDIS_PORT", 6379),
      password: process.env.REDIS_PASSWORD || undefined,
    },
    jwt: {
      accessSecret: requireEnv("JWT_ACCESS_SECRET"),
      refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
      accessTtl: optionalEnv("JWT_ACCESS_TTL", "15m"),
      refreshTtlDays: parseIntEnv("JWT_REFRESH_TTL_DAYS", 7),
    },
    bcryptCostFactor,
    authRateLimit: {
      windowMs: parseIntEnv("AUTH_RATE_LIMIT_WINDOW_MS", 60_000),
      max: parseIntEnv("AUTH_RATE_LIMIT_MAX", 10),
    },
    corsOrigin: optionalEnv("CORS_ORIGIN", "*"),
  };
}

export const env = loadEnv();
