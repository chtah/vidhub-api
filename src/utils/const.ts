const { JWT_SECRET: ENV_JWT_SECRET, REDIS_URL: ENV_REDIS_URL } = process.env;

if (!ENV_JWT_SECRET) throw Error("JWT_SECRET environment is not config");

export const JWT_SECRET = ENV_JWT_SECRET;

export const REQUIRED_RECORD_NOT_FOUND = "P2025";

export const UNIQUE_CONSTRAINT_VIOLATION = "P2002";

export const REDIS_URL = ENV_REDIS_URL ?? "redis://localhost:6379";

export const BLACKLIST_REDIS_KEY_PREFIX = "bl_";

export const BLACKLIST_REDIS_VALUE = "1";

export const getAuthToken = (authorizationHeader: string) =>
  authorizationHeader.replace("Bearer ", "").trim();
