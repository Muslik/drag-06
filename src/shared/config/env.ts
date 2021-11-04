// Default vars
export const { BUILD_TARGET } = process.env;
export const BUILD_ON_CLIENT = BUILD_TARGET === 'client';
export const BUILD_ON_SERVER = BUILD_TARGET === 'server';

export const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);
export const IS_DEBUG = Boolean(process.env.DEBUG);

export const { NODE_ENV } = process.env;
export const IS_DEV_ENV = NODE_ENV === 'development';
export const IS_PROD_ENV = NODE_ENV === 'production';

// Custom vars
export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:9008';
export const CLIENT_BACKEND_URL = process.env.CLIENT_BACKEND_URL ?? '/api/internal';
