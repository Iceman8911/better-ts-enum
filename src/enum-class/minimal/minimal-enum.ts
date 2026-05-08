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
	const TConfig extends EnumNs.Config,
> {
	declare readonly $: ReadonlyDeep<NamespacedMethods<TEnumShape>>;

	protected constructor(enumLike: TEnumShape, _config: TConfig) {
		copyEnumLikeEntriesWithoutReverseMapping(enumLike, this);
	}

	static new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<EnumNs.Config>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): MinimalEnumNs.GetShape<
		TEnumShape,
		EnumNs.MergeConfig<EnumNs.Config, EnumNs.DefaultConfig, TConfig>
	> {
		const resolvedConfig: EnumNs.Config = {
			...EnumNs.DefaultConfig,
			...config,
		};

		const instance = new MinimalEnum(enumLike, resolvedConfig);

		//@ts-expect-error Inference limitation
		return resolvedConfig.freeze ? freeze(instance) : instance;
	}
}
