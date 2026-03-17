import type { Writable } from "type-fest";
import type { EnumLike, NominalizeEnumLike } from "../../types/enum/enum-class";
import {
	_DEFAULT_SHARED_ENUM_CLASS_CONFIG,
	type _SharedEnumClassConfig,
	type _SharedNamespacedMethods,
} from "../_shared";
import type BasicEnum from "./basic-enum";

type _GetNominalOrRegularEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumConfig,
> = TConfig["nominal"] extends "" ? TEnumShape : NominalizeEnumLike<TEnumShape, TConfig["nominal"]>;
type _GetFrozenOrRegularEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumConfig,
> = TConfig["freeze"] extends true ? Readonly<TEnumShape> : Writable<TEnumShape>;

export type _GetBasicEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumConfig,
> = BasicEnum<_GetNominalOrRegularEnumShape<TEnumShape, TConfig>, TConfig> &
	_GetFrozenOrRegularEnumShape<_GetNominalOrRegularEnumShape<TEnumShape, TConfig>, TConfig>;

export interface _BasicEnumConfig extends _SharedEnumClassConfig {}

export interface _DefaultBasicEnumConfig extends _BasicEnumConfig {
	readonly freeze: true;
	readonly nominal: "";
}

export const _DEFAULT_BASIC_ENUM_CONFIG: _DefaultBasicEnumConfig = {
	..._DEFAULT_SHARED_ENUM_CLASS_CONFIG,
};

export interface _BasicEnumNamespacedMethods<
	TEnumShape extends EnumLike,
> extends _SharedNamespacedMethods<TEnumShape> {}
