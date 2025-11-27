# Stripe Setup Instructions

## 1. Get Stripe API Keys

1. Go to https://dashboard.stripe.com/register
2. Create an account or log in
3. Go to Developers → API keys
4. Copy your:
   - Publishable key (starts with pk_test_)
   - Secret key (starts with sk_test_)

## 2. Update Environment Variables

Edit `.env.local` and replace:
- `pk_test_your_actual_stripe_publishable_key_here` with your real publishable key
- `sk_test_your_actual_stripe_secret_key_here` with your real secret key

## 3. Restart Your Development Server

After updating the keys, restart the server:
\`\`\`bash
npm run dev
\`\`\`

## 4. Test the Build

\`\`\`bash
npm run build
\`\`\`
