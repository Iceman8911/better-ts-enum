/** biome-ignore-all lint/suspicious/noMisleadingInstantiator: <biome is confused> */
import type { Simplify } from "type-fest";
import { BasicEnum } from "./basic-enum";
import { EnumBuilderNs } from "../_shared";
import { MinimalEnumBuilder } from "../minimal/minimal-enum-builder";
import type { BasicEnumNs } from "./_shared";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";

/** An alternative way of instantiating a `BasicEnum` if you prefer the ergonomics of auto-incrementing, and strongly typed computed values. */
export class BasicEnumBuilder<
	const TCurrentEnumBuilderState extends
		readonly EnumBuilderNs.BuilderEntry[] = [],
	const TConfig extends EnumBuilderNs.Config = EnumBuilderNs.DefaultConfig,
> extends MinimalEnumBuilder<TCurrentEnumBuilderState, TConfig> {
	/**
	 * Static factory for partial config inference with defaults.
	 */
	static override new(): BasicEnumBuilder<[], EnumBuilderNs.DefaultConfig>;
	static override new<const TConfig extends Partial<EnumBuilderNs.Config>>(
		config: TConfig,
	): BasicEnumBuilder<[], EnumBuilderNs.GetBuilderConfig<TConfig>>;
	static override new<const TConfig extends Partial<EnumBuilderNs.Config>>(
		config?: TConfig,
	): BasicEnumBuilder<[], EnumBuilderNs.GetBuilderConfig<TConfig>> {
		//@ts-expect-error Inference limitation
		return new BasicEnumBuilder({
			...EnumBuilderNs.DefaultConfig,
			...config,
		});
	}

	/** Chainer for adding an enum member with an auto-incremented and inferred numeric value similar to native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	override $<TKey extends EnumKey>(
		key: TKey,
	): BasicEnumBuilder<
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
	override $<TKey extends EnumKey, TValue extends EnumValue>(
		key: TKey,
		value: TValue,
	): BasicEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding a computed enum member with greater flexibility than native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	override $<
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
	): BasicEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding more enum members with maximum type safety.
	 *
	 * @throws if the key has already been added previously
	 */
	override $<
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
	): BasicEnumBuilder<
		EnumBuilderNs.AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	> {
		//@ts-expect-error Inference limitation
		return super.$(arg, value);
	}

	override build(): BasicEnumNs.GetShape<
		//@ts-expect-error The simplified type is much more readable
		Simplify<EnumBuilderNs.FromEntries<TCurrentEnumBuilderState>>,
		TConfig
	> {
		return BasicEnum.new(this.eS, this.c);
	}
}
