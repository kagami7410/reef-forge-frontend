/**
 * Standardized API response utilities
 * Provides consistent response formatting across all API routes
 */

import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  data?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  errors: Record<string, string> | string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: typeof errors === 'string' ? errors : 'Validation failed',
      data: typeof errors === 'object' ? { validationErrors: errors } : undefined,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized access'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(
  message: string = 'Access forbidden'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}

/**
 * Create a not found response
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

/**
 * Handle errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  // Handle different error types
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred';

    return errorResponse(message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Create a response with cookie
 */
export function responseWithCookie<T>(
  response: NextResponse<ApiResponse<T>>,
  cookieName: string,
  cookieValue: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
  } = {}
): NextResponse<ApiResponse<T>> {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    ...options,
  };

  response.cookies.set(cookieName, cookieValue, defaultOptions);
  return response;
}

/**
 * Create a success response with cookie
 */
export function successResponseWithCookie<T>(
  data: T,
  cookieName: string,
  cookieValue: string,
  message?: string,
  cookieOptions?: Parameters<typeof responseWithCookie>[3]
): NextResponse<ApiResponse<T>> {
  const response = successResponse(data, message);
  return responseWithCookie(response, cookieName, cookieValue, cookieOptions);
}
