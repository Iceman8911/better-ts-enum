# better-ts-enum

A scalable, type-safe, and ergonomic TypeScript enum replacement library.

---

## Overview

This project provides a set of composable, zero-runtime-surprise enum utilities for TypeScript. It is designed for minimal bundle size, strong type inference, and extensibility as new enum types are added.

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

## Enum Types

This package provides multiple enum implementations, each optimized for different use cases:

### [BasicEnum](src/enum-class/basic/README.md)

A feature-rich enum with auto-increment, computed members, prefix/suffix generation, and nominal typing. Choose this when you need configurability and advanced features.

**Quick example:**

```typescript
import { BasicEnum, BasicEnumBuilder } from "better-ts-enum/basic-enum";

const Status = BasicEnum.new({ ACTIVE: "active", INACTIVE: "inactive" });
// or
const Priority = BasicEnumBuilder.new({ valueType: "key" })
	.$("LOW")
	.$("MEDIUM")
	.$("HIGH")
	.build();
```

See [BasicEnum documentation](src/enum-class/basic/README.md) for full API, config options, and examples.

### [MinimalEnum](src/enum-class/minimal/README.md)

A lightweight alternative with a minimal API surface. Choose this when you want simplicity and a smaller bundle footprint.

**Quick example:**

```typescript
import { MinimalEnum, MinimalEnumBuilder } from "better-ts-enum/minimal-enum";

const Status = MinimalEnum.new({ ACTIVE: "active", INACTIVE: "inactive" });
// or
const Priority = MinimalEnumBuilder.new()
	.$("LOW")
	.$("MEDIUM")
	.$("HIGH")
	.build();
```

See [MinimalEnum documentation](src/enum-class/minimal/README.md) for full API and examples.

---

## Features

All enum types include:

- **Strong type inference** – Keys and values are precisely typed
- **Immutability** – Enums are frozen by default (opt-out available)
- **Nominal typing** – Optional distinct types per enum for type safety
- **JSON serialization** – Enums stringify as plain objects
- **Auto-increment** – Like native enums, when desired

---

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## License

MIT

---
