import type { EnumLike } from "../../types/enum/enum-class";
import type { _SharedEnumClassConfig } from "../_shared";
import type BasicEnum from "./basic-enum";

export type _GetBasicEnumShape<TEnumShape extends EnumLike> = BasicEnum<TEnumShape> &
	Readonly<TEnumShape>;

export interface _BasicEnumConfig extends _SharedEnumClassConfig {}
