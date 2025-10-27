# MyESIMPlus

Cloudflare Workers project for MyESIMPlus services.

## Project Structure

- `src/` - Main application code
  - `handlers/` - Request handlers
  - `utils/` - Utility functions
- `myesimplus-com/` - Cloudflare Workers template
- `wrangler.toml` - Cloudflare Workers configuration

## Development

```bash
npm install
npx wrangler dev
```

## Deployment

```bash
npx wrangler deploy
```

## License

Apache-2.0
