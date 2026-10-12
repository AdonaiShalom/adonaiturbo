# Security and publishing checklist

## Secrets
- Never commit a real API key, access token, password, private key, or local `.env` file.
- Values beginning with `NEXT_PUBLIC_` are public browser bundle values. Never place a private API credential there.
- Keep provider credentials in the hosting platform's encrypted environment settings and in ignored local environment files.
- If a credential was committed to a public repository, remove it from tracked files and rotate/revoke it at the provider. A later commit does not erase earlier Git history or invalidate the credential.

## Deployment architecture
- The current repository contains a Next.js application intended for Vercel.
- The local Windows application also contains an Express backend. Do not assume that copying its files into this repository makes Express routes run on Vercel.
- Before integrating local backend routes, choose and document a deployment target compatible with Express, or port and test each required route as a Next.js route handler.
- Local-only services such as Ollama/OpenJarvis, FFmpeg, Whisper, and filesystem-backed knowledge libraries require separate production availability and configuration; they do not become available merely by publishing source code.

## Project separation
- Keep PSM Grupo Market source, secrets, databases, backups, and deployment configuration in its own repository.
- Publish only curated source files. Exclude dependencies, generated indexes/caches, runtime results, test recordings, and timestamped backups unless deliberately selected for a documented reason.

## Release gate
1. Review the staged diff and confirm that no secrets or personal/local data are included.
2. Install dependencies and run the production build.
3. Test health, authentication, chat, conversation, and required module routes.
4. Verify the deployed site and server logs before merging the release branch into `main`.
