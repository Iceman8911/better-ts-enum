import type { Merge } from "type-fest";
import type { _IncrementNumberByOneStage } from "../../types/_utils";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import {
	type Config as EnumClassConfig,
	DefaultConfig as EnumClassDefaultConfig,
} from "./enum";

export interface Config extends EnumClassConfig {
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
	...EnumClassDefaultConfig,
	prefix: "",
	suffix: "",
	valueType: "number",
} as const satisfies Config;

export type DefaultConfig = typeof DefaultConfig;

export type BuilderEntry<
	TKey extends EnumKey = EnumKey,
	TValue extends EnumValue = EnumValue,
> = readonly [TKey, TValue];

export type GetBuilderConfig<TUserConfig extends Partial<Config>> = Merge<
	DefaultConfig,
	Required<TUserConfig>
>;

type LastEntry<T extends readonly BuilderEntry[]> = T extends [
	...infer _,
	infer L,
]
	? L
	: never;

export type FromEntries<T extends readonly BuilderEntry[]> = {
	[K in T[number] as K[0]]: K[1];
};

type _ApplyPrefixSuffixToStringValue<
	TValue extends EnumValue,
	TBuilderConfig extends Config,
> = TValue extends string
	? `${TBuilderConfig["prefix"]}${TValue}${TBuilderConfig["suffix"]}`
	: TValue;

export type AddMember<
	TCurrentEnumBuilderState extends readonly BuilderEntry[],
	TKey extends EnumKey,
	TValue extends EnumValue,
	TBuilderConfig extends Config,
> = TKey extends TCurrentEnumBuilderState[number][0]
	? never
	: [
			...TCurrentEnumBuilderState,
			readonly [TKey, _ApplyPrefixSuffixToStringValue<TValue, TBuilderConfig>],
		];

type GetMostRecentEnumValue<
	TCurrentEnumBuilderState extends readonly BuilderEntry[],
> = LastEntry<TCurrentEnumBuilderState>[1];

export type GetNextDefaultValueToUseAsEnumValue<
	TCurrentEnumBuilderState extends readonly BuilderEntry[],
	TBuilderConfig extends Config,
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
