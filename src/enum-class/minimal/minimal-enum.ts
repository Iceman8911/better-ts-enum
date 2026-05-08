import type { EnumLike } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import { EnumClass } from "../_shared";
import { freeze } from "../../utils/object";
import type { MinimalEnumClass } from "./_shared";
import { copyEnumLikeEntriesWithoutReverseMapping } from "../../utils/ts-native-enum";

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
		copyEnumLikeEntriesWithoutReverseMapping(enumLike, this);
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
