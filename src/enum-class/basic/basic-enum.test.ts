import { describe, expect, expectTypeOf, it } from "bun:test";
import BasicEnum from "./basic-enum";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";

type TestEnumArg = typeof testEnumArg;
type TestEnumArgKeys = keyof TestEnumArg;
type TestEnumArgValues = TestEnumArg[TestEnumArgKeys];

const testEnumArg = { bar: 2, baz: "3", bob: 4.5, dave: "5.55", foo: 1 } as const;
const testEnumKeys = ["bar", "baz", "bob", "dave", "foo"] as const satisfies TestEnumArgKeys[];
const testEnumValues = [2, "3", 4.5, "5.55", 1] as const satisfies TestEnumArgValues[];
const testEnumEntries = [
	["bar", 2],
	["baz", "3"],
	["bob", 4.5],
	["dave", "5.55"],
	["foo", 1],
] as const satisfies (readonly [TestEnumArgKeys, TestEnumArgValues])[];

const testEnum = BasicEnum.new(testEnumArg);

describe(BasicEnum.name, () => {
	it("should be readonly after instantiation", () => {
		expectTypeOf<typeof testEnum>().toExtend<typeof testEnumArg>();

		expect(() => {
			//@ts-expect-error for testing
			testEnum.bar = 3;
			//@ts-expect-error for testing
			testEnum.bob = "5";
		}).toThrow();
	});

	it("should have each value appropriated assigned to the right key", () => {
		expect(testEnumArg).toEqual(testEnum);
	});

	it("should iterate over all explicit enum keys with $.keys in insertion order", () => {
		const seenKeys: EnumKey[] = [];

		for (const key of testEnum.$.keys()) {
			seenKeys.push(key);
		}

		expect(seenKeys).toEqual(testEnumKeys);
	});

	it("should iterate over all explicit enum values with $.values in insertion order", () => {
		const seenValues: EnumValue[] = [];

		for (const value of testEnum.$.values()) {
			seenValues.push(value);
		}

		expect(seenValues).toEqual(testEnumValues);
	});

	it("should iterate over all explicit enum entries with $.entries or direct iteration in insertion order", () => {
		const seenEntries: (readonly [EnumKey, EnumValue])[] = [];

		for (const entry of testEnum.$.entries()) {
			seenEntries.push(entry);
		}

		const seenEntries2: (readonly [EnumKey, EnumValue])[] = [];

		for (const entry of testEnum) {
			seenEntries2.push(entry);
		}

		expect(seenEntries).toEqual(testEnumEntries);
		expect(seenEntries2).toEqual(testEnumEntries);
	});

	it("should have the right size", () => {
		expect(testEnum.$.size).toBe(5);
	});

	it("should work as a type guard for the enum's keys", () => {
		const randomKey: unknown = "foo";

		if (testEnum.$.isKey(randomKey)) {
			expectTypeOf<typeof randomKey>().toEqualTypeOf<TestEnumArgKeys>();
			expect(randomKey).toBe("foo");
		}
	});

	it("should work as a type guard for the enum's values", () => {
		const randomValue: unknown = 4.5;

		if (testEnum.$.isValue(randomValue)) {
			expectTypeOf<typeof randomValue>().toEqualTypeOf<TestEnumArgValues>();
			expect(randomValue).toBe(4.5);
		}
	});

	it("should allow easy inference of the underlying enum type", () => {
		expectTypeOf<typeof testEnum.$.infer.keys>().toEqualTypeOf<TestEnumArgKeys>();
		expectTypeOf<typeof testEnum.$.infer.values>().toEqualTypeOf<TestEnumArgValues>();
	});

	it("should handle an empty enum", () => {
		const emptyEnum = BasicEnum.new({});
		expect([...emptyEnum.$.keys()]).toEqual([]);
		expect([...emptyEnum.$.values()]).toEqual([]);
		expect([...emptyEnum.$.entries()]).toEqual([]);
		expect([...emptyEnum]).toEqual([]);
		expect(emptyEnum.$.size).toBe(0);
	});

	it("should handle a single-key enum", () => {
		const singleEnum = BasicEnum.new({ only: 42 });
		expect([...singleEnum.$.keys()]).toEqual(["only"]);
		expect([...singleEnum.$.values()]).toEqual([42]);
		expect([...singleEnum.$.entries()]).toEqual([["only", 42]]);
		expect([...singleEnum]).toEqual([["only", 42]]);
		expect(singleEnum.$.size).toBe(1);
	});

	it("should not enumerate prototype properties", () => {
		const polluted = Object.create({ evil: 666 });
		polluted.good = 1;
		const enumObj = BasicEnum.new(polluted);
		expect([...enumObj.$.keys()]).toEqual(["good"]);
		expect([...enumObj.$.values()]).toEqual([1]);
		expect([...enumObj.$.entries()]).toEqual([["good", 1]]);
		//@ts-expect-error For testing
		expect(enumObj.$.size).toBe(1);
	});

	it("should ignore symbol keys", () => {
		const sym = Symbol("hidden");
		const obj = { foo: 1, [sym]: 2 };
		const enumObj = BasicEnum.new(obj);
		expect([...enumObj.$.keys()]).toEqual(["foo"]);
		expect([...enumObj.$.values()]).toEqual([1]);
		expect([...enumObj.$.entries()]).toEqual([["foo", 1]]);
		//@ts-expect-error For testing
		expect(enumObj.$.size).toBe(1);
	});
});
