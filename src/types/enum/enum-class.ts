import type { Tagged } from "type-fest";

type ReservedEnumKeys = "$";
export type EnumKey = Exclude<string | number, ReservedEnumKeys>;
export type EnumValue = string | number;
export type EnumLike<TKey extends EnumKey = EnumKey, TValue extends EnumValue = EnumValue> = Record<
	TKey,
	TValue
>;
export type NominalizeEnumLike<
	TEnumLike extends EnumLike,
	TNominalTag extends string = "nominal-enum",
> = { [K in keyof TEnumLike]: Tagged<TEnumLike[K], TNominalTag> };

export type EnumKeys<TEnum extends EnumLike> =
	TEnum extends EnumLike<infer Keys> ? Generator<Keys> : never;
export type EnumValues<TEnum extends EnumLike> =
	TEnum extends EnumLike<infer _, infer Values> ? Generator<Values> : never;
export type EnumEntries<TEnum extends EnumLike> =
	TEnum extends EnumLike<infer Keys>
		? Generator<{ [K in Keys]: readonly [K, TEnum[K]] }[Keys]>
		: never;
