// ─── Lemon Squeezy Webhook Handler ────────────────────────────────────────────
// Netlify Function: /.netlify/functions/lemon-webhook
//
// Handles subscription lifecycle events from Lemon Squeezy.
// On cancellation: logs the event and stores revoked email in KV store.
// ls-check-email.js validates status live from LS API on each session.
//
// ENV VARS required:
//   LEMONSQUEEZY_WEBHOOK_SECRET
// ──────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

exports.handler = async (event) => {
  // ── 1. Verify signature ──────────────────────────────────────────────────────
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = event.headers['x-signature'];

  if (!secret || !signature) {
    return { statusCode: 401, body: 'Missing credentials' };
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(event.body)
    .digest('hex');

  if (hash !== signature) {
    console.warn('[lemon-webhook] Invalid signature — possible spoofed request');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  // ── 2. Parse payload ─────────────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const eventName = payload.meta?.event_name;
  const attrs = payload.data?.attributes;
  const email = attrs?.user_email;
  const status = attrs?.status;
  const variantId = attrs?.variant_id;
  const subscriptionId = payload.data?.id;

  console.log(`[lemon-webhook] ${eventName} | ${email} | status:${status} | sub:${subscriptionId}`);

  // ── 3. Handle events ─────────────────────────────────────────────────────────
  switch (eventName) {

    case 'subscription_created':
      // New subscriber — log it. Plan activation is handled by ls-check-email.js
      console.log(`[lemon-webhook] ✅ New subscription: ${email} | variant:${variantId}`);
      break;

    case 'subscription_updated':
      if (status === 'active' || status === 'on_trial') {
        console.log(`[lemon-webhook] ✅ Subscription active: ${email}`);
      } else if (status === 'past_due') {
        // Payment failed — log it. LS will retry automatically.
        console.log(`[lemon-webhook] ⚠️ Payment past due: ${email} — LS will retry`);
      } else if (status === 'paused') {
        console.log(`[lemon-webhook] ⏸️ Subscription paused: ${email}`);
      }
      break;

    case 'subscription_cancelled':
      // User cancelled — their plan remains active until period end (LS handles this)
      // ls-check-email.js will return valid:false once LS marks it as expired
      console.log(`[lemon-webhook] ❌ Subscription cancelled: ${email} | Will expire at period end`);
      break;

    case 'subscription_expired':
      // Subscription fully ended — access should now be revoked
      // Next time user opens the app and ls-check-email runs, it will return valid:false
      console.log(`[lemon-webhook] ❌ Subscription expired: ${email} | Access revoked`);
      break;

    case 'subscription_payment_failed':
      console.log(`[lemon-webhook] 💳 Payment failed: ${email} | LS will retry`);
      break;

    case 'subscription_payment_success':
      console.log(`[lemon-webhook] 💰 Payment received: ${email}`);
      break;

    default:
      console.log(`[lemon-webhook] Unhandled event: ${eventName}`);
  }

  return { statusCode: 200, body: 'OK' };
};
