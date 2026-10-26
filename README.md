# rebrickable-client

A typed, zero-dependency TypeScript client for the [Rebrickable API v3](https://rebrickable.com/api/v3/docs/): LEGO sets, parts, minifigs, colors, themes and elements.

> **Unofficial.** This package is not affiliated with or endorsed by Rebrickable.

- Fully typed requests and responses, with models checked against real API responses
- Built-in rate limiting and automatic retries on `429 Too Many Requests`
- Async iteration over every page of a list
- No runtime dependencies; ships ESM, CommonJS and type definitions

## Install

```sh
npm install rebrickable-client
```

Requires Node.js 18 or later, or any runtime with a global `fetch`. You'll need a free Rebrickable API key, from your account settings under API.

## Quick start

```ts
import { Rebrickable } from 'rebrickable-client';

const rebrickable = new Rebrickable({ apiKey: 'your-api-key' });

const set = await rebrickable.sets.get('75034-1');
console.log(set.name, set.num_parts); // Death Star Troopers 100
```

## Resources

| Resource | Methods |
|---|---|
| `sets` | `list`, `listAll`, `get`, `alternates`, `minifigs`, `parts`, `subsets` |
| `minifigs` | `list`, `listAll`, `get`, `parts`, `sets` |
| `parts` | `list`, `listAll`, `get`, `colors`, `color`, `colorSets` |
| `colors` | `list`, `listAll`, `get` |
| `themes` | `list`, `listAll`, `get` |
| `partCategories` | `list`, `listAll`, `get` |
| `elements` | `get` |

Filters use the API's own parameter names, so the [Rebrickable docs](https://rebrickable.com/api/v3/docs/) apply directly:

```ts
const starWars = await rebrickable.sets.list({ theme_id: 158, min_year: 2020, ordering: '-year' });
const bricks = await rebrickable.parts.list({ part_nums: ['3001', '3002'] });
```

## Pagination

`list` returns one page, with the API's default of 100 results. `listAll` iterates over every result, fetching pages as needed with the maximum page size of 1000:

```ts
for await (const theme of rebrickable.themes.listAll()) {
  console.log(theme.id, theme.name);
}

// Node 22+: collect everything into an array
const colors = await Array.fromAsync(rebrickable.colors.listAll());
```

Pages are only fetched as you iterate, so `break` stops further requests.

## Part details

Lists and inventories return a basic `Part`. Pass `inc_part_details: true` to get the full `PartDetails` (years, prints, molds, alternates), and the result is typed to match:

```ts
const { results } = await rebrickable.sets.parts('75034-1', { inc_part_details: true });
console.log(results[0]?.part.year_from);
```

## Errors

A failed request throws a `RebrickableError` with the HTTP status and Rebrickable's error detail:

```ts
import { RebrickableError } from 'rebrickable-client';

try {
  await rebrickable.sets.get('111-111');
} catch (error) {
  if (error instanceof RebrickableError && error.status === 404) {
    console.log('No such set:', error.detail);
  }
}
```

Invalid input is rejected before any request is sent: an empty ID, a `page_size` outside 1–1000, or a numeric ID filter that isn't a whole number.

## Rate limiting

Rebrickable allows about one request per second. Each client spaces its requests to match, and retries throttled requests after the delay Rebrickable asks for. Create **one** client and share it, so every request draws on the same budget:

```ts
const client = new Rebrickable({
  apiKey: 'your-api-key',
  minRequestInterval: 1000, // milliseconds between requests (default)
  maxRetries: 3, // retries after a 429 response (default)
});
```

## Cancelling requests

Every method accepts an `AbortSignal`, which also cancels a request still waiting for its turn:

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

const minifig = await rebrickable.minifigs.get('fig-010697', { signal: controller.signal });
```

## Custom fetch

Pass your own `fetch` to add logging, route through a proxy, or stub responses in tests:

```ts
const loggingFetch: typeof fetch = async (input, init) => {
  console.log('GET', String(input));
  return fetch(input, init);
};

const logged = new Rebrickable({ apiKey: 'your-api-key', fetch: loggingFetch });
```

## Types

Every model and input type is exported, for example `LegoSet`, `Part`, `PartDetails`, `Minifig` and `ListSetsInput`:

```ts
import type { LegoSet } from 'rebrickable-client';

const describe = (set: LegoSet) => `${set.name} (${set.year})`;
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
