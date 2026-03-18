A **FullEnum** variant sounds like a fantastic next step for `better-ts-enum` — it would turn your already-strong `BasicEnum` into a more batteries-included, utility-rich enum type that feels like a "supercharged native enum" without the bloat. Your builder pattern already gives great creation ergonomics; layering on runtime + type helpers like `.extend`, `.exclude`, `.map`, `.switch` / `.match`, `.with` would make it a go-to for people who want more than just static shapes.

From scanning the ecosystem (including enum-plus, dipscope/Enumeration.TS, enumify, class-enum, and common patterns in blogs/StackOverflow/TS issues), here's what people actually implement/want in "enhanced enum" libs, and how it maps to your goals of max type-safety + ergonomics.

### Most Common / Useful Helpers in Similar Libs & Patterns

1. **.extend / .with** (very popular)
   - Goal: Create a new enum by adding members to an existing one (or merging two).
   - Seen in: enum-plus (via `.extend()` static method or plugin extensibility), dipscope/Enumeration.TS (polymorphic subclassing), many manual patterns like `const Extended = { ...Base, NewKey: val } as const`.
   - Why people want it: Enums are fixed → extending avoids duplication when evolving domain models (e.g., base UserRole → AdminUserRole).
   - Type-safety challenge: Preserve literals + nominal branding if enabled.

2. **.exclude / .omit** (less common but requested)
   - Goal: New enum with some members removed (e.g., subset for a narrower context).
   - Seen in: TS issues proposing `extends` + `Omit`, manual `Pick`/`Exclude` on `keyof typeof`, better-enums-style filtering.
   - Useful for: "lite" versions, legacy compatibility, or role-based subsets.

3. **.map** (moderately common)
   - Goal: Transform values/keys → new enum (e.g., uppercase strings, add prefixes, map numbers to bitflags).
   - Seen in: Custom mappers in blogs (e.g., enum-to-string maps), enum-plus indirect via plugins, manual `Object.fromEntries`.
   - Ergonomics win: Chainable `.map(v => v * 2)` or `.mapKeys(k => `PREFIX\_${k}`)`.

4. **.switch / .match / .when** (extremely desired)
   - Goal: Exhaustive pattern matching with type narrowing + default/otherwise.
   - Seen in: Rust/FP-inspired libs, manual switch + throw on non-exhaustive, typescript-eslint rules pushing exhaustiveness.
   - Variants:
     - `.match({ Foo: () => ..., Bar: () => ..., _: () => ... })` — returns value, infers return type.
     - `.switch(value, { case Foo: ..., default: ... })` — imperative style.
   - Huge ergonomics boost: Replaces verbose switch + default-throw boilerplate.

5. **Other strong candidates from ecosystem**:
   - `.from(value)` / `.tryFrom(value)` — safe parsing (string/number → enum instance or undefined/throw). enum-plus has strong support here.
   - `.is(value)` / `.has(value)` — type guards / checks.
   - `.keys()`, `.values()`, `.entries()` — you already have generators; maybe array versions too (`$.allKeys()` frozen array).
   - `.toJSON()` / serialization helpers (useful with Zod or API layers).
   - `.labelOf()` / `.descriptionOf(key)` — for UI/display (enum-plus shines here with i18n plugins).
   - `.reduce()`, `.some()`, `.every()` — treat as iterable collection.

### Suggested Design for FullEnum

Keep `BasicEnum` as the lightweight core, then introduce `FullEnum` (or `Enum` with config `{ full: true }`) that adds these:

```ts
// Example shape (builder + static helpers)
const UserRole = FullEnum.new(
	{
		GUEST: 0,
		USER: 1,
		ADMIN: 10,
	},
	{ nominal: "UserRole" },
);

// Runtime helpers on the enum object itself
UserRole.extend({ MODERATOR: 5 }); // → new FullEnum instance
UserRole.exclude("GUEST"); // → new without GUEST
UserRole.mapValues((v) => v * 100); // scale numbers
UserRole.mapKeys((k) => k.toLowerCase());

// Pattern matching (my favorite variant for ergonomics + safety)
UserRole.match((role) => ({
	ADMIN: () => "full access",
	USER: () => "limited",
	_: () => "unknown", // or throw if no _
}));

// Or more chainable / builder-like
UserRole.with({ SUPPORT: 20 })
	.exclude("GUEST")
	.map((v) => ({ level: v, canDelete: v >= 10 }));

// Static helpers too
FullEnum.fromString(UserRole, "admin"); // case-insensitive?
FullEnum.is(UserRole, someValue);
```

**Implementation thoughts aligned with your style**:

- Return **new instances** (immutable) on `.extend`/`.exclude`/`.map` — keeps original frozen.
- Reuse your `$` namespace: `UserRole.$.extend(...)` or keep on root for native-like feel.
- For `.match`: Use a callback that receives a builder-like object with exhaustive keys + `_` optional. Infer return type union from branches.
  ```ts
  type MatchCases<T extends EnumLike, R> = {
  	[K in keyof T]?: (value: T[K]) => R;
  } & { _: (value: never) => R };
  ```
  (Adjust for nominal.)
- Preserve nominal branding across transformations (re-apply `Tagged`).
- Keep bundle tiny: most can be tiny mapped types + `Object.fromEntries` / generators.

This positions your lib as **"the modern, FP-friendly enum"** — beating enum-plus on type ergonomics (nominal, literals via arithmetic, builder) while adding the utility surface area people miss from native enums or Rust enums.

If you want, I can sketch concrete types/code for one or two (e.g. `.extend` + `.match`) that fit your `_shared.ts` / builder architecture. Or help prioritize based on your TODO list. What excites you most to tackle first? 😄
