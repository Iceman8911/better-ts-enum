import type { Simplify } from "type-fest";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import type { _IncrementNumberByOneStage } from "../../types/_utils";
import BasicEnum from "./basic-enum";
import type { _BasicEnumConfig, _DefaultBasicEnumConfig, _GetBasicEnumShape } from "./_shared";
import type { _GetUserEnumConfigAfterApplyingDefaults } from "../_shared";

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
> = TKey extends TCurrentEnumBuilderState[number][0]
	? never
	: [...TCurrentEnumBuilderState, readonly [TKey, TValue]];

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
	const TCurrentEnumBuilderState extends readonly EnumBuilderEntry[] = [],
	const TConfig extends _BasicEnumConfig = _BasicEnumConfig,
> {
	//@ts-expect-error Inference limitation
	#enumState: FromEntries<TCurrentEnumBuilderState> = {};
	#lastValue?: EnumValue;
	#config: Partial<TConfig>;

	private constructor(config?: Partial<TConfig>) {
		this.#config = config ?? {};
	}

	/**
	 * Static factory for partial config inference with defaults.
	 */
	static new<TUserConfig extends Partial<_BasicEnumConfig>>(
		config?: TUserConfig,
	): BasicEnumBuilder<
		[],
		_GetUserEnumConfigAfterApplyingDefaults<_BasicEnumConfig, _DefaultBasicEnumConfig, TUserConfig>
	> {
		//@ts-expect-error Inference limitation
		return new BasicEnumBuilder(config);
	}

	/** Chainer for adding an enum member with an auto-incremented and inferred numeric value similar to native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(key: TKey): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>, TConfig>;
	/** Chainer for adding an enum member with an explictly defined value.
	 *
	 * @throws if the key has already been added previously
	 */
	$<TKey extends EnumKey, TValue extends EnumValue>(
		key: TKey,
		value: TValue,
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>, TConfig>;
	/** Chainer for adding a computed enum member with greater flexibility than native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(
		callback: (
			enumSoFar: Simplify<FromEntries<TCurrentEnumBuilderState>>,
		) => TKey | readonly [TKey, TValue],
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>, TConfig>;
	/** Chainer for adding more enum members with maximum type safety.
	 *
	 * @throws if the key has already been added previously
	 */
	$<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultNumberToUseAsEnumValue<TCurrentEnumBuilderState>,
	>(
		arg:
			| TKey
			| ((enumSoFar: FromEntries<TCurrentEnumBuilderState>) => TKey | readonly [TKey, TValue]),
		value?: TValue,
	): BasicEnumBuilder<AddMember<TCurrentEnumBuilderState, TKey, TValue>, TConfig> {
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

		if (resolvedKey in this.#enumState) {
			throw new Error(`Duplicate enum key: ${resolvedKey}`);
		}

		//@ts-expect-error typescript limitation
		this.#enumState[resolvedKey] = resolvedValue;

		this.#lastValue = resolvedValue;

		return this;
	}

	get #defaultEntryValue() {
		if (this.#lastValue == null || typeof this.#lastValue === "string") {
			return 0;
		}

		return this.#lastValue + 1;
	}

	//@ts-expect-error The simplified type is much more readable
	build(): _GetBasicEnumShape<Simplify<FromEntries<TCurrentEnumBuilderState>>, TConfig> {
		//@ts-expect-error The simplified type is much more readable
		return BasicEnum.new(this.#enumState, this.#config);
	}
}
