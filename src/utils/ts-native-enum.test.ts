import { copyEnumLikeEntriesWithoutReverseMapping } from "./ts-native-enum";
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
		const result = copyEnumLikeEntriesWithoutReverseMapping(NumericEnum);
		expect(result).toEqual({ A: 0, B: 1 });
	});

	it("does not modify string enums", () => {
		const result = copyEnumLikeEntriesWithoutReverseMapping(StringEnum);
		expect(result).toEqual({ X: StringEnum.X, Y: StringEnum.Y });
	});

	it("removes only numeric reverse mappings from mixed enums", () => {
		const result = copyEnumLikeEntriesWithoutReverseMapping(MixedEnum);
		expect(result).toEqual({ A: 0, B: MixedEnum.B });
		expect(Object.keys(result)).toEqual(["A", "B"]);
	});

	it("returns a new object, not the original", () => {
		const result = copyEnumLikeEntriesWithoutReverseMapping(NumericEnum);
		expect(result).not.toBe(NumericEnum);
	});

	it("handles empty enums", () => {
		const result = copyEnumLikeEntriesWithoutReverseMapping({});
		expect(result).toEqual({});
	});
});
