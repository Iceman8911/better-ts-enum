# MinimalEnum – Lightweight, Type-Safe Enum Alternative

A streamlined enum replacement with minimal API surface, designed for maximum type inference and minimal bundle impact. Perfect when you need safe enums without any additional features.

---

## What is `MinimalEnum`?

An immutable, runtime-safe enum object with:

- **Strong type inference** for both keys and values
- **Auto-incrementing numeric values** (like native enums)
- **Explicit value assignment** (number or string)
- **Configurable nominal typing and mutability** via a config object
- **Zero configuration required** — works out-of-the-box with sensible defaults

---

## Quick Start

### Basic Instantiation

```typescript
import { MinimalEnum } from "better-ts-enum/minimal-enum";

const MyEnum = MinimalEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
// MyEnum.FOO === 1
// MyEnum.BAR === 2
// MyEnum.BAZ === "hello"
```

### With Config (nominal/freeze)

```typescript
// Nominal typing (values are not assignable to raw numbers/strings or other enums)
const NominalEnum = MinimalEnum.new({ FOO: 1, BAR: 2 }, { nominal: "MyEnum" });
const NominalEnum2 = MinimalEnum.new({ FOO: 1, BAR: 2 }, { nominal: "OtherEnum" });
// typeof NominalEnum.FOO is a unique nominal type, not just 1
// NominalEnum.FOO is NOT type-compatible with NominalEnum2.FOO

// Mutable enum (not frozen, can be reassigned at runtime)
const MutableEnum = MinimalEnum.new({ FOO: 1, BAR: 2 }, { freeze: false });
MutableEnum.FOO = 42; // Allowed at runtime, but not recommended
```

---

## Using MinimalEnumBuilder

The `MinimalEnumBuilder` provides a fluent, chainable API for constructing enums with auto-incrementing values and strong type safety.

### Basic Builder Usage

```typescript
import { MinimalEnumBuilder } from "better-ts-enum/minimal-enum";

const MyEnum = MinimalEnumBuilder.new()
	.$("FOO")
	.$("BAR")
	.$("BAZ")
	.build();

// MyEnum.FOO === 0, MyEnum.BAR === 1, MyEnum.BAZ === 2
```

### Builder with Explicit Values

```typescript
const MixedEnum = MinimalEnumBuilder.new()
	.$("FOO", 10)
	.$("BAR")     // Auto-increments from 10 → 11
	.$("BAZ", 99)
	.build();

// MixedEnum.FOO === 10, MixedEnum.BAR === 11, MixedEnum.BAZ === 99
```

### Builder with Config

```typescript
// Using valueType: "key" to assign keys as string values
const StringEnum = MinimalEnumBuilder.new({ valueType: "key" })
	.$("FOO")
	.$("BAR")
	.$("BAZ")
	.build();

// StringEnum.FOO === "FOO", StringEnum.BAR === "BAR", StringEnum.BAZ === "BAZ"

// Nominal typing for type safety
const NominalEnum = MinimalEnumBuilder.new({ nominal: "Status" })
	.$("ACTIVE")
	.$("INACTIVE")
	.$("PENDING")
	.build();

// typeof NominalEnum.ACTIVE is nominally distinct from plain 0
```

---

## Config Options

| Option    | Type                | Default    | Description                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| freeze    | boolean             | `true`     | If `true`, the enum is deeply frozen (immutable). If `false`, it is mutable at runtime.                                                                                                                                                                                                                          |
| nominal   | string              | `""`       | If non-empty, values are nominally typed (not assignable to raw numbers/strings). Use a unique tag per enum for strict type isolation. <br><br/><br>**Note:** Nominal typing is enforced only at the TypeScript type level and has no runtime effect. If you need to bypass nominal typing, you can use a type cast. |
| valueType | `"number" \| "key"` | `"number"` | Dictates the default value for enum members added without an explicit value:<br>- `"number"`: Uses an auto-incrementing number (like native enums).<br>- `"key"`: Uses the enum key as its value (string).<br>Useful for environments that require string-only IDs or for extension messaging.                           |

---

## Type Inference

Both `MinimalEnum` and `MinimalEnumBuilder` provide strong type inference through the `$.infer` namespace:

```typescript
const MyEnum = MinimalEnumBuilder.new()
	.$("FOO")
	.$("BAR")
	.build();

// Extract the key type
type Keys = typeof MyEnum.$.infer.keys;  // "FOO" | "BAR"

// Extract the value type
type Values = typeof MyEnum.$.infer.values;  // 0 | 1
```

---

## Serialization

Enum instances are serializable out of the box with `JSON.stringify`. The result is always a deep copy of the plain object that was used to instantiate the enum (with reverse-mapping removed for native TypeScript enums).

```typescript
const MyEnum = MinimalEnum.new({ FOO: 1, BAR: 2, BAZ: "hello" });
console.log(JSON.stringify(MyEnum)); // '{"FOO":1,"BAR":2,"BAZ":"hello"}'
```

---

## Best Practices

- **Nominal Typing:** Use the enum's name as the `nominal` tag for maximum type safety and clarity. 
- **Type Inference:** Use `typeof MyEnum.$.infer.keys` and `typeof MyEnum.$.infer.values` for strongly-typed keys/values.

---

## Native Enum Wrapping

Reverse-mapping is **not** supported (for sensible iterator behavior):

```typescript
import { MinimalEnum } from "better-ts-enum/minimal-enum";

enum NativeEnum {
	FOO,
	BAR,
	BAZ,
}

const MyEnum = MinimalEnum.new(NativeEnum);
// MyEnum.FOO === 0
// MyEnum.BAR === 1
// MyEnum.BAZ === 2
// MyEnum[0] is NOT legal (reverse-mapping removed)
```

---

## Differences from BasicEnum

`MinimalEnum` intentionally has a narrower feature set than `BasicEnum`:
 
- ✗ No `.$.raw` property (the enum is already plain)
- ✓ Simpler API surface for a smaller bundle footprint
- ✓ Same core features: auto-increment, nominal typing, freeze configuration, strong type inference
 
---

## See Also

- [BasicEnum](../basic/README.md) — A bit more enum features
- [Root README](../../README.md) — Project overview and other enum types
