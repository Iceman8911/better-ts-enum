import { describe, expect, expectTypeOf, it } from "bun:test";
import BasicEnum from "./basic-enum";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import { removeReverseMappingFromNumericEnum } from "../../utils/ts-native-enum";

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

	it("should not allow the namespace prop '$' to be assignable under normal means", () => {
		const namespaceVal = testEnum.$;

		try {
			//@ts-expect-error Testing purposes
			testEnum.$ = "foo";
		} catch {}

		expect(namespaceVal).toStrictEqual(testEnum.$);
	});

	it("should not iterate over the namespace prop '$'", () => {
		expect([...testEnum.$.keys()]).not.toContain("$");
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

	it("should throw upon accessing `$.infer` since it's a type-only construct", () => {
		expect(() => testEnum.$.infer).toThrow();
		expect(() => testEnum.$.infer.keys).toThrow();
		expect(() => testEnum.$.infer.values).toThrow();
	});

	it("should infer nominal typing when nominal: true is set", () => {
		const nominalEnum1 = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "nominal1" });
		const nominalEnum2 = BasicEnum.new({ FOO: 1, BAR: 2 }, { nominal: "nominal2" });

		expectTypeOf<typeof nominalEnum1.BAR>().toExtend<2>();
		expectTypeOf<2>().not.toExtend<typeof nominalEnum1.BAR>();
		//@ts-expect-error For Testing
		expect(nominalEnum1.BAR).toBe(2);

		expectTypeOf<typeof nominalEnum1.FOO>().toExtend<1>();
		expectTypeOf<1>().not.toExtend<typeof nominalEnum1.FOO>();
		//@ts-expect-error For Testing
		expect(nominalEnum1.FOO).toBe(1);

		expectTypeOf<typeof nominalEnum1.BAR>().not.toEqualTypeOf<typeof nominalEnum2.BAR>();
	});

	it("should infer non-nominal typing when nominal: false (default)", () => {
		const regularEnum = BasicEnum.new({ FOO: 1, BAR: 2 });

		type Values = typeof regularEnum.$.infer.values;
		const ok1: Values = 1;
		const ok2: Values = 2;
		expect(ok1).toBe(1);
		expect(ok2).toBe(2);
	});

	it("should be readonly at type-level and frozen at runtime when freeze: true (default)", () => {
		const frozenEnum = BasicEnum.new({ FOO: 1, BAR: 2 });

		expect(() => {
			//@ts-expect-error For testing
			frozenEnum.BAR = 32;
			//@ts-expect-error For testing
			frozenEnum.FOO = "ds";
		}).toThrow();

		expect(Object.isFrozen(frozenEnum)).toBe(true);
	});

	it("should NOT be readonly at type-level and NOT frozen at runtime when freeze: false", () => {
		const unfrozenEnum = BasicEnum.new({ FOO: 1, BAR: 2 }, { freeze: false });

		unfrozenEnum.FOO = 1;
		expect(Object.isFrozen(unfrozenEnum)).toBe(false);
	});

	it("should strip out the reverse-mapping of native numeric typescript enums", () => {
		enum NativeEnum {
			FOO,
			BAR,
			BAZ,
		}

		const convertedEnum = BasicEnum.new(NativeEnum);

		expect([...convertedEnum.$.keys()]).toEqual(["FOO", "BAR", "BAZ"]);
		expect([...convertedEnum.$.values()]).toEqual([NativeEnum.FOO, NativeEnum.BAR, NativeEnum.BAZ]);
		expect([...convertedEnum.$.entries()]).toStrictEqual([
			["FOO", NativeEnum.FOO],
			["BAR", NativeEnum.BAR],
			["BAZ", NativeEnum.BAZ],
		]);
		expect(convertedEnum.$.size).toBe(3);
	});

	it("should return a shallow copy of the original input, aside from removing reverse-mapping", () => {
		expect(testEnum.$.raw).toStrictEqual(testEnumArg);
		expectTypeOf(testEnum.$.raw).toEqualTypeOf(testEnumArg);

		enum ReverseMappedNativeEnum {
			FOO,
			BAR,
			BAZ,
		}

		const strippedEnumInstance = BasicEnum.new(ReverseMappedNativeEnum);

		expect(strippedEnumInstance.$.raw).not.toStrictEqual(ReverseMappedNativeEnum);
		expect(strippedEnumInstance.$.raw).toStrictEqual(
			removeReverseMappingFromNumericEnum(ReverseMappedNativeEnum),
		);
		expectTypeOf(strippedEnumInstance.$.raw).toEqualTypeOf(
			removeReverseMappingFromNumericEnum(ReverseMappedNativeEnum),
		);
	});

	it("should serialize to a deep copy of the plain object that instantiated it", () => {
		const serialized = JSON.stringify(testEnum);
		const deserialized = JSON.parse(serialized);

		expect(deserialized).toStrictEqual(testEnumArg);
	});

	it("should deeply equal a new instance instantiated from it's serialization + deserialization", () => {
		const serialized = JSON.stringify(testEnum);
		const deserialized = JSON.parse(serialized);

		expect(BasicEnum.new(deserialized)).toStrictEqual(testEnum);
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
