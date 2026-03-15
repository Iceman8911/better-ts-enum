import type { Add } from "ts-arithmetic";
import type { EnumType } from "./enum-infer";
import type { EnumValue } from "./enum-entry";

export type EnumPropNameArg<TKey extends string = string> = TKey;

export type EnumPropEntryArg<
	TKey extends string = string,
	TValue extends EnumValue = EnumValue,
> = readonly [TKey, TValue];

export type EnumComputedArg<TEnumSoFar extends Record<string, EnumValue>> = (
	enumObject: TEnumSoFar,
) => EnumPropNameArg | EnumPropEntryArg;

export type EnumConstructorArg<TEnumSoFar extends Record<string, EnumValue>> =
	| EnumPropNameArg
	| EnumPropEntryArg
	| EnumComputedArg<TEnumSoFar>;

type Increment<TNumber extends number> = Add<TNumber, 1>;

type MergeEnum<
	TEnum extends Record<string, EnumValue>,
	TKey extends string,
	TValue extends EnumValue,
> = Omit<TEnum, TKey> & { [K in TKey]: TValue };

type NextAutoAfterExplicit<TNext extends number, TValue extends EnumValue> = TValue extends number
	? Increment<TValue>
	: TNext;

type ResolveComputed<TArg, TEnum extends Record<string, EnumValue>> = TArg extends (
	enumObject: TEnum,
) => infer TResult
	? TResult
	: never;

type ApplyArgToEnum<
	TEnum extends Record<string, EnumValue>,
	TNext extends number,
	TArg,
> = TArg extends readonly [infer TKey, infer TValue]
	? TKey extends string
		? TValue extends EnumValue
			? readonly [MergeEnum<TEnum, TKey, TValue>, NextAutoAfterExplicit<TNext, TValue>]
			: readonly [TEnum, TNext]
		: readonly [TEnum, TNext]
	: TArg extends string
		? readonly [MergeEnum<TEnum, TArg, TNext>, Increment<TNext>]
		: readonly [TEnum, TNext];

type ApplyOne<TEnum extends Record<string, EnumValue>, TNext extends number, TArg> = TArg extends (
	...args: never[]
) => unknown
	? ApplyArgToEnum<TEnum, TNext, ResolveComputed<TArg, TEnum>>
	: ApplyArgToEnum<TEnum, TNext, TArg>;

type InferEnumFromArgsInternal<
	TArgs extends readonly unknown[],
	TEnum extends Record<string, EnumValue>,
	TNext extends number,
> = TArgs extends readonly [infer THead, ...infer TTail]
	? ApplyOne<TEnum, TNext, THead> extends readonly [infer TEnum2, infer TNext2]
		? TEnum2 extends Record<string, EnumValue>
			? TNext2 extends number
				? InferEnumFromArgsInternal<TTail, TEnum2, TNext2>
				: TEnum2
			: TEnum
		: TEnum
	: TEnum;

export type InferEnumFromConstructorArgs<
	TArgs extends readonly unknown[],
	TStart extends number = 0,
> = InferEnumFromArgsInternal<TArgs, {}, TStart>;

type StepFor<TEnumSoFar extends Record<string, EnumValue>> =
	| EnumPropNameArg
	| EnumPropEntryArg
	| EnumComputedArg<TEnumSoFar>;

type BuildTypedArgs<
	TArgs extends readonly unknown[],
	TEnumSoFar extends Record<string, EnumValue>,
	TNext extends number,
	TOut extends readonly unknown[] = readonly [],
> = TArgs extends readonly [infer THead, ...infer TTail]
	? ApplyOne<TEnumSoFar, TNext, THead> extends readonly [infer TEnum2, infer TNext2]
		? TEnum2 extends Record<string, EnumValue>
			? TNext2 extends number
				? BuildTypedArgs<TTail, TEnum2, TNext2, readonly [...TOut, StepFor<TEnumSoFar>]>
				: readonly [...TOut, StepFor<TEnumSoFar>]
			: readonly [...TOut, StepFor<TEnumSoFar>]
		: readonly [...TOut, StepFor<TEnumSoFar>]
	: TOut;

type TypedArgsFor<TArgs extends readonly unknown[], TStart extends number> = BuildTypedArgs<
	TArgs,
	{},
	TStart
>;

export type EnumBuilder<TStart extends number = 0> = {
	build<const TArgs extends readonly unknown[]>(
		...args: TArgs & TypedArgsFor<TArgs, TStart>
	): TArgs;
};

export type EnumClassConstructor<
	TArgs extends readonly unknown[] = readonly unknown[],
	TStart extends number = 0,
> = new (
	...args: TArgs & readonly EnumConstructorArg<Record<string, EnumValue>>[]
) => EnumType<
	keyof InferEnumFromConstructorArgs<TArgs, TStart> & string,
	InferEnumFromConstructorArgs<TArgs, TStart>[keyof InferEnumFromConstructorArgs<TArgs, TStart>] &
		EnumValue
>;
