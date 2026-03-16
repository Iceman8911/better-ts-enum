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

```bash
bun add @iceman8911/better-ts-enum
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
