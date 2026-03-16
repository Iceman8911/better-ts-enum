import { removeReverseMappingFromNumericEnum } from "./ts-native-enum";
import { describe, it, expect } from "bun:test";

describe("removeReverseMappingFromNumericEnum", () => {
	enum NumericEnum {
		A,
		B,
	}

	enum StringEnum {
		X = "foo",
		Y = "bar",
	}

	enum MixedEnum {
		A,
		B = "bee",
	}

	it("removes reverse mapping from numeric enums", () => {
		const result = removeReverseMappingFromNumericEnum(NumericEnum);
		expect(result).toEqual({ A: 0, B: 1 });
	});

	it("does not modify string enums", () => {
		const result = removeReverseMappingFromNumericEnum(StringEnum);
		expect(result).toEqual({ X: StringEnum.X, Y: StringEnum.Y });
	});

	it("removes only numeric reverse mappings from mixed enums", () => {
		const result = removeReverseMappingFromNumericEnum(MixedEnum);
		expect(result).toEqual({ A: 0, B: MixedEnum.B });
		expect(Object.keys(result)).toEqual(["A", "B"]);
	});

	it("returns a new object, not the original", () => {
		const result = removeReverseMappingFromNumericEnum(NumericEnum);
		expect(result).not.toBe(NumericEnum);
	});

	it("handles empty enums", () => {
		const result = removeReverseMappingFromNumericEnum({});
		expect(result).toEqual({});
	});
});
