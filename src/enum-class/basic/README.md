# BasicEnum – Strongly Typed, Minimal Overhead Enum Replacement

This module provides a robust, ergonomic, and type-safe alternative to native TypeScript enums. It is designed for minimal bundle size (< 1kb+ after minification and gzip compression), and maximum type inference.

---

## What is `BasicEnum`?

A drop-in, immutable, runtime-safe enum object with:

- Strong type inference for both keys and values
- Auto-incrementing numeric values (like native enums)
- Explicit value assignment (number or string)
- Computed members with full type safety

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

All enums are deeply frozen. Any attempt to mutate will throw.

---

## Enum Builder: `BasicEnumBuilder`

For ergonomic, auto-incrementing, and computed enums:

```typescript
import { BasicEnumBuilder } from "@iceman8911/better-ts-enum/basic-enum";

const TestEnum = new BasicEnumBuilder()
	.$("FOO") // FOO = 0
	.$("BAR") // BAR = 1
	.$("BAZ", 5) // BAZ = 5
	.$("QUX") // QUX = 6
	.$("LABEL", "hi") // LABEL = "hi"
	.build();
```

#### Computed Members

```typescript
const CompEnum = new BasicEnumBuilder()
	.$("A", 1)
	.$((e) => ["B", e.A + 1])
	.$((e) => ["C", e.B * 2])
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
- **Immutability**: Enums are deeply frozen, preventing accidental mutation.
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

---

## Advanced: Helper Functions

For type-safe arithmetic in computed members, use helpers (see `arithmetic.ts`):

```typescript
import { add, multiply } from "@iceman8911/better-ts-enum/arithmetic";

const Enum = new BasicEnumBuilder()
	.$("A", 2)
	.$((e) => ["B", add(e.A, 3)])
	.$((e) => ["C", multiply(e.B, 2)])
	.build();
```

---

## API Reference

### `BasicEnum.new(enumLike: object)`

- Returns a deeply frozen enum object with a non-colliding `$` namespace for methods.

### `BasicEnumBuilder`

- `.$(key: string)`: Adds a key with auto-incremented value.
- `.$(key: string, value: number|string)`: Adds a key with explicit value.
- `.$(fn: (enumSoFar) => key | [key, value])`: Adds a computed member.
- `.build()`: Returns a frozen, strongly-typed enum.

---

## Contributing

- Keep this README focused on the "basic" enum implementation.
- For general project info, see the root README.
- For new enum types, create a README in their respective subdirectories.

---

MIT License
