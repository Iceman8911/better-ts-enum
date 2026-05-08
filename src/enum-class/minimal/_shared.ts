import type { EnumLike } from "../../types/enum/enum-class";
import type { EnumClass } from "../_shared";
import type { MinimalEnum } from "./minimal-enum";

export namespace MinimalEnumClass {
	export type GetShape<
		TEnumShape extends EnumLike,
		TConfig extends EnumClass.ClassConfig,
	> = MinimalEnum<
		EnumClass.GetNominalOrRegularShape<TEnumShape, TConfig>,
		TConfig
	> &
		EnumClass.GetFrozenOrRegularShape<
			EnumClass.GetNominalOrRegularShape<TEnumShape, TConfig>,
			TConfig
		>;
}
