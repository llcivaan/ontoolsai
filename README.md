# OnToolsAI

**You stay on the tools. We'll run the words.**

OnToolsAI is an AI-powered communication tool built specifically for trade businesses — cleaning, HVAC, plumbing, landscaping, roofing, and electrical. It helps trade business owners write professional customer messages, review responses, invoice reminders, and social media posts in seconds.

## What's in this repo

| File | Purpose |
|------|---------|
| `index.html` | Main app entry point |
| `app.js` | Compiled React application |
| `netlify.toml` | Netlify build & function config |
| `netlify/functions/generate.js` | Serverless function — Anthropic AI proxy |
| `website-index.html` | Marketing / landing page |

## Live site

🌐 [ontoolsai.com](https://ontoolsai.com)

## Deploying

This repo is connected to Netlify for continuous deployment. Every push to `main` triggers an automatic deploy.

To update the app:

```bash
# Edit files in this repo, then:
git add .
git commit -m "Your update description"
git push
```

Netlify will pick up the push and deploy automatically — usually live within 30 seconds.

## Environment variables

The `ANTHROPIC_API_KEY` must be set in Netlify's environment variables (Site configuration → Environment variables). It is never stored in this repo.

---

*Built with Claude AI · OnToolsAI © 2026*
