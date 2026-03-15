import type { Simplify } from "type-fest";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import type { _IncrementNumberByOneStage } from "../../types/_utils";
import BasicEnum, { type GetBasicEnumShape } from "./basic-enum";

type EnumBuilderEntry<
	TKey extends EnumKey = EnumKey,
	TValue extends EnumValue = EnumValue,
> = readonly [TKey, TValue];

type LastEntry<T extends readonly EnumBuilderEntry[]> = T extends [...infer _, infer L] ? L : never;

type FromEntries<T extends readonly EnumBuilderEntry[]> = {
	[K in T[number] as K[0]]: K[1];
};

type AddMember<
	TCurrentEnumBuilderState extends readonly EnumBuilderEntry[],
	TKey extends EnumKey,
	TValue extends EnumValue,
> = [...TCurrentEnumBuilderState, readonly [TKey, TValue]];

type GetMostRecentEnumValue<TCurrentEnumBuilderState extends readonly EnumBuilderEntry[]> =
	LastEntry<TCurrentEnumBuilderState>[1];

type GetNextDefaultNumberToUseAsEnumValue<
	TCurrentEnumBuilderState extends readonly EnumBuilderEntry[],
> =
	GetMostRecentEnumValue<TCurrentEnumBuilderState> extends number
		? _IncrementNumberByOneStage<GetMostRecentEnumValue<TCurrentEnumBuilderState>> extends never
			? 0
			: _IncrementNumberByOneStage<GetMostRecentEnumValue<TCurrentEnumBuilderState>>
		: 0;

/** An alternative way of instantiating a `BasicEnum` if you prefer the ergonomics of auto-incrementing, and strongly typed computed values. */
export default class BasicEnumBuilder<
	TCurrentEnumBuilderState extends readonly EnumBuilderEntry[] = [],
> {
	//@ts-expect-error Typescript limitation
	#enumState: FromEntries<TCurrentEnumBuilderState> = {};
	#lastValue?: EnumValue;

	constructor() {}

	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(key: TKey): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>>;
	$<TKey extends EnumKey, TValue extends EnumValue>(
		key: TKey,
		value: TValue,
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>>;
	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(
		callback: (
			enumSoFar: Simplify<FromEntries<TCurrentEnumBuilderState>>,
		) => TKey | readonly [TKey, TValue],
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>>;
	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(
		arg:
			| TKey
			| ((enumSoFar: FromEntries<TCurrentEnumBuilderState>) => TKey | readonly [TKey, TValue]),
		value?: TValue,
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>> {
		let resolvedKey: TKey;
		let resolvedValue: TValue;

		if (typeof arg === "function") {
			const resolved = arg(this.#enumState);

			if (Array.isArray(resolved)) {
				resolvedKey = resolved[0];
				resolvedValue = resolved[1];
			} else {
				resolvedKey = resolved as TKey;
				resolvedValue = this.#defaultEntryValue as TValue;
			}
		} else {
			resolvedKey = arg as TKey;
			resolvedValue = (value ?? this.#defaultEntryValue) as TValue;
		}

		//@ts-expect-error typescript limitation
		this.#enumState[resolvedKey] = resolvedValue;

		//@ts-expect-error typescript limitation
		return this;
	}

	get #defaultEntryValue() {
		if (this.#lastValue == null || typeof this.#lastValue === "string") {
			return 0;
		}

		return this.#lastValue + 1;
	}

	build(): Simplify<GetBasicEnumShape<FromEntries<TCurrentEnumBuilderState>>> {
		return BasicEnum.new(this.#enumState);
	}
}
