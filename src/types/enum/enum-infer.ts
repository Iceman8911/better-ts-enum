import type { EnumValue } from "./enum-entry";

/** In practice, an enum will have a more strict type, e.g. {foo: 0, bar: 1, bar: 2} vs Record<"foo"|"bar"|"baz", 0 | 1 | 2> or Record<string, EnumValue> */
export type EnumType<TPropName extends string, TPropValue extends EnumValue> = Record<
	TPropName,
	TPropValue
>;
