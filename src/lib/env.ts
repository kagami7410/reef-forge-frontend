/**
 * Environment configuration utility
 * Centralizes all environment variable access with type safety and validation
 */

/**
 * Get optional environment variable
 */
function getOptionalEnv(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return fallback;
  return value === 'true' || value === '1';
}

/**
 * Get numeric environment variable
 */
function getNumericEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}

// ============================================================================
// Environment Configuration
// ============================================================================

export const env = {
  // Node environment
  NODE_ENV: getOptionalEnv('NODE_ENV', 'development'),
  IS_PRODUCTION: getOptionalEnv('NODE_ENV') === 'production',
  IS_DEVELOPMENT: getOptionalEnv('NODE_ENV') === 'development',

  // Backend configuration (supports both old and new variable names)
  BACKEND_HOSTNAME: getOptionalEnv('BACKEND_HOSTNAME') || getOptionalEnv('REEF_FORGE_BACKEND_HOSTNAME', 'http://localhost:3001'),

  // Stripe configuration (optional for local dev without payments)
  STRIPE_PUBLIC_KEY: getOptionalEnv('NEXT_PUBLIC_STRIPE_PUBLIC_KEY', ''),
  STRIPE_SECRET_KEY: getOptionalEnv('STRIPE_SECRET_KEY', ''),

  // JWT configuration
  JWT_SECRET: getOptionalEnv('JWT_SECRET', ''),

  // Public configuration (accessible in browser)
  PUBLIC: {
    STRIPE_PUBLIC_KEY: getOptionalEnv('NEXT_PUBLIC_STRIPE_PUBLIC_KEY', ''),
    SHIPPING_PRICE: getNumericEnv('NEXT_PUBLIC_SHIPPING_PRICE', 2.95),
    GCS_BUCKET_URL: getOptionalEnv('NEXT_PUBLIC_GCS_BUCKET_URL') || getOptionalEnv('NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS', ''),
    ENABLE_DISCOUNTS: getBooleanEnv('NEXT_PUBLIC_ENABLE_DISCOUNTS', true),
    ENABLE_REVIEWS: getBooleanEnv('NEXT_PUBLIC_ENABLE_REVIEWS', false),
    ENABLE_WISHLIST: getBooleanEnv('NEXT_PUBLIC_ENABLE_WISHLIST', false),
  },

  // Application URLs
  APP_URL: getOptionalEnv('NEXT_PUBLIC_APP_URL') || getOptionalEnv('REEF_FORGE_FRONTEND_HOSTNAME', 'http://localhost:3000'),

} as const;

/**
 * Validate required environment variables on startup
 * This should be called at application initialization
 *
 * Note: In development, some variables are optional (e.g., Stripe for non-payment testing)
 */
export function validateEnv(): void {
  const isProduction = process.env.NODE_ENV === 'production';

  // Only validate critical variables in production
  const required = isProduction ? [
    'BACKEND_HOSTNAME',
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'JWT_SECRET',
  ] : [
    // In development, only JWT_SECRET is critical for auth
    'JWT_SECRET',
  ];

  const missing: string[] = [];

  for (const key of required) {
    const value = process.env[key] || process.env[`REEF_FORGE_${key}`];
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}`;

    if (isProduction) {
      throw new Error(message);
    } else {
      console.warn('⚠️  ' + message);
      console.warn('   Some features may not work without these variables.');
    }
  }
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  const baseUrl = env.APP_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get backend API URL
 */
export function getBackendUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${env.BACKEND_HOSTNAME}${normalizedEndpoint}`;
}

/**
 * Check if running in browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if running on server
 */
export const isServer = !isBrowser;

// ============================================================================
// Type Exports
// ============================================================================

export type Environment = typeof env;
