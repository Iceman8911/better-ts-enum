import type { UnionToTuple, Merge } from "type-fest";
import type { EnumLike, EnumKeys, EnumValues, EnumEntries } from "../types/enum/enum-class";

export interface _SharedEnumClassConfig {
	/** If `true`, the enum instance is frozen with `Object.freeze()` and it's enum values will be readonly.
	 *
	 * Now, this might sound useless, since enums are meant to be immutable, but it's used internally for derived classes of the `BasicEnum`. You likely won't ever need to touch this.
	 *
	 * @default true
	 */
	freeze: boolean;

	/** If set to a non-empty string, all enum values are nominal instead of duck-typed, similar to native string enums.
	 *
	 * Enum values are only regarded as the same if they originate from the same enum (i.e, they have the same value of `nominal`).
	 *
	 * Has no runtime effect.
	 *
	 * @default ""
	 *
	 * @example
	 *	const testEnum = new TestEnum({ FOO: 1, BAR : "bar" }, { nominal: "testEnum" });
	 * type TestEnumValues = typeof testEnum.$.infer.values
	 *
	 *	const testEnum2 = new TestEnum({ FOO: 1, BAR : "bar" }, { nominal: "testEnum2" });
	 *
	 * function showcaseNominal(val: TestEnumValues): TestEnumValues {
	 * 	return val
	 * }
	 *
	 * showcaseNominal(testEnum.FOO) // Good.
	 * showcaseNominal(testEnum.BAR) // Good.
	 * showcaseNominal(1) // Typescript error.
	 * showcaseNominal("bar") // Typescript error.
	 * showcaseNominal(testEnum2.FOO) // Typescript error.
	 * showcaseNominal(testEnum2.FOO) // Typescript error.
	 */
	nominal: string;
}

export interface _DefaultSharedEnumClassConfig extends _SharedEnumClassConfig {
	readonly freeze: true;
	readonly nominal: "";
}

export const _DEFAULT_SHARED_ENUM_CLASS_CONFIG: _DefaultSharedEnumClassConfig = {
	freeze: true,
	nominal: "",
};

export type _GetUserEnumConfigAfterApplyingDefaults<
	TReferenceConfig extends _SharedEnumClassConfig,
	TDefaultConfig extends TReferenceConfig,
	TUserConfig extends Partial<TReferenceConfig>,
> = Merge<
	TDefaultConfig,
	/** This is so that defaults will be used 100% if no user config is provided */
	TReferenceConfig extends TUserConfig ? {} : Required<TUserConfig>
>;

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
		keys: keyof TEnumShape;
		values: TEnumShape[keyof TEnumShape];
	};
}
