import type { EnumLike } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import { EnumClass } from "../_shared";
import { freeze, hasOwn } from "../../utils/object";
import type { MinimalEnumClass } from "./_shared";

type NamespacedMethods<TEnumShape extends EnumLike> = Pick<
	EnumClass.Methods<TEnumShape>,
	"infer"
>;

export class MinimalEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends EnumClass.ClassConfig,
> {
	declare readonly $: ReadonlyDeep<NamespacedMethods<TEnumShape>>;

	protected constructor(enumLike: TEnumShape, _config: TConfig) {
		for (const k in enumLike)
			if (
				hasOwn(enumLike, k) &&
				(Number.isNaN(+k) || typeof enumLike[k] !== "string")
			) {
				//@ts-expect-error Inference limitation
				this[k] = enumLike[k];
			}
	}

	static new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<EnumClass.ClassConfig>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): MinimalEnumClass.GetShape<
		TEnumShape,
		EnumClass.MergeConfig<
			EnumClass.ClassConfig,
			EnumClass.DefaultClassConfig,
			TConfig
		>
	> {
		const resolvedConfig: EnumClass.ClassConfig = {
			...EnumClass.DefaultClassConfig,
			...config,
		};

		const instance = new MinimalEnum(enumLike, resolvedConfig);

		//@ts-expect-error Inference limitation
		return resolvedConfig.freeze ? freeze(instance) : instance;
	}
}
