/**
 * Stock quantity verification utility
 * Checks if a product has sufficient stock for the requested quantity
 */

import logger from './logger';

/**
 * Verify if product has sufficient stock
 * @param itemId - The product ID to check
 * @param quantity - The requested quantity
 * @returns HTTP status code (200 if available, 400+ if not)
 */
export async function verifyQuantity(itemId: number, quantity: number): Promise<number> {
  try {
    logger.debug('Verifying stock quantity', { itemId, quantity });

    const res = await fetch('/api/checkStockQuantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, quantity }),
    });

    if (res.status === 200) {
      logger.debug('Stock available', { itemId, quantity });
    } else {
      logger.warn('Insufficient stock', { itemId, quantity, status: res.status });
    }

    return res.status;
  } catch (err) {
    logger.error('Stock verification failed', err);
    return 500;
  }
}
