import fs from 'fs';
import type { NextConfig } from 'next';

if(fs.existsSync("vault/secrets/stripe-api-key.txt") && fs.existsSync("vault/secrets/stripe-api-secret.txt")){
const stripeApiKey = fs.readFileSync('vault/secrets/stripe-api-key.txt', 'utf-8').trim();
const stripeApiSecret = fs.readFileSync('vault/secrets/stripe-api-secret.txt', 'utf-8').trim();

process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = stripeApiKey;
process.env.STRIPE_SECRET_KEY = stripeApiSecret;
}



const nextConfig: NextConfig = {
  reactStrictMode: true,
  // You can optionally expose non-sensitive env vars here
//   env: {
//     // Not secure for secrets!
//     PUBLIC_SOME_KEY: 'example',
//   },
};

export default nextConfig;



