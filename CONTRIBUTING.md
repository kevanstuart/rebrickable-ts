# Contributing

`rebrickable-client` is an unofficial TypeScript client for the [Rebrickable API v3](https://rebrickable.com/api/v3/docs/). This guide covers setup, how the code is put together, and the standards changes are reviewed against.

## Setup

| Node | Needed for |
|---|---|
| 24 (`.nvmrc`) | Development |
| 22.18+ | `yarn fixtures`, which runs a `.ts` file directly and loads `.env` |
| 18+ | The published library |

Copy `.env.example` to `.env` and add your Rebrickable API key (from your account settings, under API) to run the live tests and capture fixtures.

When to run what (all scripts are in `package.json`):

- **`yarn verify`**: typecheck, Biome and all tests. A change is ready when this is green. With a key in `.env`, it includes the live tests.
- **`yarn fixtures`**: re-captures real API responses into `src/__tests__/fixtures/`. Run it when adding an endpoint or checking whether the API has changed.
- **`yarn build`**: produces ESM, CommonJS and type definitions in `dist/`.

## Architecture

```
Rebrickable  (src/rebrickable.ts)   creates ONE HttpClient and passes it to every resource
  → resources (src/resources/*.ts)  typed methods mapped to endpoint paths
  → HttpClient (src/http/client.ts) auth, URLs, rate limiting, 429 retries, errors, pagination
  → fetch                           global, or injected via ClientOptions.fetch
```

Every resource shares the one client, so a `Rebrickable` instance has one rate-limit budget (Rebrickable allows about one request per second). Endpoint paths live in `src/endpoints.ts`, and `src/models/` holds types only.

## Code standards

Biome and `tsconfig.json` enforce formatting and type strictness. These are the rules they can't check.

### Adding a resource

Copy `src/resources/colors.ts` as the template, then:

1. Confirm the path is in `src/endpoints.ts`.
2. Write the model and input types in `src/models/<Name>/index.ts` from the captured fixtures, and export them from `src/models/index.ts`.
3. Write the resource class in `src/resources/<name>.ts`.
4. Add it to `Rebrickable` in `src/rebrickable.ts`, and export its type from `src/index.ts`.
5. Add tests (see [Testing](#testing)).

### Resource methods

- **Name methods `list`, `listAll` and `get`** for a paged list, every page, and a single item. Sub-resources take a descriptive name (`sets.parts`, `parts.colorSets`).
- **Give `listAll` to top-level lists only.** It defaults `page_size` to 1000 and its input type omits `page` (`AllPagesInput<T>`). Sub-lists rarely exceed one page.
- **Give single-item methods no `ordering`**: ordering one item has no effect.
- **Make methods `async`**, so invalid input such as an empty ID reaches the caller as a rejected promise.
- **Hold the client in `readonly #http`.** Use `#private` fields for anything secret or stateful, so it can't leak through `console.log` or be changed from outside.

### Models

- **Write models from captured fixtures**, not from the docs: the OpenAPI spec has no response schemas.
- **Use singular names** for models (`SetPart`, `PartColor`), and `<Thing>Input` for method inputs (`ListPartsInput`).
- **Use interfaces for object shapes**, including every input type. Use a type alias only where TypeScript requires one (`Omit`/`Pick`, unions, intersections) or to give an existing type a deliberate second name (`MinifigSet = Minifig`).
- **Model the two part shapes.** Lists and inventories return the basic `Part`; requests with `inc_part_details: true` return `PartDetails`. Type the method with a `WithDetails<T>` overload so the result matches the request (see `sets.parts`).
- **Mark image URLs `string | null`.**

### IDs

- **Type numeric database IDs as `number`** (`id`, `theme_id`, `color_id`, `part_cat_id`), in models, filters and method parameters alike.
- **Type catalogue codes as `string`** (`set_num`, `part_num`, `element_id`), even when they look numeric, as element IDs do.
- **Add every numeric-ID query filter to `NUMERIC_ID_PARAMS`** in `src/http/client.ts`. Rebrickable silently ignores a bad value for some filters (`in_theme_id`, `color_id`) and returns the whole catalogue; the client rejects such values before sending.

### Query parameters

- **Booleans are flags**: the client sends `true` as `1` and leaves `false` out.
- **Lists are arrays**, sent comma-joined, with an empty list left out (`part_nums`). No numeric-ID filter accepts a list.

### Dependencies and runtime

- **Keep the published package free of runtime dependencies.**
- **Use only APIs available in Node 18 in `src/`** (for example, a `for await` loop rather than `Array.fromAsync`). Development tooling may use newer Node.

## Testing

- **Unit tests** use `createFakeFetch` (`src/__tests__/fake-fetch.ts`) with captured fixtures as responses. When a fixture is page 1 of many, serve its results through `page()` for `listAll` tests, or the iterator will follow the real `next` link.
- **Model checks** in `src/__tests__/models.spec.ts` assert `fixture.body satisfies Model` for every fixture, so `yarn typecheck` fails when a model claims a field the API doesn't send. This only works in one direction, so **also add a unit test that reads any detail-only field** (as `elements.spec.ts` reads `part.year_from`).
- **Type tests** use `// @ts-expect-error` to prove invalid input fails to compile, such as `page` on `listAll` or a string ID.
- **Live tests all go in `src/__tests__/live.spec.ts`**, one `describe` per resource. They share one client and one rate limit; separate files would run in parallel and risk 429 responses.

## Workflow

- **Branch per change** from an up-to-date `main` (`feature/<name>`, `chore/<name>`, `docs/<name>`), merged through a pull request.
- **Commit messages** use a lowercase, past-tense Conventional Commits summary, followed by one-sentence bullets:

  ```
  feat(themes): added themes resource

  - Added a ThemesResource with list, listAll and get methods.
  - Added unit tests for themes using the captured fixtures.
  ```
