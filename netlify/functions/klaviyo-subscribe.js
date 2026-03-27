exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let email, trade;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
    trade = body.trade || "unknown";
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  if (!email || !email.includes("@")) {
    return { statusCode: 400, body: "Invalid email" };
  }

  const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
  const LIST_ID = "Tyja6E";

  try {
    const response = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        "revision": "2023-12-15"
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email: email,
                    properties: {
                      trade: trade,
                      source: "bonus_messages",
                      bonus_claimed: true
                    }
                  }
                }
              ]
            },
            historical_import: false
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: LIST_ID
              }
            }
          }
        }
      })
    });

    if (response.ok || response.status === 202) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      const err = await response.text();
      console.error("Klaviyo error:", err);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: err })
      };
    }
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };
  }
};
