import { describe, expect, expectTypeOf, it } from "bun:test";
import BasicEnumBuilder from "./basic-enum-builder";
import { add, multiply } from "../../arithmetic";

describe(BasicEnumBuilder.name, () => {
	it("should properly create a complex enum with all properties strongly typed", () => {
		const testEnum = BasicEnumBuilder.new()
			.$("foo")
			.$("bar")
			.$("baz", 5)
			.$("foobar")
			.$((enumSoFar) => `foobar${multiply(enumSoFar.baz, enumSoFar.foobar)}`)
			.$("foobaz")
			.$("barfoo", "foobar")
			.$((enumSoFar) => [
				"barbaz",
				`${enumSoFar.barfoo}${multiply(enumSoFar.foobar30, enumSoFar.foobaz)}`,
			])
			.$("bazfoo")
			.$("bazbar")
			.build();

		expect(testEnum.foo).toBe(0);
		expect(testEnum.bar).toBe(1);
		expect(testEnum.baz).toBe(5);
		expect(testEnum.foobar).toBe(6);
		expect(testEnum.foobar30).toBe(7);
		expect(testEnum.foobaz).toBe(8);
		expect(testEnum.barfoo).toBe("foobar");
		expect(testEnum.barbaz).toBe("foobar56");
		expect(testEnum.bazfoo).toBe(0);
		expect(testEnum.bazbar).toBe(1);
	});

	it("should build an empty enum", () => {
		const emptyEnum = BasicEnumBuilder.new().build();
		expect(Object.keys(emptyEnum)).toEqual([]);
		expect(Object.values(emptyEnum)).toEqual([]);
		expect(Object.entries(emptyEnum)).toEqual([]);
		expect(Object.isFrozen(emptyEnum)).toBe(true);
	});

	it("should build a single-entry enum (auto and explicit value)", () => {
		const autoEnum = BasicEnumBuilder.new().$("foo").build();
		const explicitEnum = BasicEnumBuilder.new().$("bar", 42).build();
		expect(autoEnum.foo).toBe(0);
		expect(Object.keys(autoEnum)).toEqual(["foo"]);
		expect(Object.isFrozen(autoEnum)).toBe(true);
		expect(explicitEnum.bar).toBe(42);
		expect(Object.keys(explicitEnum)).toEqual(["bar"]);
		expect(Object.isFrozen(explicitEnum)).toBe(true);
	});

	it("should not allow duplicate keys", () => {
		const getDupEnum = () =>
			BasicEnumBuilder.new()
				.$("dup", 1)
				.$("dup", 2)
				.$((_) => ["dup", 3] as const)
				.build();

		expect(getDupEnum).toThrow();
		expectTypeOf<ReturnType<typeof getDupEnum>["$"]["infer"]["keys"]>().toEqualTypeOf<never>();
	});

	it("should allow complex computed keys/values", () => {
		const compEnum = BasicEnumBuilder.new()
			.$("a", 1)
			.$((e) => ["b", add(e.a, 1)])
			.$((e) => ["c", multiply(e.b, 2)])
			.$((e) => [`d-${e.a}`, `${e.c}-done`])
			.build();
		expect(compEnum.a).toBe(1);
		expect(compEnum.b).toBe(2);
		expect(compEnum.c).toBe(4);
		expect(compEnum["d-1"]).toBe("4-done");
		expect(Object.isFrozen(compEnum)).toBe(true);
	});

	it("should infer nominal typing when `nominal: true` is set", () => {
		const nominalEnum1 = BasicEnumBuilder.new({ nominal: "nominal1" })
			.$("FOO", 1)
			.$("BAR", 2)
			.build();
		const nominalEnum2 = BasicEnumBuilder.new({ nominal: "nominal2" })
			.$("FOO", 1)
			.$("BAR", 2)
			.build();

		expectTypeOf<typeof nominalEnum1.BAR>().toExtend<2>();
		expectTypeOf<2>().not.toExtend<typeof nominalEnum1.BAR>();
		//@ts-expect-error For Testing
		expect(nominalEnum1.BAR).toBe(2);

		expectTypeOf<typeof nominalEnum1.FOO>().toExtend<1>;
		expectTypeOf<1>().not.toExtend<typeof nominalEnum1.FOO>;
		//@ts-expect-error For Testing
		expect(nominalEnum1.FOO).toBe(1);

		expectTypeOf<typeof nominalEnum1.BAR>().not.toEqualTypeOf<typeof nominalEnum2.BAR>();
	});

	it("should infer non-nominal typing when `nominal: false` (default)", () => {
		const regularEnum = BasicEnumBuilder.new().$("FOO", 1).$("BAR", 2).build();

		type Values = typeof regularEnum.$.infer.values;
		const ok1: Values = 1;
		const ok2: Values = 2;
		expect(ok1).toBe(1);
		expect(ok2).toBe(2);
	});

	it("should be readonly at type-level and frozen at runtime when freeze: true (default)", () => {
		const frozenEnum = BasicEnumBuilder.new().$("FOO", 1).$("BAR", 2).build();

		expect(() => {
			//@ts-expect-error For testing
			frozenEnum.BAR = 32;
			//@ts-expect-error For testing
			frozenEnum.FOO = "ds";
		}).toThrow();

		expect(Object.isFrozen(frozenEnum)).toBe(true);
	});

	it("should NOT be readonly at type-level and NOT frozen at runtime when freeze: false", () => {
		const unfrozenEnum = BasicEnumBuilder.new({ freeze: false }).$("FOO", 1).$("BAR", 2).build();

		unfrozenEnum.FOO = 1;
		expect(Object.isFrozen(unfrozenEnum)).toBe(false);
	});
});
