/**
 * Validates required runtime environment variables during Nest bootstrap.
 */
export function validateEnv(config: Record<string, unknown>) {
  const required = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  return config;
}
