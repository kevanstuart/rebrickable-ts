# Changelog

All notable changes to this package are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [0.1.0] - Unreleased

First release.

### Added

- `Rebrickable` client covering the public LEGO catalogue: `sets`, `minifigs`, `parts`, `colors`, `themes`, `partCategories` and `elements`.
- `list` for one page and `listAll` for async iteration over every page, using the maximum page size of 1000.
- Typed part details: `inc_part_details: true` returns `PartDetails`.
- Rate limiting to about one request per second, shared across every resource of a client, with automatic retries on `429` responses.
- `RebrickableError` with the HTTP status and Rebrickable's error detail.
- Local rejection of invalid input before any request: empty IDs, `page_size` outside 1–1000, and numeric ID filters that aren't whole numbers.
- Request cancelling with `AbortSignal`, and a custom `fetch` option.
- ESM, CommonJS and type definitions, with no runtime dependencies. Supports Node.js 18 and later.
