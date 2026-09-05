# Stripe Setup Guide

This boilerplate uses Stripe Checkout and Webhooks to manage subscriptions securely. The frontend never touches payment details, and Django acts as the sole source of truth for entitlements.

## 1. Create a Stripe Account
If you don't have one, sign up at [Stripe](https://stripe.com).

## 2. Get API Keys
1. Go to the Stripe Dashboard -> **Developers** -> **API keys**.
2. Copy the **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`).
3. Paste these into your `.env` file:
   ```env
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

## 3. Create Products and Prices
This boilerplate supports two tiers by default: Basic and Pro.
1. Go to **Products** -> **Add Product**.
2. Name it "Basic Plan" and set a recurring monthly price (e.g., $9/month).
3. Copy the generated Price ID (starts with `price_...`).
4. Repeat for the "Pro Plan" (e.g., $29/month).
5. Update your `.env` file:
   ```env
   STRIPE_PRICE_BASIC=price_...
   STRIPE_PRICE_PRO=price_...
   ```

## 4. Setup Webhooks
Webhooks tell your Django backend when a user pays, cancels, or fails a payment.
1. Go to **Developers** -> **Webhooks** -> **Add endpoint**.
2. Endpoint URL: `https://yourdomain.com/billing/webhook/` (For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli)).
3. Listen to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (`whsec_...`) and add it to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 5. Local Testing (Stripe CLI)
To test webhooks locally:
```bash
stripe listen --forward-to localhost:8000/billing/webhook/
```
Stripe CLI will output a webhook secret (`whsec_...`). Use this in your local `.env` file.
