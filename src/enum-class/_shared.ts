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
export namespace EnumNs {
	export interface Config {
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

	export const DefaultConfig = {
		freeze: true,
		nominal: "",
	} as const satisfies Config;

	export type DefaultConfig = typeof DefaultConfig;

	export type MergeConfig<
		TReferenceConfig extends Config,
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
		TConfig extends Config,
	> = TConfig["nominal"] extends ""
		? TEnumShape
		: NominalizeEnumLike<TEnumShape, TConfig["nominal"]>;

	export type GetFrozenOrRegularShape<
		TEnumShape extends EnumLike,
		TConfig extends Config,
	> = TConfig["freeze"] extends true
		? Readonly<TEnumShape>
		: Writable<TEnumShape>;
}

/** Shared enum builder namespace */
export namespace EnumBuilderNs {
	export interface Config extends EnumNs.Config {
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

	export const DefaultConfig = {
		...EnumNs.DefaultConfig,
		prefix: "",
		suffix: "",
		valueType: "number",
	} as const satisfies Config;

	export type DefaultConfig = typeof DefaultConfig;

	export type BuilderEntry<
		TKey extends EnumKey = EnumKey,
		TValue extends EnumValue = EnumValue,
	> = readonly [TKey, TValue];

	export type GetBuilderConfig<
		TUserConfig extends Partial<EnumBuilderNs.Config>,
	> = Merge<EnumBuilderNs.DefaultConfig, Required<TUserConfig>>;

	type LastEntry<T extends readonly EnumBuilderNs.BuilderEntry[]> = T extends [
		...infer _,
		infer L,
	]
		? L
		: never;

	export type FromEntries<T extends readonly EnumBuilderNs.BuilderEntry[]> = {
		[K in T[number] as K[0]]: K[1];
	};

	type _ApplyPrefixSuffixToStringValue<
		TValue extends EnumValue,
		TBuilderConfig extends EnumBuilderNs.Config,
	> = TValue extends string
		? `${TBuilderConfig["prefix"]}${TValue}${TBuilderConfig["suffix"]}`
		: TValue;

	export type AddMember<
		TCurrentEnumBuilderState extends readonly EnumBuilderNs.BuilderEntry[],
		TKey extends EnumKey,
		TValue extends EnumValue,
		TBuilderConfig extends EnumBuilderNs.Config,
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
		TCurrentEnumBuilderState extends readonly EnumBuilderNs.BuilderEntry[],
	> = LastEntry<TCurrentEnumBuilderState>[1];

	export type GetNextDefaultValueToUseAsEnumValue<
		TCurrentEnumBuilderState extends readonly EnumBuilderNs.BuilderEntry[],
		TBuilderConfig extends EnumBuilderNs.Config,
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
