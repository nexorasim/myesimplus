# Deployment Instructions

## Setup

1. Install dependencies:
```bash
cd myesimplus-com
npm install
```

2. Set Cloudflare secrets in GitHub:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

## Local Development

```bash
cd myesimplus-com
npm run dev
```

## Deploy

Push to main branch for automatic deployment.

## Manual Deploy

```bash
cd myesimplus-com
npm run deploy
```