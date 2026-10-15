# Security Policy — Adonai Trade

## Scope

This policy applies to the Adonai Trade module under \`adonai-trade/\`. Adonai Trade must remain separate from Adonai Turbo's other modules and from PSM Grupo Market.

## Reporting a vulnerability

Please do not publish credentials, exploit details, trading records, or sensitive logs in a public issue. Use the repository owner's private contact channel or GitHub's private vulnerability reporting feature if it is enabled for this repository.

## Publication and release safeguards

Before adding or releasing code:

- Never commit \`.env\`, live tokens, passwords, service-role keys, private keys, certificates, or production connection strings.
- Keep \`data/\`, trading orders, decisions, audit records, and logs out of version control.
- Keep \`knowledge/\` private by default. Review intellectual-property rights and every file before considering public distribution.
- Commit only a sanitized \`.env.example\` containing placeholders, never working credentials.
- Review diffs and scan staged files before every push; a \`.gitignore\` does not remove files already tracked.
- Do not expose Supabase service-role credentials to browser code or public clients.
- Verify authentication, authorization, input validation, rate limits, and audit logging for every sensitive endpoint.
- Test integrations separately; do not claim writes or production readiness until they have been verified.

## Current status

These guardrails are preventive documentation, not a completed security audit. They do not certify the application as secure.
