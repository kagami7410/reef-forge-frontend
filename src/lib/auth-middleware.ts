/**
 * Authentication middleware for API routes
 * Provides utilities to verify JWT tokens and check user permissions
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from './env';
import { AUTH } from '@/config';
import type { JwtPayload } from '@/types';

/**
 * Verify JWT token from request cookies
 * Also normalizes legacy isAdmin field to role field
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const secretKey = Buffer.from(env.JWT_SECRET, 'base64');
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Normalize legacy isAdmin field to role
    if (!decoded.role && decoded.isAdmin) {
      decoded.role = decoded.isAdmin === 'true' ? AUTH.ADMIN_ROLE : 'user';
    }

    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Get token from request cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(AUTH.TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Get authenticated user from request
 * Returns user payload if token is valid, null otherwise
 */
export function getAuthenticatedUser(request: NextRequest): JwtPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(request: NextRequest): boolean {
  return getAuthenticatedUser(request) !== null;
}

/**
 * Check if user is an admin
 */
export function isAdmin(request: NextRequest): boolean {
  const user = getAuthenticatedUser(request);
  return user?.role === AUTH.ADMIN_ROLE;
}

/**
 * Require authentication middleware
 * Returns user payload or throws an error
 */
export function requireAuth(request: NextRequest): JwtPayload {
  const user = getAuthenticatedUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require admin role middleware
 * Returns user payload or throws an error
 */
export function requireAdmin(request: NextRequest): JwtPayload {
  const user = requireAuth(request);
  if (user.role !== AUTH.ADMIN_ROLE) {
    throw new Error('Admin access required');
  }
  return user;
}

/**
 * Middleware wrapper for authenticated routes
 * Usage:
 * ```
 * export async function GET(request: NextRequest) {
 *   return withAuth(request, async (user) => {
 *     // Your route logic here
 *     return successResponse({ message: 'Success' });
 *   });
 * }
 * ```
 */
export async function withAuth<T>(
  request: NextRequest,
  handler: (user: JwtPayload) => Promise<T>
): Promise<T> {
  try {
    const user = requireAuth(request);
    return await handler(user);
  } catch (error) {
    throw error;
  }
}

/**
 * Middleware wrapper for admin-only routes
 * Usage:
 * ```
 * export async function POST(request: NextRequest) {
 *   return withAdmin(request, async (user) => {
 *     // Your admin-only route logic here
 *     return successResponse({ message: 'Success' });
 *   });
 * }
 * ```
 */
export async function withAdmin<T>(
  request: NextRequest,
  handler: (user: JwtPayload) => Promise<T>
): Promise<T> {
  try {
    const user = requireAdmin(request);
    return await handler(user);
  } catch (error) {
    throw error;
  }
}

/**
 * Optional authentication wrapper
 * Passes user if authenticated, null if not
 */
export async function withOptionalAuth<T>(
  request: NextRequest,
  handler: (user: JwtPayload | null) => Promise<T>
): Promise<T> {
  const user = getAuthenticatedUser(request);
  return await handler(user);
}

/**
 * Create JWT token for user
 */
export function createToken(email: string, role: string): string {
  const secretKey = Buffer.from(env.JWT_SECRET, 'base64');
  const payload: JwtPayload = {
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + AUTH.SESSION_DURATION,
  };
  return jwt.sign(payload, secretKey);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: JwtPayload): boolean {
  if (!token.exp) return false;
  return token.exp < Math.floor(Date.now() / 1000);
}

/**
 * Get token expiration time in seconds
 */
export function getTokenExpiresIn(token: JwtPayload): number | null {
  if (!token.exp) return null;
  const expiresIn = token.exp - Math.floor(Date.now() / 1000);
  return expiresIn > 0 ? expiresIn : 0;
}
