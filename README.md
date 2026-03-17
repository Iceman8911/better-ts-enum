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

#### Browser (IIFE via CDN)

You can use the browser bundle directly from a CDN.
**Filename:** `dist/basic-enum.global.js`

**jsDelivr (latest):**

```html
<script src="https://cdn.jsdelivr.net/npm/@iceman8911/better-ts-enum/dist/basic-enum.global.js"></script>
```

**jsDelivr (specific version, e.g. 1.2.3):**

```html
<script src="https://cdn.jsdelivr.net/npm/@iceman8911/better-ts-enum@1.2.3/dist/basic-enum.global.js"></script>
```

**unpkg (latest):**

```html
<script src="https://unpkg.com/@iceman8911/better-ts-enum/dist/basic-enum.global.js"></script>
```

**unpkg (specific version, e.g. 1.2.3):**

```html
<script src="https://unpkg.com/@iceman8911/better-ts-enum@1.2.3/dist/basic-enum.global.js"></script>
```

**Usage:**

```html
<script src="https://cdn.jsdelivr.net/npm/@iceman8911/better-ts-enum/dist/basic-enum.global.js"></script>
<script>
	// Global variable: window.BetterTsEnum.BasicEnum, window.BetterTsEnum.BasicEnumBuilder
	const MyEnum = window.BetterTsEnum.BasicEnum.new({ FOO: 1, BAR: 2 });
	console.log(MyEnum.FOO); // 1
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
