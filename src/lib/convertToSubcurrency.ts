/**
 * Convert currency to subcurrency units
 * Used for Stripe payment processing (converts pounds to pence)
 */

import { PRICING } from '@/config';

/**
 * Convert amount to subcurrency (e.g., pounds to pence)
 * @param amount - The amount in main currency units (e.g., pounds)
 * @param factor - The conversion factor (default: 100 for pence)
 * @returns Amount in subcurrency units (e.g., pence)
 *
 * @example
 * convertToSubcurrency(10.99) // Returns 1099 (pence)
 */
function convertToSubcurrency(amount: number, factor: number = PRICING.CURRENCY_FACTOR): number {
  return Math.round(amount * factor);
}

export default convertToSubcurrency;
