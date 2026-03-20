const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { sub, q, limit = '25' } = event.queryStringParameters || {};

  if (!sub || !q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required params: sub, q' }),
    };
  }

  const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(q)}&sort=new&t=day&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OnToolsAI/1.0 (lead monitor; contact: llcivaan@gmail.com)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Reddit API error: ${response.status}` }),
      };
    }

    const data = await response.json();
    const now = Math.floor(Date.now() / 1000);
    const cutoff48h = now - (48 * 60 * 60);

    const posts = (data?.data?.children || [])
      .map(child => child.data)
      .filter(post => post.created_utc >= cutoff48h)
      .map(post => ({
        id: post.id,
        title: post.title,
        selftext: post.selftext,
        url: `https://www.reddit.com${post.permalink}`,
        author: post.author,
        created_utc: post.created_utc,
        age_hours: Math.round((now - post.created_utc) / 3600),
        num_comments: post.num_comments,
        subreddit: post.subreddit,
        score: post.score,
      }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ subreddit: sub, query: q, count: posts.length, posts }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
