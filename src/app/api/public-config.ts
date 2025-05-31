import type { NextApiResponse } from 'next';

export default function handler(
  res: NextApiResponse
) {
  res.status(200).json({
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  });
}