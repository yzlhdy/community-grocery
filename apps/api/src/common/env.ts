/**
 * 在 Nest 启动阶段校验必填运行时环境变量。
 */
export function validateEnv(config: Record<string, unknown>) {
  const required = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];
  for (const key of required) {
    if (!config[key]) {
      throw new Error(`缺少必填环境变量：${key}`);
    }
  }
  return config;
}
