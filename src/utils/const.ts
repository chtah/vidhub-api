const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET) throw Error("JWT_SECRET environment is not config");

export const JWT_SECRET = ENV_JWT_SECRET;
