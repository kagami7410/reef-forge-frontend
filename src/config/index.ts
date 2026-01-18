/**
 * Centralized configuration for Reef Forge Frontend
 * All magic numbers, business rules, and configuration constants should be defined here
 */

// ============================================================================
// Business Rules
// ============================================================================

/**
 * Pricing and discount configuration
 */
export const PRICING = {
  /** Shipping price in GBP */
  SHIPPING_PRICE: parseFloat(process.env.NEXT_PUBLIC_SHIPPING_PRICE || '2.95'),

  /** Minimum order total for free shipping in GBP */
  FREE_SHIPPING_THRESHOLD: 50,

  /** Stripe currency factor (100 pence per pound) */
  CURRENCY_FACTOR: 100,

  /** Default tax rate (if applicable) */
  TAX_RATE: 0,
} as const;

/**
 * Valid discount codes and their multipliers
 * Note: In production, this should be managed via backend/database
 */
export const DISCOUNT_CODES: Record<string, number> = {
  SAVE10: 0.9,  // 10% off
  // Add more discount codes as needed
};

/**
 * Delivery and fulfillment configuration
 */
export const FULFILLMENT = {
  /** Expected delivery time in days */
  DELIVERY_DAYS: 3,

  /** Processing time in days */
  PROCESSING_DAYS: 1,
} as const;

// ============================================================================
// Pagination and Data Loading
// ============================================================================

/**
 * Pagination defaults
 */
export const PAGINATION = {
  /** Default page size for product listings */
  DEFAULT_PAGE_SIZE: 12,

  /** Maximum items per page */
  MAX_PAGE_SIZE: 50,

  /** Default starting page */
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// Authentication and Session
// ============================================================================

/**
 * Authentication configuration
 */
export const AUTH = {
  /** JWT token cookie name */
  TOKEN_COOKIE_NAME: 'token',

  /** Session duration in seconds (1 hour) */
  SESSION_DURATION: 60 * 60,

  /** Cookie expiration for user data in days */
  USER_DATA_EXPIRY_DAYS: 3,

  /** Admin role identifier */
  ADMIN_ROLE: 'admin',
} as const;

// ============================================================================
// Storage and Caching
// ============================================================================

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  BASKET: 'basket',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Cookie names
 */
export const COOKIE_KEYS = {
  TOKEN: 'token',
  USER_EMAIL: 'user_email',
  USER_ADDRESS: 'user_address',
} as const;

// ============================================================================
// API Configuration
// ============================================================================

/**
 * API timeout configuration (in milliseconds)
 */
export const API = {
  /** Default request timeout */
  DEFAULT_TIMEOUT: 30000, // 30 seconds

  /** Upload timeout for large files */
  UPLOAD_TIMEOUT: 120000, // 2 minutes

  /** Number of retry attempts for failed requests */
  RETRY_ATTEMPTS: 3,

  /** Delay between retries in milliseconds */
  RETRY_DELAY: 1000,
} as const;

// ============================================================================
// File Upload Configuration
// ============================================================================

/**
 * File upload limits and constraints
 */
export const UPLOAD = {
  /** Maximum file size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  /** Allowed image MIME types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],

  /** Maximum number of images per product */
  MAX_IMAGES_PER_PRODUCT: 10,
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

/**
 * UI constants
 */
export const UI = {
  /** Debounce delay for search input in milliseconds */
  SEARCH_DEBOUNCE_MS: 300,

  /** Toast/notification duration in milliseconds */
  NOTIFICATION_DURATION: 3000,

  /** Animation duration for transitions in milliseconds */
  ANIMATION_DURATION: 200,
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Validation constraints
 */
export const VALIDATION = {
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,

  /** Maximum password length */
  MAX_PASSWORD_LENGTH: 128,

  /** Email regex pattern */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Product title length limits */
  PRODUCT_TITLE_MIN_LENGTH: 3,
  PRODUCT_TITLE_MAX_LENGTH: 100,

  /** Product description length limits */
  PRODUCT_DESCRIPTION_MIN_LENGTH: 10,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 2000,

  /** Minimum product price */
  MIN_PRODUCT_PRICE: 0.01,

  /** Maximum product price */
  MAX_PRODUCT_PRICE: 10000,

  /** Minimum stock quantity */
  MIN_STOCK_QUANTITY: 0,

  /** Maximum stock quantity */
  MAX_STOCK_QUANTITY: 9999,
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

/**
 * Feature flags for conditional functionality
 * These can be controlled via environment variables
 */
export const FEATURES = {
  /** Enable/disable discount codes */
  ENABLE_DISCOUNTS: process.env.NEXT_PUBLIC_ENABLE_DISCOUNTS !== 'false',

  /** Enable/disable product reviews */
  ENABLE_REVIEWS: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',

  /** Enable/disable wishlist feature */
  ENABLE_WISHLIST: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === 'true',

  /** Enable debug mode */
  DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

// ============================================================================
// URLs and Endpoints (using environment config)
// ============================================================================

/**
 * External URLs
 * Note: Most URLs should come from the env config utility
 */
export const URLS = {
  /** Support email */
  SUPPORT_EMAIL: 'support@reef-forge.uk',

  /** Company website */
  COMPANY_WEBSITE: 'https://reef-forge.uk',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-facing error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTHENTICATION: 'Authentication failed. Please log in again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  OUT_OF_STOCK: 'This item is currently out of stock.',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  SIGNUP: 'Account created successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  ORDER_PLACED: 'Order placed successfully!',
  ITEM_ADDED: 'Item added to basket!',
  ITEM_REMOVED: 'Item removed from basket!',
  PRODUCT_CREATED: 'Product created successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
} as const;

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Type-safe config access
 */
export type Config = {
  pricing: typeof PRICING;
  fulfillment: typeof FULFILLMENT;
  pagination: typeof PAGINATION;
  auth: typeof AUTH;
  api: typeof API;
  upload: typeof UPLOAD;
  ui: typeof UI;
  validation: typeof VALIDATION;
  features: typeof FEATURES;
};

/**
 * Helper to get all config
 */
export const getConfig = (): Config => ({
  pricing: PRICING,
  fulfillment: FULFILLMENT,
  pagination: PAGINATION,
  auth: AUTH,
  api: API,
  upload: UPLOAD,
  ui: UI,
  validation: VALIDATION,
  features: FEATURES,
});
