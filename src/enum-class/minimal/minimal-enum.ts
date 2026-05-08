import type { EnumLike } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import {
	DefaultConfig,
	type Config,
	type MergeConfig,
	type Methods,
} from "../_shared/enum";
import { freeze } from "../../utils/object";
import type { GetShape } from "./_shared";
import { copyEnumLikeEntriesWithoutReverseMapping } from "../../utils/ts-native-enum";

type NamespacedMethods<TEnumShape extends EnumLike> = Pick<
	Methods<TEnumShape>,
	"infer"
>;

export class MinimalEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends Config,
> {
	declare readonly $: ReadonlyDeep<NamespacedMethods<TEnumShape>>;

	protected constructor(enumLike: TEnumShape, _config: TConfig) {
		copyEnumLikeEntriesWithoutReverseMapping(enumLike, this);
	}

	static new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<Config>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): GetShape<TEnumShape, MergeConfig<Config, DefaultConfig, TConfig>> {
		const resolvedConfig: Config = {
			...DefaultConfig,
			...config,
		};

		const instance = new MinimalEnum(enumLike, resolvedConfig);

		//@ts-expect-error Inference limitation
		return resolvedConfig.freeze ? freeze(instance) : instance;
	}
}
