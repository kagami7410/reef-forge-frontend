import fs from 'fs';
import type { NextConfig } from 'next';


let stripeApiKey;
let stripeApiSecret;

if (fs.existsSync("vault/secrets/stripe-api-key.txt") && fs.existsSync("vault/secrets/stripe-api-secret.txt")) {
  const stripeApiKey = fs.readFileSync('vault/secrets/stripe-api-key.txt', 'utf-8').trim();
  const stripeApiSecret = fs.readFileSync('vault/secrets/stripe-api-secret.txt', 'utf-8').trim();

  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = stripeApiKey;
  process.env.STRIPE_SECRET_KEY = stripeApiSecret;
  if (stripeApiKey.includes("test")) {
    console.log("Secret Injected successfully!");
    console.log("Public Key: " + process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY )
    console.log("Secret Key: " + process.env.STRIPE_SECRET_KEY )

  }
} else {
  console.log("Secret not Injected!")
}



    console.log("Outside Test Public Key: " + process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY )
    console.log("Outside Test Secret Key: " + process.env.STRIPE_SECRET_KEY )




const nextConfig: NextConfig = {
  reactStrictMode: true,
  // You can optionally expose non-sensitive env vars here
    env: {
      // Not secure for secrets!
      NEXT_PUBLIC_STRIPE_PUBLIC_KEY: stripeApiKey,
      STRIPE_SECRET_KEY:  stripeApiSecret
    },
};

export default nextConfig;



