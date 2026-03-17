# @iceman8911/better-ts-enum

A scalable, type-safe, and ergonomic TypeScript enum replacement library.

---

## Overview

This project provides a set of composable, zero-runtime-surprise enum utilities for TypeScript. It is designed for minimal bundle size, strong type inference, and extensibility as new enum types are added.

---

## Table of Contents

- [Installation](#installation)
- [Enum Modules](#enum-modules)
  - [BasicEnum (strongly-typed, minimal overhead)](src/enum-class/basic/README.md)
  - [More enum types coming soon...]
- [Contributing](#contributing)
- [License](#license)

---

## Installation

Install with your favorite package manager:

**bun**

```bash
bun add @iceman8911/better-ts-enum
```

**npm**

```bash
npm install @iceman8911/better-ts-enum
```

**pnpm**

```bash
pnpm add @iceman8911/better-ts-enum
```

**yarn**

```bash
yarn add @iceman8911/better-ts-enum
```

---

### Usage Examples

#### ESM (Node/modern bundlers)

```typescript
import { BasicEnum, BasicEnumBuilder } from "@iceman8911/better-ts-enum/basic-enum";
```

#### CommonJS (require)

```js
const { BasicEnum, BasicEnumBuilder } = require("@iceman8911/better-ts-enum/basic-enum");
```

#### Browser (ESM via CDN)

You can use the browser bundle directly from a CDN.
**Filenames:** `dist/min/basic-enum.js`, `dist/min/arithmetic.js`

**jsDelivr (latest):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://cdn.jsdelivr.net/npm/@iceman8911/better-ts-enum/dist/min/basic-enum.js";
</script>
```

**jsDelivr (specific version, e.g. 1.2.3):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://cdn.jsdelivr.net/npm/@iceman8911/better-ts-enum@1.2.3/dist/min/basic-enum.js";
</script>
```

**unpkg (latest):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://unpkg.com/@iceman8911/better-ts-enum@latest/dist/min/basic-enum.js";
</script>
```

**unpkg (specific version, e.g. 1.2.3):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://unpkg.com/@iceman8911/better-ts-enum@1.2.3/dist/min/basic-enum.js";
</script>
```

---

## Enum Modules

This package is organized for extensibility. Each enum implementation has its own focused documentation.

### [BasicEnum – Strongly Typed, Minimal Overhead Enum Replacement](src/enum-class/basic/README.md)

- Immutable, runtime-safe, and ergonomic alternative to native TypeScript enums.
- Auto-incrementing, explicit, and computed members with full type inference.
- See [src/enum-class/basic/README.md](src/enum-class/basic/README.md) for detailed usage, rationale, and API.

---

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## License

MIT

---

## Comparison: better-ts-enum vs Alternatives

| Feature / Pattern                     | Native TS Enum | `as const` Object | Union Type |                   **better-ts-enum**                    |
| ------------------------------------- | :------------: | :---------------: | :--------: | :-----------------------------------------------------: |
| **Type Inference**                    |      Good      |     Excellent     | Excellent  |                        Excellent                        |
| **Runtime Cost**                      |   IIFE bloat   |   Plain Object    |    None    | Class Instance (optionally frozen with `Object.freeze`) |
| **`--erasableSyntaxOnly` compatible** |       ❌       |        ✅         |     ✅     |                           ✅                            |
| **Auto-increment**                    |       ✅       |        ❌         |     ❌     |                           ✅                            |
| **Explicit/Computed Values**          |    Partial     |    ✅ (manual)    |     ❌     |                 ✅ (ergonomic builder)                  |
| **Nominal Typing**                    |    Partial     |        ❌         |     ❌     |                    ✅ (configurable)                    |
| **Reverse Mapping**                   |  ✅ (numeric)  |        ❌         |     ❌     |                     ❌ (by design)                      |
| **Iteration**                         |    Awkward     |      Manual       |   Manual   |               Ergonomic (`$.keys()`, etc)               |
| **Immutability**                      |    Partial     |  ✅ (`as const`)  |    N/A     |                  ✅ (default, opt-out)                  |
| **Type Narrowing**                    |      Good      |     Excellent     | Excellent  |                        Excellent                        |

---
