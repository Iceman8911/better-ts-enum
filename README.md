# better-ts-enum

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
bun add better-ts-enum
```

**npm**

```bash
npm install better-ts-enum
```

**pnpm**

```bash
pnpm add better-ts-enum
```

**yarn**

```bash
yarn add better-ts-enum
```

---

## Serialization

Enum instances are serializable out of the box with `JSON.stringify`. The result is always a deep copy of the plain object that was used to instantiate the enum (with reverse-mapping removed for native TypeScript enums). This makes it easy to persist, transmit, or compare enum instances.

**Example:**

```typescript
const MyEnum = BasicEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
console.log(JSON.stringify(MyEnum)); // '{"FOO":1,"BAR":2,"BAZ":"hello"}'
```

- The output of `JSON.stringify(enumInstance)` is always identical to `JSON.stringify(inputObject)` (aside from reverse-mapping removal for native enums).

---

## Common Use Cases

### Schema Validation with `$.raw`

When integrating with validation libraries (like [valibot](https://valibot.dev/), Zod, or similar), you often need a plain object representation of your enum for use in schema definitions. The `$.raw` property provides a shallow copy of the original enum shape, stripped of any reverse-mapping (for native enums) and methods.

**Example: Using with valibot**

```typescript
import { BasicEnum } from "better-ts-enum/basic-enum";
import { object, string, enum, parse } from "valibot";

const StatusEnum = BasicEnum.new({ ACTIVE: "active", INACTIVE: "inactive" });

// Use $.raw for schema validation
const schema = object({
  status: enum(StatusEnum.$.raw),
});

parse(schema, ({ status: "active" })); // ✅
parse(schema, { status: "inactive" })); // ✅
parse(schema, { status: "other" })); // ❌ Throws validation error
```

**Why use `$.raw`?**

Validation libraries and similar will likely flag an error if you use the instance directly, so this should help.

---

### Usage Examples

#### ESM (Node/modern bundlers)

```typescript
import { BasicEnum, BasicEnumBuilder } from "better-ts-enum/basic-enum";
```

#### CommonJS (require)

```js
const { BasicEnum, BasicEnumBuilder } = require("better-ts-enum/basic-enum");
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
	} from "https://cdn.jsdelivr.net/npm/better-ts-enum/dist/min/basic-enum.js";
</script>
```

**jsDelivr (specific version, e.g. 1.2.3):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://cdn.jsdelivr.net/npm/better-ts-enum@1.2.3/dist/min/basic-enum.js";
</script>
```

**unpkg (latest):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://unpkg.com/better-ts-enum@latest/dist/min/basic-enum.js";
</script>
```

**unpkg (specific version, e.g. 1.2.3):**

```html
<script type="module">
	import {
		BasicEnum,
		BasicEnumBuilder,
	} from "https://unpkg.com/better-ts-enum@1.2.3/dist/min/basic-enum.js";
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

## API Reference

### `$.raw` – Accessing the Raw Enum Shape

**Serialization:**
Enum instances are serializable by `JSON.stringify` out of the box. The result is always a deep copy of the original input object (with reverse-mapping removed for native enums). This means `JSON.stringify(enumInstance)` is equivalent to `JSON.stringify(inputObject)`.

The `$.raw` property returns a shallow copy of the enum's original shape, suitable for use in validation libraries, or any context where a plain object is required.

- **For object-literal enums:** Returns a shallow copy of the original object.
- **For native TypeScript enums:** Returns a copy with reverse-mapping removed (numeric enums lose their value-to-key mapping).
- **Methods and internal properties are excluded.**

**Example:**

```typescript
const MyEnum = BasicEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
console.log(MyEnum.$.raw); // { FOO: 1, BAR: 2, BAZ: "hello" }
```

**Native Enum Example:**

```typescript
enum NativeEnum {
	FOO,
	BAR,
	BAZ,
}
const Wrapped = BasicEnum.new(NativeEnum);
console.log(Wrapped.$.raw); // { FOO: 0, BAR: 1, BAZ: 2 }
console.log(Wrapped.$.raw[0]); // undefined (reverse-mapping removed)
```

**Use Cases:**

- Schema validation (valibot, Zod, etc.)
- Interop with libraries expecting plain objects

**Caveats:**

- For native numeric enums, reverse-mapping is intentionally stripped for safety and predictability.
- The returned object is a shallow copy; mutating it does not affect the enum instance.
- TypeScript type inference is preserved: `typeof MyEnum.$.raw` matches your enum's shape.

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
