import { describe, expect, expectTypeOf, it } from "bun:test";
import { MinimalEnumBuilder } from "./minimal-enum-builder";

describe(MinimalEnumBuilder.name, () => {
	it("should build with auto-incremented numeric values by default", () => {
		const numberEnum = MinimalEnumBuilder.new()
			.$("foo")
			.$("bar")
			.$("baz")
			.build();

		expect(numberEnum.foo).toBe(0);
		expect(numberEnum.bar).toBe(1);
		expect(numberEnum.baz).toBe(2);
		expect(Object.isFrozen(numberEnum)).toBe(true);
		expect("$" in numberEnum).toBe(false);
	});

	it("should use enum keys as values when valueType: 'key'", () => {
		const keyEnum = MinimalEnumBuilder.new({ valueType: "key" })
			.$("foo")
			.$("bar")
			.build();

		expect(keyEnum.foo).toBe("foo");
		expect(keyEnum.bar).toBe("bar");
	});

	it("should allow explicit values to override valueType: 'key'", () => {
		const mixedEnum = MinimalEnumBuilder.new({ valueType: "key" })
			.$("foo")
			.$("bar", 42)
			.$("baz")
			.build();

		expect(mixedEnum.foo).toBe("foo");
		expect(mixedEnum.bar).toBe(42);
		expect(mixedEnum.baz).toBe("baz");
	});

	it("should support computed members", () => {
		const computedEnum = MinimalEnumBuilder.new()
			.$("a", 1)
			.$((e) => ["b", e.a + 1])
			.$((e) => `c-${e.b}`)
			.build();

		expect(computedEnum.a).toBe(1);
		expect(computedEnum.b).toBe(2);
		expect(computedEnum["c-2"]).toBe(3);
	});

	it("should not allow duplicate keys", () => {
		const buildDup = () =>
			MinimalEnumBuilder.new()
				.$("dup", 1)
				.$("dup", 2)
				.$((_) => ["dup", 3] as const)
				.build();

		expect(buildDup).toThrow();
		expectTypeOf<
			ReturnType<typeof buildDup>["$"]["infer"]["keys"]
		>().toEqualTypeOf<never>();
	});

	it("should infer keys and values via $.infer", () => {
		const typedEnum = MinimalEnumBuilder.new().$("foo").$("bar").build();

		expectTypeOf<typeof typedEnum.$.infer.keys>().toEqualTypeOf<
			"foo" | "bar"
		>();
		expectTypeOf<typeof typedEnum.$.infer.values>().toEqualTypeOf<0 | 1>();
	});
});
