import type { UnionToTuple, Simplify } from "type-fest";
import type { EnumLike, EnumKeys, EnumValues, EnumEntries } from "../types/enum/enum-class";

export type _SharedEnumClassConfig = Partial<{
	/** If `true`, the enum instance is frozen with `Object.freeze()`
	 *
	 * @default true
	 */
	freezeEnum: boolean;
}>;

export interface _NamespacedMethods<TEnumShape extends EnumLike> {
	keys(): EnumKeys<TEnumShape>;
	values(): EnumValues<TEnumShape>;
	entries(): EnumEntries<TEnumShape>;

	size: UnionToTuple<keyof TEnumShape>["length"];

	isKey(arg: unknown): arg is _NamespacedMethods<TEnumShape>["infer"]["keys"];
	isValue(arg: unknown): arg is _NamespacedMethods<TEnumShape>["infer"]["values"];

	/** Solely for inferring the types of the enum.
	 *
	 * In truth, this is actually `undefined`
	 */
	infer: {
		keys: Simplify<keyof TEnumShape>;
		values: Simplify<TEnumShape[keyof TEnumShape]>;
	};
}
