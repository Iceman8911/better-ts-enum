/** biome-ignore-all lint/suspicious/noMisleadingInstantiator: <biome is confused> */
import type { Simplify } from "type-fest";
import type { EnumKey, EnumValue } from "../../types/enum/enum-class";
import {
	type AddMember,
	type BuilderEntry,
	type Config,
	DefaultConfig,
	type FromEntries,
	type GetBuilderConfig,
	type GetNextDefaultValueToUseAsEnumValue,
} from "../_shared/enum-builder";
import { MinimalEnumBuilder } from "../minimal/minimal-enum-builder";
import type { GetShape } from "./_shared";
import { BasicEnum } from "./basic-enum";

/** An alternative way of instantiating a `BasicEnum` if you prefer the ergonomics of auto-incrementing, and strongly typed computed values. */
export class BasicEnumBuilder<
	const TCurrentEnumBuilderState extends readonly BuilderEntry[] = [],
	const TConfig extends Config = DefaultConfig,
> extends MinimalEnumBuilder<TCurrentEnumBuilderState, TConfig> {
	/**
	 * Static factory for partial config inference with defaults.
	 */
	static override new(): BasicEnumBuilder<[], DefaultConfig>;
	static override new<const TConfig extends Partial<Config>>(
		config: TConfig,
	): BasicEnumBuilder<[], GetBuilderConfig<TConfig>>;
	static override new<const TConfig extends Partial<Config>>(
		config?: TConfig,
	): BasicEnumBuilder<[], GetBuilderConfig<TConfig>> {
		//@ts-expect-error Inference limitation
		return new BasicEnumBuilder({
			...DefaultConfig,
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
		AddMember<
			TCurrentEnumBuilderState,
			TKey,
			GetNextDefaultValueToUseAsEnumValue<
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
		AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding a computed enum member with greater flexibility than native typescript enums.
	 *
	 * @throws if the key has already been added previously
	 */
	override $<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultValueToUseAsEnumValue<
			TCurrentEnumBuilderState,
			TConfig,
			TKey
		>,
	>(
		callback: (
			enumSoFar: Simplify<FromEntries<TCurrentEnumBuilderState>>,
		) => TKey | readonly [TKey, TValue],
	): BasicEnumBuilder<
		AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	>;
	/** Chainer for adding more enum members with maximum type safety.
	 *
	 * @throws if the key has already been added previously
	 */
	override $<
		TKey extends EnumKey,
		TValue extends EnumValue = GetNextDefaultValueToUseAsEnumValue<
			TCurrentEnumBuilderState,
			TConfig,
			TKey
		>,
	>(
		arg:
			| TKey
			| ((
					enumSoFar: FromEntries<TCurrentEnumBuilderState>,
			  ) => TKey | readonly [TKey, TValue]),
		value?: TValue,
	): BasicEnumBuilder<
		AddMember<TCurrentEnumBuilderState, TKey, TValue, TConfig>,
		TConfig
	> {
		//@ts-expect-error Inference limitation
		return super.$(arg, value);
	}

	override build(): GetShape<
		//@ts-expect-error The simplified type is much more readable
		Simplify<FromEntries<TCurrentEnumBuilderState>>,
		TConfig
	> {
		return BasicEnum.new(this.s, this.c) as never;
	}
}
