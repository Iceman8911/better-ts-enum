# BasicEnum – Strongly Typed, Minimal Overhead Enum Replacement

A robust, ergonomic, and type-safe alternative to native TypeScript enums. Designed for minimal bundle size (<1kb min+gzip) and maximum type inference, with runtime safety and advanced config options.

---

## What is `BasicEnum`?

A drop-in, immutable, runtime-safe enum object with:

- **Strong type inference** for both keys and values
- **Auto-incrementing numeric values** (like native enums)
- **Explicit value assignment** (number or string)
- **Computed members** with full type safety
- **Configurable nominal typing and mutability** via a config object

---

## Quick Start

### Basic Instantiation

```typescript
import { BasicEnum } from "better-ts-enum/basic-enum";

const MyEnum = BasicEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
// MyEnum.FOO === 1
// MyEnum.BAR === 2
// MyEnum.BAZ === "hello"
```

### With Config (nominal/freeze)

```typescript
// Nominal typing (values are not assignable to raw numbers/strings or other enums)
const NominalEnum = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "MyEnum" });
const NominalEnum2 = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "OtherEnum" });
// typeof NominalEnum.FOO is a unique nominal type, not just 1
// NominalEnum.FOO is NOT type-compatible with NominalEnum2.FOO

// Mutable enum (not frozen, can be reassigned at runtime)
const MutableEnum = BasicEnum.new({ FOO: 1, BAR: 2 }, { freeze: false });
MutableEnum.FOO = 42; // Allowed at runtime, but not recommended
```

---

### Customizing Default Enum Values with `valueType`

By default, `BasicEnumBuilder` assigns auto-incrementing numbers to enum members added without an explicit value (`valueType: "number"`).
You can instead use `valueType: "key"` to assign the enum key itself as the value (string).
This is useful for environments that require string-only IDs, such as extension messaging or schema validation.

```typescript
import { BasicEnumBuilder } from "better-ts-enum/basic-enum";

// Default: valueType = "number"
const NumberEnum = BasicEnumBuilder.new().$("FOO").$("BAR").$("BAZ").build();
// NumberEnum.FOO === 0, NumberEnum.BAR === 1, NumberEnum.BAZ === 2

// Use valueType: "key" for string values
const StringEnum = BasicEnumBuilder.new({ valueType: "key" }).$("FOO").$("BAR").$("BAZ").build();
// StringEnum.FOO === "FOO", StringEnum.BAR === "BAR", StringEnum.BAZ === "BAZ"

// You can still override the value explicitly:
const MixedEnum = BasicEnumBuilder.new({ valueType: "key" }).$("FOO").$("BAR", 42).$("BAZ").build();
// MixedEnum.FOO === "FOO", MixedEnum.BAR === 42, MixedEnum.BAZ === "BAZ"
```

---

## Config Options

| Option    | Type                | Default    | Description                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| freeze    | boolean             | `true`     | If `true`, the enum is deeply frozen (immutable). If `false`, it is mutable at runtime.                                                                                                                                                                                                                                          |
| nominal   | string              | `""`       | If non-empty, values are nominally typed (not assignable to raw numbers/strings). Use a unique tag per enum for strict type isolation. <br><br/><br>**Note:** Nominal typing is enforced only at the TypeScript type level and has no runtime effect. If you need to bypass nominal typing, you can use a type cast (see below). |
| valueType | `"number" \| "key"` | `"number"` | Dictates the default value for enum members added without an explicit value:<br>- `"number"`: Uses an auto-incrementing number (like native enums).<br>- `"key"`: Uses the enum key as its value (string).<br>Useful for environments that require string-only IDs or for extension messaging.                                   |

---

## Best Practices

- **Nominal Typing:** Use the enum's name as the `nominal` tag for maximum type safety and clarity.
- **Immutability:** Prefer the default (`freeze: true`) for safety. Only use `freeze: false` if you have a strong reason.
- **Explicit Config:** Always specify config explicitly if you want non-default behavior.
- **Type Inference:** Use `typeof MyEnum.$.infer.keys` and `typeof MyEnum.$.infer.values` for strongly-typed keys/values.

---

## Native Enum Wrapping

Reverse-mapping is **not** supported (for sensible iterator behavior):

```typescript
import { BasicEnum } from "better-ts-enum/basic-enum";

enum NativeEnum {
	FOO,
	BAR,
	BAZ,
}

const MyEnum = BasicEnum.new(NativeEnum);
// MyEnum.FOO === 0
// MyEnum.BAR === 1
// MyEnum.BAZ === 2
// MyEnum[0] is NOT legal (reverse-mapping removed)
```

---

## Type Inference

