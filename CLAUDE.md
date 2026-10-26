# rebrickable-client

An unofficial, zero-dependency TypeScript client for the Rebrickable API v3.

**Read `CONTRIBUTING.md` before changing or reviewing code.** It holds the code standards, the checklist for adding a resource, and the testing rules.

## Every task

- **Done means `yarn verify` is green.**
- **Run live tests and `yarn fixtures` one at a time.** They call the real API, which allows about one request per second and may ban IPs that ignore 429 responses.
- **Keep the API key in `.env` only**, out of output, logs, fixtures and commits.

## Workflow

1. **Plan first.** Research, then present the plan and wait for the user to accept it before editing code.
2. **Branch** from an up-to-date `main` before the first edit.
3. **Hand back a commit message** in the `CONTRIBUTING.md` format when the work is ready. The user commits, opens the pull request and merges.
