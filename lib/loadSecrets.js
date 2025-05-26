// lib/secrets.js
const fs = require('fs');

let loaded = false;

function loadSecrets() {
  if (loaded) return;
  if (fs.existsSync("vault/secrets/stripe-api-key.txt")){

 const stripeApiKey = fs.readFileSync('vault/secrets/stripe-api-key.txt', 'utf-8').trim();
 const stripeApiSecret = fs.readFileSync('vault/secrets/stripe-api-secret.txt', 'utf-8').trim();

  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = stripeApiKey;
  process.env.STRIPE_SECRET_KEY = stripeApiSecret;
  }
  loaded = true;

}

module.exports = { loadSecrets };
