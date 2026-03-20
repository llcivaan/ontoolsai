// ─── Lemon Squeezy License Verifier ───────────────────────────────────────────
// Netlify Function: /.netlify/functions/ls-verify
//
// Called by the app when a user enters their license key after purchase.
// Returns: { valid: bool, plan: 'pro'|'business', email: string, error?: string }
//
// ENV VARS (already set in Netlify):
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

  // ── 1. Parse request ─────────────────────────────────────────────────────────
  let key;
  try {
    ({ key } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Invalid request" }),
    };
  }

  if (!key || typeof key !== "string" || key.trim().length < 10) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "That doesn't look like a valid license key." }),
    };
  }

  // ── 2. Validate with Lemon Squeezy ───────────────────────────────────────────
  let lsData;
  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        license_key: key.trim(),
        instance_name: "OnToolsAI",
      }),
    });
    lsData = await res.json();
  } catch (err) {
    console.error("[ls-verify] LS API error:", err.message);
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Couldn't reach the verification server. Check your connection and try again." }),
    };
  }

  // ── 3. Check validity ────────────────────────────────────────────────────────
  if (!lsData.valid) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "License key not recognised. Check your email from Lemon Squeezy and try again." }),
    };
  }

  // ── 4. Map variant → plan ────────────────────────────────────────────────────
  const variantId = String(lsData.meta?.variant_id || "");
  const PRO_VARIANT = String(process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "");
  const BIZ_VARIANT = String(process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID || "");

  let plan = "pro"; // default to pro if we can't match (better than locking them out)
  if (BIZ_VARIANT && variantId === BIZ_VARIANT) {
    plan = "business";
  } else if (PRO_VARIANT && variantId === PRO_VARIANT) {
    plan = "pro";
  }

  const email = lsData.meta?.customer_email || "";

  console.log(`[ls-verify] ✅ Valid | plan:${plan} | email:${email} | variant:${variantId}`);

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ valid: true, plan, email }),
  };
};
