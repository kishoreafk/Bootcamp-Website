import "dotenv/config";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function isTruthy(value: string | undefined) {
  return ["1", "true", "yes", "on"].includes((value ?? "").toLowerCase());
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value && isProduction()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  get appId() {
    return required("APP_ID");
  },
  get appSecret() {
    return required("APP_SECRET");
  },
  get isProduction() {
    return isProduction();
  },
  get isDemoMode() {
    return isTruthy(process.env.DEMO_MODE);
  },
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get kimiAuthUrl() {
    return required("KIMI_AUTH_URL");
  },
  get kimiOpenUrl() {
    return required("KIMI_OPEN_URL");
  },
  get jwtSecret() {
    return required("JWT_SECRET");
  },
  get ownerUnionId() {
    return process.env.OWNER_UNION_ID ?? "";
  },
};
