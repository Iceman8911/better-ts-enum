# BasicEnum – Strongly Typed, Minimal Overhead Enum Replacement

This module provides a robust, ergonomic, and type-safe alternative to native TypeScript enums. It is designed for minimal bundle size (< 1kb+ after minification and gzip compression), and maximum type inference.

---

## What is `BasicEnum`?

A drop-in, immutable, runtime-safe enum object with:

- Strong type inference for both keys and values
- Auto-incrementing numeric values (like native enums)
- Explicit value assignment (number or string)
- Computed members with full type safety
- **Configurable nominal typing and mutability** via a config object

---

## Usage

### Basic Instantiation

```typescript
import { BasicEnum } from "@iceman8911/better-ts-enum/basic-enum";

const MyEnum = BasicEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
// MyEnum.FOO === 1
// MyEnum.BAR === 2
// MyEnum.BAZ === "hello"
```

#### With Config (nominal/freeze)

```typescript
// Nominal typing (values are not assignable to raw numbers/strings or other enums)
const NominalEnum = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "enum1" });
const NominalEnum2 = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "enum2" });
// typeof NominalEnum.FOO is a unique nominal type, not just 1. Same gos for NominalEnum2
// NominalEnum.FOO != NominalEnum2.FOO (typewise, not valuewise)

// Mutable enum (not frozen, can be reassigned at runtime)
const MutableEnum = BasicEnum.new({ FOO: 1, BAR: 2 }, { freeze: false });
MutableEnum.FOO = 42; // Allowed at runtime, but you really should do this without good reason
```

### Native Enum Wrapping

NOTE: Reverse-mapping is explictly not supported to keep sensible behaviour for the iterator methods

```ts
import { BasicEnum } from "@iceman8911/better-ts-enum/basic-enum";

enum NativeEnum {
	FOO,
	BAR,
	BAZ,
}

const MyEnum = BasicEnum.new(NativeEnum);
// MyEnum.FOO === 0
// MyEnum.BAR === 1
// MyEnum.BAZ === 2
// Reverse-mapping has been removed so MyEnum[0] isn't legal
```

### Type Inference

```typescript
type MyEnumKeys = typeof MyEnum.$.infer.keys; // "FOO" | "BAR" | "BAZ"
type MyEnumValues = typeof MyEnum.$.infer.values; // 1 | 2 | "hello"
```

### Iteration

```typescript
for (const key of MyEnum.$.keys()) {
	/* ... */
}
for (const value of MyEnum.$.values()) {
	/* ... */
}
for (const [key, value] of MyEnum.$.entries()) {
	/* ... */
}
for (const entry of MyEnum) {
	/* same as entries() */
}
```

### Immutability

By default, all enums are deeply frozen (`freeze: true`). Any attempt to mutate will throw.
You can opt out of freezing by passing `{ freeze: false }` in the config.

---

## Enum Builder: `BasicEnumBuilder`

For ergonomic, auto-incrementing, and computed enums:

```typescript
import { BasicEnumBuilder } from "@iceman8911/better-ts-enum/basic-enum";

const TestEnum = BasicEnumBuilder.new()
	.$("FOO") // FOO = 0
	.$("BAR") // BAR = 1
	.$("BAZ", 5) // BAZ = 5
	.$("QUX") // QUX = 6
	.$("LABEL", "hi") // LABEL = "hi"
	.build();
```

#### With Config (nominal/freeze)

```typescript
// Nominal typing (values are not assignable to raw numbers/strings)
// NominalEnum.FOO and 1 are not the same from the type system's view
const NominalEnum = BasicEnumBuilder.new({ nominal: "enum1" }).$("FOO", 1).$("BAR", 2).build();

// Mutable enum (not frozen, can be reassigned at runtime)
const MutableEnum = BasicEnumBuilder.new({ freeze: false }).$("FOO", 1).$("BAR", 2).build();

MutableEnum.FOO = 42; // Allowed at runtime, but you really should do this without good reason
```

