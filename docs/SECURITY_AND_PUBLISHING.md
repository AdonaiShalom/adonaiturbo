# Security and publishing checklist

## Secrets
- Never commit a real API key, access token, password, private key, or local `.env` file.
- Values beginning with `NEXT_PUBLIC_` are bundled into browser code and are public. Never put a private API credential there.
- Keep provider credentials in hosting-provider encrypted environment settings and ignored local environment files.
- If a credential was committed to a public repository, revoke/rotate it at the provider. Removing it in a later commit does not erase Git history or invalidate the credential.
- The OpenAI-compatible `/v1/chat/completions` endpoint now fails closed when neither `API_KEY` nor `OPENJARVIS_API_KEY` is configured.
- The Next.js app adds baseline response headers and no longer suppresses TypeScript build errors; a production build must now surface type failures rather than silently ignoring them.

## Deployment architecture and release blockers
- This repository contains a Next.js application intended for Vercel.
- The local Windows application also contains an Express backend. Publishing those files does not make its routes run on Vercel.
- Before integrating local backend routes, choose a compatible Express host or port and test each required route as a Next.js route handler.
- Audit all other public API routes (including `/api/chat` and conversation endpoints) for authentication, authorization, abuse/rate limits, and data exposure before enabling paid/provider credentials in production.
- Local-only services such as Ollama/OpenJarvis, FFmpeg, Whisper, and filesystem-backed knowledge libraries require separate production availability and configuration.

## Project separation
- Keep PSM Grupo Market source, secrets, databases, backups, and deployment configuration in its own repository.
- Publish only curated source files. Exclude dependencies, generated indexes/caches, runtime results, test recordings, and timestamped backups unless deliberately selected for a documented reason.

## Automated validation
- Pull requests and pushes to the integration branch run `npm ci` and `npm run build` through GitHub Actions.
- A successful build verifies compilation only; it does not replace endpoint authorization, abuse/rate-limit, data-isolation, or deployed smoke tests.

## Release gate
1. Review the staged diff and confirm no secrets or personal/local data are included.
2. Install dependencies and run the production build.
3. Test health, authentication, chat, conversation, and required module routes.
4. Verify the deployed site and server logs before merging the release branch into `main`.
