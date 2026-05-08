import type { EnumLike } from "../../types/enum/enum-class";
import type { EnumNs } from "../_shared";

import type { BasicEnum } from "./basic-enum";

export namespace BasicEnumNs {
	export type GetShape<
		TEnumShape extends EnumLike,
		TConfig extends EnumNs.Config,
	> = BasicEnum<EnumNs.GetNominalOrRegularShape<TEnumShape, TConfig>, TConfig> &
		EnumNs.GetFrozenOrRegularShape<
			EnumNs.GetNominalOrRegularShape<TEnumShape, TConfig>,
			TConfig
		>;
}