```typescript
type MyEnumKeys = typeof MyEnum.$.infer.keys; // "FOO" | "BAR" | "BAZ"
type MyEnumValues = typeof MyEnum.$.infer.values; // 1 | 2 | "hello"
```

---

## Iteration

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

---

## Immutability

By default, all enums are deeply frozen (`freeze: true`). Any attempt to mutate will throw.
Opt out by passing `{ freeze: false }` in the config.

---

## Enum Builder: `BasicEnumBuilder`

For ergonomic, auto-incrementing, and computed enums:

```typescript
import { BasicEnumBuilder } from "better-ts-enum/basic-enum";

const TestEnum = BasicEnumBuilder.new()
	.$("FOO") // FOO = 0
	.$("BAR") // BAR = 1
	.$("BAZ", 5) // BAZ = 5
	.$("QUX") // QUX = 6
	.$("LABEL", "hi") // LABEL = "hi"
	.build();
```

### With Config (nominal/freeze)

```typescript
// Nominal typing (values are not assignable to raw numbers/strings)
const NominalEnum = BasicEnumBuilder.new({ nominal: "MyEnum" }).$("FOO", 1).$("BAR", 2).build();

// Mutable enum (not frozen, can be reassigned at runtime)
const MutableEnum = BasicEnumBuilder.new({ freeze: false }).$("FOO", 1).$("BAR", 2).build();

MutableEnum.FOO = 42; // Allowed at runtime, but not recommended
```

### Computed Members

```typescript
import { add, multiply } from "better-ts-enum/arithmetic";

const CompEnum = BasicEnumBuilder.new()
	.$("A", 1)
	.$((e) => ["B", add(e.A, 1)])
	.$((e) => ["C", multiply(e.B, 2)])
	.build();
// CompEnum.A === 1, CompEnum.B === 2, CompEnum.C === 4
```

### Type Inference

```typescript
type CompEnumKeys = typeof CompEnum.$.infer.keys; // "A" | "B" | "C"
type CompEnumValues = typeof CompEnum.$.infer.values; // 1 | 2 | 4
```

---

## Design Rationale

- **Type Safety:** All keys and values are strongly typed and inferred.
- **Immutability:** Enums are deeply frozen by default (opt-out with `{ freeze: false }`).
- **Nominal Typing:** Enable with `{ nominal: "YourEnumName" }` for strict type safety.
- **No Prototype Pollution:** Only own, string keys are enumerated.
- **No Reverse Mapping:** Numeric reverse mapping is intentionally omitted for simplicity and bundle size.
- **Builder Pattern:** Enables auto-increment, explicit, and computed values with full type inference.

---

## Edge Cases

- **Duplicate Keys:** Throws at build time.
- **Prototype Pollution:** Only own keys are used.
- **Symbol Keys:** Ignored.

---

## Gotchas

- **TypeScript Arithmetic:** TypeScript widens arithmetic results to `number`. Use helper functions or explicit casts for computed numeric values if you want to preserve literal types.
- **No Reverse Mapping:** If you need value-to-key mapping, implement it manually.
- **Nominal Typing:** When `nominal` is set (non-empty string), enum values are not assignable to raw numbers/strings—enforced at the type level.
  **Nominal typing is purely for TypeScript type safety and has no runtime effect.** If you need to treat a nominal value as its underlying type, you can use a type cast:

  ```typescript
  // Example: bypassing nominal typing
  const value = NominalEnum.FOO as unknown as number; // or as string, depending on the underlying type
  // Or, for a custom nominal tag:
  const value = {} as { nominal: "YetAnotherNominalEnum" };
  ```

- **Mutability:** By default, enums are frozen. If you set `{ freeze: false }`, you can mutate the enum at runtime (not recommended for most use cases).

---

## Advanced: Helper Functions

For type-safe arithmetic in computed members, use helpers (see `arithmetic.ts`):

```typescript
import { add, multiply } from "better-ts-enum/arithmetic";

const Enum = BasicEnumBuilder.new()
	.$("A", 2)
	.$((e) => ["B", add(e.A, 3)])
	.$((e) => ["C", multiply(e.B, 2)])
	.build();
```

---

## API Reference

### `BasicEnum.new(enumLike: object, config?: { nominal?: string, freeze?: boolean })`

- Returns an enum object with a non-colliding `$` namespace for methods.
- `config.nominal` (default: `""`): If non-empty, values are nominally typed (not assignable to raw numbers/strings).
- `config.freeze` (default: `true`): If `false`, the enum is not frozen and can be mutated at runtime.

### `BasicEnumBuilder.new(config?: { nominal?: string, freeze?: boolean })`

- Returns a builder for ergonomic, auto-incrementing, and computed enums.
- `config.nominal` (default: `""`): If non-empty, values are nominally typed.
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
