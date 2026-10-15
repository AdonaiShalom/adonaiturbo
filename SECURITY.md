# Security Policy

## Scope

This repository contains multiple Adonai components. Keep each component's code, credentials, data, deployment configuration, and operational permissions separated. Adonai Trade must not be merged with PSM Grupo Market.

## Reporting a vulnerability

Do not post secrets, personal data, exploit payloads, production logs, or detailed attack instructions in public issues. Use a private reporting channel with the repository maintainer. GitHub private vulnerability reporting may be used if it is enabled for this repository.

## Required safeguards

- Never commit live API keys, passwords, access tokens, service-role keys, private keys, certificates, or production connection strings.
- Treat any credential ever committed to a public repository as compromised: revoke it at its issuing service, issue a replacement, update authorized deployment environments, and test the replacement.
- Rewriting Git history does not revoke a credential. Coordinate history cleanup separately and verify no consumers depend on the affected commits.
- Keep environment files private. The committed .env.example must contain placeholders only.
- Keep runtime state, trading records, audit logs, private keys, backups, and proprietary knowledge out of public commits unless explicitly reviewed and approved.
- Do not expose server-side secrets through NEXT_PUBLIC_* variables or browser bundles.
- Protect conversation and trading-data endpoints with appropriate authentication, authorization, and row-level access controls.
- Review staged changes and test builds before publishing. Ignore rules do not protect files already tracked.
- Document integrations as unverified until the relevant connection, authentication, and read/write behavior has been tested.

## Audit status

This policy is a set of safeguards, not a security certification. Individual components still require code review, dependency review, access-control tests, and deployment configuration checks.
