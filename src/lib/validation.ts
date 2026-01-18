/**
 * API validation utilities using Zod
 * Provides type-safe validation schemas for all API inputs
 */

import { z } from 'zod';
import { VALIDATION } from '@/config';

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(255, 'Email is too long');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, 'Password is too long');

/**
 * Login credentials schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Registration schema
 */
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().optional(),
}).refine(
  (data) => !data.confirmPassword || data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

// ============================================================================
// Product Schemas
// ============================================================================

/**
 * Product ID schema
 */
export const productIdSchema = z.coerce
  .number()
  .int('Product ID must be an integer')
  .positive('Product ID must be positive');

/**
 * Product creation schema
 */
export const createProductSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.PRODUCT_TITLE_MIN_LENGTH, 'Title is too short')
    .max(VALIDATION.PRODUCT_TITLE_MAX_LENGTH, 'Title is too long'),
  description: z
    .string()
    .min(VALIDATION.PRODUCT_DESCRIPTION_MIN_LENGTH, 'Description is too short')
    .max(VALIDATION.PRODUCT_DESCRIPTION_MAX_LENGTH, 'Description is too long'),
  price: z.coerce
    .number()
    .min(VALIDATION.MIN_PRODUCT_PRICE, 'Price must be greater than 0')
    .max(VALIDATION.MAX_PRODUCT_PRICE, 'Price is too high'),
  code: z.string().min(1, 'Product code is required').max(50, 'Code is too long'),
  colour: z.string().min(1, 'Colour is required').max(50, 'Colour is too long'),
  stockQuantity: z.coerce
    .number()
    .int('Stock quantity must be an integer')
    .min(VALIDATION.MIN_STOCK_QUANTITY, 'Stock quantity cannot be negative')
    .max(VALIDATION.MAX_STOCK_QUANTITY, 'Stock quantity is too high'),
  photoUrls: z.array(z.string().url('Invalid photo URL')).min(1, 'At least one photo is required'),
});

/**
 * Product update schema (all fields optional except ID)
 */
export const updateProductSchema = createProductSchema.partial().extend({
  id: productIdSchema,
});

// ============================================================================
// Order Schemas
// ============================================================================

/**
 * Basket item schema
 */
export const basketItemSchema = z.object({
  id: productIdSchema,
  title: z.string().min(1),
  price: z.number().positive(),
  code: z.string().min(1),
  quantity: z.number().int().positive('Quantity must be positive'),
  photoUrls: z.array(z.string().url()),
});

/**
 * Address schema
 */
export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(2, 'Country is required').max(2, 'Country code must be 2 characters'),
});

/**
 * Order submission schema
 */
export const orderSubmissionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  userEmail: emailSchema,
  userAddress: addressSchema,
  basketItems: z.array(basketItemSchema).min(1, 'Order must contain at least one item'),
  totalPrice: z.number().positive('Total price must be positive'),
  shippingPrice: z.number().nonnegative('Shipping price cannot be negative'),
  discountCode: z.string().optional(),
  discountMultiplier: z.number().min(0).max(1).optional(),
});

// ============================================================================
// Payment Schemas
// ============================================================================

/**
 * Payment intent creation schema
 */
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  basketItems: z.array(basketItemSchema).min(1, 'Basket must contain items'),
  orderId: z.string().min(1, 'Order ID is required'),
});

/**
 * Stock check schema
 */
export const stockCheckSchema = z.object({
  itemId: productIdSchema,
  quantity: z.number().int().positive('Quantity must be positive'),
});

// ============================================================================
// Pagination Schemas
// ============================================================================

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  pageNumber: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(12),
});

// ============================================================================
// File Upload Schemas
// ============================================================================

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().positive().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});

// ============================================================================
// Discount Code Schema
// ============================================================================

/**
 * Discount code schema
 */
export const discountCodeSchema = z.string().min(1).max(50).toUpperCase();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate data against a schema
 * Returns validated data or throws an error with details
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validate data against a schema
 * Returns { success: true, data } or { success: false, errors }
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into a more user-friendly format
  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return { success: false, errors };
}

/**
 * Validate query parameters from URL
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): T {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return validate(schema, params);
}

/**
 * Validate request body
 */
export async function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<T> {
  const body = await request.json();
  return validate(schema, body);
}

/**
 * Safely validate request body
 */
export async function safeValidateRequestBody<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string> }> {
  try {
    const body = await request.json();
    return safeValidate(schema, body);
  } catch {
    return {
      success: false,
      errors: { _error: 'Invalid JSON in request body' },
    };
  }
}

// ============================================================================
// Type Exports
// ============================================================================

// Export inferred types from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type OrderSubmissionInput = z.infer<typeof orderSubmissionSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type StockCheckInput = z.infer<typeof stockCheckSchema>;
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
