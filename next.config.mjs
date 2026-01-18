import fs from 'fs';

let stripeApiKey;
let stripeApiSecret;

if (fs.existsSync("vault/secrets/stripe-api-key.txt") && fs.existsSync("vault/secrets/stripe-api-secret.txt")) {
  stripeApiKey = fs.readFileSync('vault/secrets/stripe-api-key.txt', 'utf-8').trim();
  stripeApiSecret = fs.readFileSync('vault/secrets/stripe-api-secret.txt', 'utf-8').trim();

  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = stripeApiKey;
  process.env.STRIPE_SECRET_KEY = stripeApiSecret;
  if (stripeApiKey.includes("test")) {
    // console.log("Secret Injected successfully!");
    // console.log("Public Key: " + process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY )
    // console.log("Secret Key: " + process.env.STRIPE_SECRET_KEY )
  }
} else {
  console.log("Secret not Injected!")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // You can optionally expose non-sensitive env vars here
  env: {
    // Not secure for secrets!
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: stripeApiKey,
    STRIPE_SECRET_KEY: stripeApiSecret
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
