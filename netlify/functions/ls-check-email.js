// ─── Lemon Squeezy Subscription Checker ───────────────────────────────────────
// Netlify Function: /.netlify/functions/ls-check-email
//
// Called when a user returns to the app after payment.
// Looks up their subscription status by email via LS API.
// Returns: { valid: bool, plan: 'pro'|'business', email: string }
//
// ENV VARS required (already set in Netlify):
//   LEMONSQUEEZY_API_KEY
//   LEMONSQUEEZY_PRO_VARIANT_ID
//   LEMONSQUEEZY_BUSINESS_VARIANT_ID
// ──────────────────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  // ── 1. Parse email from request ──────────────────────────────────────────────
  let email;
  try {
    ({ email } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Invalid request" }),
    };
  }

  if (!email || !email.includes("@")) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Valid email required" }),
    };
  }

  // ── 2. Look up subscriptions by email via LS API ─────────────────────────────
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Server misconfiguration" }),
    };
  }

  let subscriptions;
  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(email)}`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/vnd.api+json",
        },
      }
    );
    const data = await res.json();
    subscriptions = data?.data || [];
  } catch (err) {
    console.error("[ls-check-email] API error:", err.message);
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Could not check subscription. Try again." }),
    };
  }

  // ── 3. Find an active subscription ──────────────────────────────────────────
  const PRO_VARIANT = String(process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "");
  const BIZ_VARIANT = String(process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID || "");

  const active = subscriptions.find(sub => {
    const status = sub.attributes?.status;
    return status === "active" || status === "on_trial";
  });

  if (!active) {
    console.log(`[ls-check-email] No active subscription for ${email}`);
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "No active subscription found for this email." }),
    };
  }

  // ── 4. Map variant → plan ────────────────────────────────────────────────────
  const variantId = String(active.attributes?.variant_id || "");
  let plan = "pro"; // default to pro if we can't match

  if (BIZ_VARIANT && variantId === BIZ_VARIANT) {
    plan = "business";
  } else if (PRO_VARIANT && variantId === PRO_VARIANT) {
    plan = "pro";
  }

  console.log(`[ls-check-email] ✅ Active | plan:${plan} | email:${email}`);

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ valid: true, plan, email }),
  };
};
