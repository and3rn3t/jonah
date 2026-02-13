# Deploying to Cloudflare Pages

This guide walks through deploying the site to Cloudflare Pages with the custom domain `jonahanderson.us`.

## Prerequisites

1. A Cloudflare account
2. The `jonahanderson.us` domain added to Cloudflare (either registered through Cloudflare or transferred/using Cloudflare DNS)
3. Node.js 18+ installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create KV Namespace

First, log in to Wrangler:

```bash
npx wrangler login
```

Create the KV namespaces for production and preview:

```bash
# Create production KV namespace
npx wrangler kv:namespace create "SITE_KV"

# Create preview KV namespace (for development/preview deployments)
npx wrangler kv:namespace create "SITE_KV" --preview
```

Copy the namespace IDs from the output and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SITE_KV"
id = "YOUR_PRODUCTION_NAMESPACE_ID"
preview_id = "YOUR_PREVIEW_NAMESPACE_ID"
```

### 3. Create Cloudflare Pages Project

Option A: Via Dashboard

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your repository
4. Configure build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variable: (none required for basic setup)

Option B: Via CLI (first deployment)

```bash
npm run deploy
```

### 4. Configure Custom Domain

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter `jonahanderson.us`
5. Follow the prompts to verify DNS

If your domain is already on Cloudflare:

- Cloudflare will automatically add the required CNAME record

If using external DNS:

- Add a CNAME record pointing to `<project-name>.pages.dev`

### 5. Bind KV Namespace to Pages

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Settings" → "Functions"
3. Under "KV namespace bindings", click "Add binding"
4. Variable name: `SITE_KV`
5. Select your KV namespace

### 6. Deploy

```bash
npm run deploy
```

## Local Development with KV

To test with local KV storage:

```bash
# Build first
npm run build

# Run with local KV simulation
npm run pages:dev
```

## Continuous Deployment

Once connected to Git, Cloudflare Pages will automatically deploy when you push to:

- `main` branch → Production deployment
- Other branches → Preview deployments

## Environment Variables

If you need environment variables, add them in:

1. Cloudflare Dashboard → Pages → Your Project → Settings → Environment variables

## Troubleshooting

### KV not working

- Ensure the KV namespace is bound in Pages settings
- Check that the binding name is exactly `SITE_KV`

### Custom domain not working

- Verify DNS propagation: `dig jonahanderson.us`
- Ensure SSL/TLS is set to "Full" or "Full (strict)" in Cloudflare

### Build failures

- Check build logs in Cloudflare Dashboard
- Ensure all dependencies are in `package.json`

## File Structure

```
├── functions/
│   └── api/
│       └── kv/
│           └── [key].ts    # KV API endpoint
├── wrangler.toml           # Cloudflare configuration
└── dist/                   # Build output (deployed)
```
