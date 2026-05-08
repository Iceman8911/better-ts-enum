import type { EnumLike } from "../../types/enum/enum-class";
import type {
	Config,
	GetFrozenOrRegularShape,
	GetNominalOrRegularShape,
} from "../_shared/enum";

import type { BasicEnum } from "./basic-enum";

export type GetShape<
	TEnumShape extends EnumLike,
	TConfig extends Config,
> = BasicEnum<GetNominalOrRegularShape<TEnumShape, TConfig>, TConfig> &
	GetFrozenOrRegularShape<
		GetNominalOrRegularShape<TEnumShape, TConfig>,
		TConfig
	>;
