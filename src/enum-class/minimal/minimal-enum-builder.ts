/** biome-ignore-all lint/suspicious/noMisleadingInstantiator: <biome is confused with the overloads> */
import type { Simplify } from "type-fest";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import { MinimalEnum } from "./minimal-enum";
import { EnumBuilderNs } from "../_shared";
import type { MinimalEnumNs } from "./_shared";

/** An alternative way of instantiating a `MinimalEnum` if you prefer the ergonomics of auto-incrementing, and strongly typed computed values. */
export class MinimalEnumBuilder<
	const TCurrentEnumBuilderState extends
		readonly EnumBuilderNs.BuilderEntry[] = [],
	const TConfig extends EnumBuilderNs.Config = EnumBuilderNs.DefaultConfig,
> {
	/** Enum State to build upon */
	protected s = {} as EnumBuilderNs.FromEntries<TCurrentEnumBuilderState>;
	#lastValue?: EnumValue;
	/** Config */
	protected c: TConfig;

	protected constructor(config: TConfig) {
		this.c = config;
	}

	/**
	 * Static factory for partial config inference with defaults.
	 */
	static new(): MinimalEnumBuilder<[], EnumBuilderNs.DefaultConfig>;
	static new<const TConfig extends Partial<EnumBuilderNs.Config>>(
		config: TConfig,
	): MinimalEnumBuilder<[], EnumBuilderNs.GetBuilderConfig<TConfig>>;
	static new<const TConfig extends Partial<EnumBuilderNs.Config>>(
		config?: TConfig,
	): MinimalEnumBuilder<[], EnumBuilderNs.GetBuilderConfig<TConfig>> {
		//@ts-expect-error Inference limitation
		return new MinimalEnumBuilder({
			...EnumBuilderNs.DefaultConfig,
			...config,
		});
	}

	/** Chainer for adding an enum member with an auto-incremented and inferred numeric value similar to native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	$<TKey extends EnumKey>(
		key: TKey,
	): MinimalEnumBuilder<
		EnumBuilderNs.AddMember<
			TCurrentEnumBuilderState,
			TKey,
			EnumBuilderNs.GetNextDefaultValueToUseAsEnumValue<
				TCurrentEnumBuilderState,
				TConfig,
				TKey
			>,
			TConfig
		>,
		TConfig
	>;
	/** Chainer for adding an enum member with an explictly defined value.
	 *
	 * @throws if the key has already been added previously
	 */
	$<TKey extends EnumKey, TValue extends EnumValue>(
		key: TKey,
		value: TValue,
	): MinimalEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding a computed enum member with greater flexibility than native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	$<
		TKey extends EnumKey,
		TValue extends
			EnumValue = EnumBuilderNs.GetNextDefaultValueToUseAsEnumValue<
			TCurrentEnumBuilderState,
			TConfig,
			TKey
		>,
	>(
		callback: (
			enumSoFar: Simplify<EnumBuilderNs.FromEntries<TCurrentEnumBuilderState>>,
		) => TKey | readonly [TKey, TValue],
	): MinimalEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding more enum members with maximum type safety.
	 *
	 * @throws if the key has already been added previously
	 */
	$<
		TKey extends EnumKey,
		TValue extends
			EnumValue = EnumBuilderNs.GetNextDefaultValueToUseAsEnumValue<
			TCurrentEnumBuilderState,
			TConfig,
			TKey
		>,
	>(
		arg:
			| TKey
			| ((
					enumSoFar: EnumBuilderNs.FromEntries<TCurrentEnumBuilderState>,
			  ) => TKey | readonly [TKey, TValue]),
		value?: TValue,
	): MinimalEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	> {
		let resolvedKey: TKey;
		let resolvedValue: TValue;

		if (typeof arg === "function") {
			const resolved = arg(this.s);

			if (Array.isArray(resolved)) {
				resolvedKey = resolved[0];
				resolvedValue = this.#normalizeValue(resolved[1]) as TValue;
			} else {
				resolvedKey = resolved as TKey;
				//@ts-expect-error Inference limitation
				resolvedValue = this.#shouldUseNumberAsDefaultValue
					? this.#defaultEntryNumberValue
					: this.#normalizeValue(resolvedKey);
			}
		} else {
			resolvedKey = arg as TKey;
			//@ts-expect-error Inference limitation
			resolvedValue = this.#normalizeValue(
				value ??
					(this.#shouldUseNumberAsDefaultValue
						? this.#defaultEntryNumberValue
						: resolvedKey),
			);
		}

		if (resolvedKey in this.s) {
			throw new Error(`Duplicate enum key: ${resolvedKey}`);
		}

		//@ts-expect-error typescript limitation
		this.s[resolvedKey] = resolvedValue;

		this.#lastValue = resolvedValue;

		return this;
	}

	get #defaultEntryNumberValue(): number {
		if (typeof this.#lastValue !== "number") {
			return 0;
		}

		return this.#lastValue + 1;
	}

	#normalizeValue<TValue extends EnumValue>(value: TValue) {
		const { prefix, suffix } = this.c;

		if (typeof value === "string" && (prefix || suffix)) {
			return `${prefix}${value}${suffix}`;
		}

		return value;
	}

	get #shouldUseNumberAsDefaultValue(): boolean {
		return this.c.valueType === "number";
	}

	build(): MinimalEnumNs.GetShape<
		//@ts-expect-error The simplified type is much more readable
		Simplify<EnumBuilderNs.FromEntries<TCurrentEnumBuilderState>>,
		TConfig
	> {
		return MinimalEnum.new(this.s) as never;
	}
}
