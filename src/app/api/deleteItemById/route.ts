import { NextRequest } from 'next/server';
import { getBackendUrl } from '@/lib/env';
import { successResponse, errorResponse, handleApiError, notFoundResponse, forbiddenResponse } from '@/lib/api-response';
import { withAdmin } from '@/lib/auth-middleware';
import { productIdSchema } from '@/lib/validation';
import { SUCCESS_MESSAGES } from '@/config';
import logger from '@/lib/logger';

export async function DELETE(req: NextRequest) {
  try {
    // Require admin authentication
    return await withAdmin(req, async (user) => {
      // Extract and validate query parameters
      const { searchParams } = new URL(req.url);
      const itemIdParam = searchParams.get('itemId');

      if (!itemIdParam) {
        return errorResponse('Item ID is required', 400);
      }

      // Validate item ID
      const validation = productIdSchema.safeParse(itemIdParam);
      if (!validation.success) {
        return errorResponse('Invalid item ID format', 400);
      }

      const itemId = validation.data;
      logger.info(`Admin ${user.email} deleting item ${itemId}`);

      // Call backend to delete item
      const res = await fetch(
        getBackendUrl(`/backend/fragRacks/deleteById?itemId=${itemId}`),
        { method: "DELETE" }
      );

      if (res.status === 404) {
        logger.warn(`Item ${itemId} not found for deletion`);
        return notFoundResponse('Product');
      }

      if (res.status === 403) {
        logger.error(`Backend forbid deletion of item ${itemId}`);
        return forbiddenResponse('Cannot delete this product');
      }

      if (!res.ok) {
        logger.error(`Backend deletion failed for item ${itemId}`, { status: res.status });
        return errorResponse('Failed to delete product', 500);
      }

      const data = await res.json();
      logger.info(`Successfully deleted item ${itemId}`, data);

      return successResponse(data, SUCCESS_MESSAGES.PRODUCT_DELETED);
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      logger.warn('Unauthorized delete attempt');
      return forbiddenResponse('Admin access required');
    }
    if (error instanceof Error && error.message === 'Authentication required') {
      logger.warn('Unauthenticated delete attempt');
      return errorResponse('Authentication required', 401);
    }
    logger.error('Delete item error', error);
    return handleApiError(error);
  }
}