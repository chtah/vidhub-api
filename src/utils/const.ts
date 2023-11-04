const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET) throw Error("JWT_SECRET environment is not config");

export const JWT_SECRET = ENV_JWT_SECRET;

export const REQUIRED_RECORD_NOT_FOUND = "P2025";

export const UNIQUE_CONSTRAINT_VIOLATION = "P2002";
