import type { EnumLike } from "../../types/enum/enum-class";
import type { EnumNs } from "../_shared";
import type { MinimalEnum } from "./minimal-enum";

export namespace MinimalEnumNs {
	export type GetShape<
		TEnumShape extends EnumLike,
		TConfig extends EnumNs.ClassConfig,
	> = MinimalEnum<
		EnumNs.GetNominalOrRegularShape<TEnumShape, TConfig>,
		TConfig
	> &
		EnumNs.GetFrozenOrRegularShape<
			EnumNs.GetNominalOrRegularShape<TEnumShape, TConfig>,
			TConfig
		>;
}
