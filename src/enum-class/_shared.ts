import type { UnionToTuple, Merge, Writable } from "type-fest";
import type {
	EnumLike,
	EnumKeys,
	EnumValues,
	EnumEntries,
	NominalizeEnumLike,
	EnumKey,
	EnumValue,
} from "../types/enum/enum-class";
import type { _IncrementNumberByOneStage } from "../types/_utils";

/** Shared enum namespace */
export namespace EnumClass {
	export interface ClassConfig {
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

	export const DefaultClassConfig = {
		freeze: true,
		nominal: "",
	} as const satisfies ClassConfig;

	export type DefaultClassConfig = typeof DefaultClassConfig;

	export interface BuilderConfig extends ClassConfig {
		/** Dictates the behaviour for auto-inferred enum values.
		 *
		 * - `number` - Uses an auto-incrementing number based off the most recent enum value, else it falls back to 0
		 * - `key` - Uses the enum's key as it's value
		 *
		 * @default "number"
		 */
		valueType: "number" | "key";

		/** Optional prefix to apply to any string enum value.
		 *
		 * This is applied to both auto-generated key values and explicit string values.
		 * @default ""
		 */
		prefix: string;

		/** Optional suffix to apply to any string enum value.
		 *
		 * This is applied to both auto-generated key values and explicit string values.
		 * @default ""
		 */
		suffix: string;
	}

	export const DefaultBuilderConfig = {
		...DefaultClassConfig,
		prefix: "",
		suffix: "",
		valueType: "number",
	} as const satisfies BuilderConfig;

	export type DefaultBuilderConfig = typeof DefaultBuilderConfig;

	export type MergeConfig<
		TReferenceConfig extends ClassConfig,
		TDefaultConfig extends TReferenceConfig,
		TUserConfig extends Partial<TReferenceConfig>,
	> = Merge<
		TDefaultConfig,
		/** This is so that defaults will be used 100% if no user config is provided */
		TReferenceConfig extends TUserConfig ? object : Required<TUserConfig>
	>;

	export interface Methods<TEnumShape extends EnumLike> {
		keys(): EnumKeys<TEnumShape>;
		values(): EnumValues<TEnumShape>;
		entries(): EnumEntries<TEnumShape>;

		size: UnionToTuple<keyof TEnumShape>["length"];

		/** Represents a copy of the plain object used during instantiation.
		 *
		 * In cases where the object was a numeric native enum, the reverse-mapping is lost
		 */
		raw: TEnumShape;

		isKey(arg: unknown): arg is Methods<TEnumShape>["infer"]["keys"];
		isValue(arg: unknown): arg is Methods<TEnumShape>["infer"]["values"];

		/** Solely for inferring the types of the enum.
		 *
		 * Is `undefined` at runtime.
		 *
		 * @example
		 *
		 * type EnumValues = typeof testEnum.$.infer.values; // GOOD
		 *
		 * const EnumValues = testEnum.$.infer.values; // BAD, and throws
		 */
		infer: {
			keys: keyof TEnumShape;
			values: TEnumShape[keyof TEnumShape];
		};
	}

	export type GetNominalOrRegularShape<
		TEnumShape extends EnumLike,
		TConfig extends ClassConfig,
	> = TConfig["nominal"] extends ""
		? TEnumShape
		: NominalizeEnumLike<TEnumShape, TConfig["nominal"]>;

	export type GetFrozenOrRegularShape<
		TEnumShape extends EnumLike,
		TConfig extends ClassConfig,
	> = TConfig["freeze"] extends true
		? Readonly<TEnumShape>
		: Writable<TEnumShape>;

	export type BuilderEntry<
		TKey extends EnumKey = EnumKey,
		TValue extends EnumValue = EnumValue,
	> = readonly [TKey, TValue];

	export type GetBuilderConfig<
		TUserConfig extends Partial<EnumClass.BuilderConfig>,
	> = Merge<EnumClass.DefaultBuilderConfig, Required<TUserConfig>>;

	type LastEntry<T extends readonly EnumClass.BuilderEntry[]> = T extends [
		...infer _,
		infer L,
	]
		? L
		: never;

	export type FromEntries<T extends readonly EnumClass.BuilderEntry[]> = {
		[K in T[number] as K[0]]: K[1];
	};

	type _ApplyPrefixSuffixToStringValue<
		TValue extends EnumValue,
		TBuilderConfig extends EnumClass.BuilderConfig,
	> = TValue extends string
		? `${TBuilderConfig["prefix"]}${TValue}${TBuilderConfig["suffix"]}`
		: TValue;

	export type AddMember<
		TCurrentEnumBuilderState extends readonly EnumClass.BuilderEntry[],
		TKey extends EnumKey,
		TValue extends EnumValue,
		TBuilderConfig extends EnumClass.BuilderConfig,
	> = TKey extends TCurrentEnumBuilderState[number][0]
		? never
		: [
				...TCurrentEnumBuilderState,
				readonly [
					TKey,
					_ApplyPrefixSuffixToStringValue<TValue, TBuilderConfig>,
				],
			];

	type GetMostRecentEnumValue<
		TCurrentEnumBuilderState extends readonly EnumClass.BuilderEntry[],
	> = LastEntry<TCurrentEnumBuilderState>[1];

	export type GetNextDefaultValueToUseAsEnumValue<
		TCurrentEnumBuilderState extends readonly EnumClass.BuilderEntry[],
		TBuilderConfig extends EnumClass.BuilderConfig,
		TCurrentKey extends EnumKey,
	> = TBuilderConfig["valueType"] extends "number"
		? GetMostRecentEnumValue<TCurrentEnumBuilderState> extends number
			? _IncrementNumberByOneStage<
					GetMostRecentEnumValue<TCurrentEnumBuilderState>
				> extends never
				? 0
				: _IncrementNumberByOneStage<
						GetMostRecentEnumValue<TCurrentEnumBuilderState>
					>
			: 0
		: TBuilderConfig["valueType"] extends "key"
			? TCurrentKey
			: never;
}
