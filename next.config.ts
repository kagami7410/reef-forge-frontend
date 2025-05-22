import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'dummy-key';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'dummy-key';


export default nextConfig;