#### Computed Members

```typescript
import { BasicEnumBuilder } from "@iceman8911/better-ts-enum/basic-enum";
import { add, multiply } from "@iceman8911/better-ts-enum/arithmetic";

const CompEnum = BasicEnumBuilder.new()
	.$("A", 1)
	.$((e) => ["B", add(e.A, 1)])
	.$((e) => ["C", multiply(e.B, 2)])
	.build();
// CompEnum.A === 1, CompEnum.B === 2, CompEnum.C === 4
```

#### Type Inference

```typescript
type CompEnumKeys = typeof CompEnum.$.infer.keys; // "A" | "B" | "C"
type CompEnumValues = typeof CompEnum.$.infer.values; // 1 | 2 | 4
```

---

## Design Rationale

- **Type Safety**: All keys and values are strongly typed and inferred.
- **Immutability**: Enums are deeply frozen by default, preventing accidental mutation. (Opt-out with `{ freeze: false }`)
- **Nominal Typing**: Optionally enable nominal typing for enum values with `{ nominal: true }` for stricter type safety.
- **No Prototype Pollution**: Only own, string keys are enumerated.
- **No Reverse Mapping**: Numeric reverse mapping is intentionally omitted for simplicity and bundle size.
- **Builder Pattern**: Enables auto-increment, explicit, and computed values with full type inference.

---

## Edge Cases

- **Duplicate Keys**: Throws at build time.
- **Prototype Pollution**: Only own keys are used.
- **Symbol Keys**: Ignored.

---

## Gotchas

- **TypeScript Arithmetic**: TypeScript widens arithmetic results to `number`. Use helper functions or explicit casts for computed numeric values if you want to preserve literal types.
- **No Reverse Mapping**: If you need value-to-key mapping, implement it manually.
- **Nominal Typing**: When `nominal: true` is set, enum values are not assignable to raw numbers/strings—this is enforced at the type level.
- **Mutability**: By default, enums are frozen. If you set `{ freeze: false }`, you can mutate the enum at runtime (not recommended for most use cases).

---

## Advanced: Helper Functions

For type-safe arithmetic in computed members, use helpers (see `arithmetic.ts`):

```typescript
import { BasicEnumBuilder } from "@iceman8911/better-ts-enum/basic-enum";
import { add, multiply } from "@iceman8911/better-ts-enum/arithmetic";

const Enum = BasicEnumBuilder.new()
	.$("A", 2)
	.$((e) => ["B", add(e.A, 3)])
	.$((e) => ["C", multiply(e.B, 2)])
	.build();
```

---

## API Reference

### `BasicEnum.new(enumLike: object, config?: { nominal?: boolean, freeze?: boolean })`

- Returns an enum object with a non-colliding `$` namespace for methods.
- `config.nominal` (default: `false`): If `true`, values are nominally typed (not assignable to raw numbers/strings).
- `config.freeze` (default: `true`): If `false`, the enum is not frozen and can be mutated at runtime.

### `BasicEnumBuilder.new(config?: { nominal?: boolean, freeze?: boolean })`

- Returns a builder for ergonomic, auto-incrementing, and computed enums.
- `config.nominal` (default: `false`): If `true`, values are nominally typed.
- `config.freeze` (default: `true`): If `false`, the built enum is not frozen.

#### Builder Methods

- `.$(key: string)`: Adds a key with auto-incremented value.
- `.$(key: string, value: number|string)`: Adds a key with explicit value.
- `.$(fn: (enumSoFar) => key | [key, value])`: Adds a computed member.
- `.build()`: Returns a strongly-typed enum, frozen by default unless `freeze: false` is set.

---

## Contributing

- Keep this README focused on the "basic" enum implementation.
- For general project info, see the root README.
- For new enum types, create a README in their respective subdirectories.

---

MIT License
