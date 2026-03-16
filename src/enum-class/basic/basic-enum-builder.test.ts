import { describe, expect, expectTypeOf, it } from "bun:test";
import BasicEnumBuilder from "./basic-enum-builder";
import { add, multiply } from "../../arithmetic";

describe(BasicEnumBuilder.name, () => {
	it("should properly create a complex enum with all properties strongly typed", () => {
		const testEnum = new BasicEnumBuilder()
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
		const emptyEnum = new BasicEnumBuilder().build();
		expect(Object.keys(emptyEnum)).toEqual([]);
		expect(Object.values(emptyEnum)).toEqual([]);
		expect(Object.entries(emptyEnum)).toEqual([]);
		expect(Object.isFrozen(emptyEnum)).toBe(true);
	});

	it("should build a single-entry enum (auto and explicit value)", () => {
		const autoEnum = new BasicEnumBuilder().$("foo").build();
		const explicitEnum = new BasicEnumBuilder().$("bar", 42).build();
		expect(autoEnum.foo).toBe(0);
		expect(Object.keys(autoEnum)).toEqual(["foo"]);
		expect(Object.isFrozen(autoEnum)).toBe(true);
		expect(explicitEnum.bar).toBe(42);
		expect(Object.keys(explicitEnum)).toEqual(["bar"]);
		expect(Object.isFrozen(explicitEnum)).toBe(true);
	});

	it("should not allow duplicate keys", () => {
		const getDupEnum = () =>
			new BasicEnumBuilder()
				.$("dup", 1)
				.$("dup", 2)
				.$((_) => ["dup", 3] as const)
				.build();

		expect(getDupEnum).toThrow();
		expectTypeOf<ReturnType<typeof getDupEnum>["$"]["infer"]["keys"]>().toEqualTypeOf<never>();
	});

	it("should allow complex computed keys/values", () => {
		const compEnum = new BasicEnumBuilder()
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
});
