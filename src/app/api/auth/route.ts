import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-middleware';
import { successResponse, unauthorizedResponse, handleApiError } from '@/lib/api-response';
import logger from '@/lib/logger';

/**
 * GET /api/auth - Check if user is authenticated
 * Returns user information if authenticated, 401 if not
 */
export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);

    if (!user) {
      logger.debug('Auth check: No valid token');
      return unauthorizedResponse('Not authenticated');
    }

    logger.debug('Auth check: User authenticated', { email: user.email, role: user.role });

    return successResponse({
      authenticated: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    logger.error('Auth check error', err);
    return handleApiError(err);
  }
}