import type { EnumLike } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import { EnumNs } from "../_shared";
import { freeze } from "../../utils/object";
import type { MinimalEnumNs } from "./_shared";
import { copyEnumLikeEntriesWithoutReverseMapping } from "../../utils/ts-native-enum";

type NamespacedMethods<TEnumShape extends EnumLike> = Pick<
	EnumNs.Methods<TEnumShape>,
	"infer"
>;

export class MinimalEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends EnumNs.ClassConfig,
> {
	declare readonly $: ReadonlyDeep<NamespacedMethods<TEnumShape>>;

	protected constructor(enumLike: TEnumShape, _config: TConfig) {
		copyEnumLikeEntriesWithoutReverseMapping(enumLike, this);
	}

	static new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<EnumNs.ClassConfig>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): MinimalEnumNs.GetShape<
		TEnumShape,
		EnumNs.MergeConfig<EnumNs.ClassConfig, EnumNs.DefaultClassConfig, TConfig>
	> {
		const resolvedConfig: EnumNs.ClassConfig = {
			...EnumNs.DefaultClassConfig,
			...config,
		};

		const instance = new MinimalEnum(enumLike, resolvedConfig);

		//@ts-expect-error Inference limitation
		return resolvedConfig.freeze ? freeze(instance) : instance;
	}
}
