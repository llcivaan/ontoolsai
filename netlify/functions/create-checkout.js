exports.handler = async (event) => {
  const { plan, email } = JSON.parse(event.body);

  const variantMap = {
    pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
    business: process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID,
  };

  const variantId = variantMap[plan];
  if (!variantId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid plan' }) };
  }

  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { email },
          product_options: {
            redirect_url: 'https://ontoolsai.com/welcome',
          },
        },
        relationships: {
          store: {
            data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID },
          },
          variant: {
            data: { type: 'variants', id: variantId },
          },
        },
      },
    }),
  });

  const data = await response.json();
  const checkoutUrl = data?.data?.attributes?.url;

  if (!checkoutUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Checkout creation failed', data }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ url: checkoutUrl }),
  };
};
