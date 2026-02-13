const Stripe = require('stripe');

let stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.warn("⚠️  WARNING: STRIPE_SECRET_KEY is missing in environment variables. Stripe functionality will fail.");
  // Use a dummy key to prevent crash during development/startup
  stripeKey = 'sk_test_placeholder';
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
});

module.exports = stripe;
