import { describe, expect, expectTypeOf, it } from "bun:test";
import { MinimalEnum } from "./minimal-enum";

type TestEnumArg = typeof testEnumArg;
type TestEnumKeys = keyof TestEnumArg;
type TestEnumValues = TestEnumArg[TestEnumKeys];

const testEnumArg = {
	bar: "two",
	baz: 3,
	foo: 1,
} as const;

const testEnum = MinimalEnum.new(testEnumArg);

describe(MinimalEnum.name, () => {
	it("should behave like a plain object at runtime", () => {
		expect(testEnumArg).toEqual(testEnum);
		expect("$" in testEnum).toBe(false);
		expect(Symbol.iterator in testEnum).toBe(false);
		expect(Object.keys(testEnum)).toEqual(["bar", "baz", "foo"]);
	});

	it("should be frozen by default", () => {
		expect(Object.isFrozen(testEnum)).toBe(true);
	});

	it("should allow unfrozen enums when freeze: false", () => {
		const unfrozen = MinimalEnum.new({ foo: 1 }, { freeze: false });
		unfrozen.foo = 1;
		expect(Object.isFrozen(unfrozen)).toBe(false);
		expect(unfrozen.foo).toBe(1);
	});

	it("should strip reverse mapping from numeric enums", () => {
		enum NativeEnum {
			FOO,
			BAR,
			BAZ,
		}

		const convertedEnum = MinimalEnum.new(NativeEnum);

		expect(Object.keys(convertedEnum)).toEqual(["FOO", "BAR", "BAZ"]);
		expect(Object.values(convertedEnum)).toEqual([
			NativeEnum.FOO,
			NativeEnum.BAR,
			NativeEnum.BAZ,
		]);
	});

	it("should infer keys and values via $.infer", () => {
		expectTypeOf<TestEnumKeys>().toEqualTypeOf<typeof testEnum.$.infer.keys>();
		expectTypeOf<TestEnumValues>().toEqualTypeOf<
			typeof testEnum.$.infer.values
		>();
	});
});
