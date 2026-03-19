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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "API key not configured",
        content: [{ text: "ERROR: ANTHROPIC_API_KEY environment variable is not set in Netlify." }]
      }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-6",
        max_tokens: body.max_tokens || 1000,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    // If Anthropic returned an error, surface it clearly
    if (!response.ok || data.type === "error") {
      return {
        statusCode: response.status,
        headers: { ...cors, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          content: [{ text: `API ERROR ${response.status}: ${JSON.stringify(data.error || data)}` }]
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: err.message,
        content: [{ text: `FUNCTION ERROR: ${err.message}` }]
      }),
    };
  }
};
