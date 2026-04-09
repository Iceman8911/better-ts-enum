import type { Writable } from "type-fest";
import type { EnumLike, NominalizeEnumLike } from "../../types/enum/enum-class";
import {
	_DEFAULT_SHARED_ENUM_CLASS_BUILDER_CONFIG,
	_DEFAULT_SHARED_ENUM_CLASS_CONFIG,
	type _DefaultSharedEnumClassBuilderConfig,
	type _DefaultSharedEnumClassConfig,
	type _SharedEnumClassBuilderConfig,
	type _SharedEnumClassConfig,
	type _SharedNamespacedMethods,
} from "../_shared";
import type BasicEnum from "./basic-enum";

type _GetNominalOrRegularEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumClassConfig,
> = TConfig["nominal"] extends ""
	? TEnumShape
	: NominalizeEnumLike<TEnumShape, TConfig["nominal"]>;
type _GetFrozenOrRegularEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumClassConfig,
> = TConfig["freeze"] extends true
	? Readonly<TEnumShape>
	: Writable<TEnumShape>;

export type _GetBasicEnumShape<
	TEnumShape extends EnumLike,
	TConfig extends _BasicEnumClassConfig,
> = BasicEnum<_GetNominalOrRegularEnumShape<TEnumShape, TConfig>, TConfig> &
	_GetFrozenOrRegularEnumShape<
		_GetNominalOrRegularEnumShape<TEnumShape, TConfig>,
		TConfig
	>;

export interface _BasicEnumClassConfig extends _SharedEnumClassConfig {}

export interface _DefaultBasicEnumClassConfig
	extends _BasicEnumClassConfig,
		_DefaultSharedEnumClassConfig {
	readonly freeze: true;
	readonly nominal: "";
}

export const _DEFAULT_BASIC_ENUM_CLASS_CONFIG: _DefaultBasicEnumClassConfig = {
	..._DEFAULT_SHARED_ENUM_CLASS_CONFIG,
};

export interface _BasicEnumClassBuilderConfig
	extends _SharedEnumClassBuilderConfig {}

export interface _DefaultBasicEnumClassBuilderConfig
	extends _BasicEnumClassBuilderConfig,
		_DefaultSharedEnumClassBuilderConfig {
	readonly freeze: true;
	readonly nominal: "";
	readonly valueType: "number";
}

export const _DEFAULT_BASIC_ENUM_CLASS_BUILDER_CONFIG: _DefaultBasicEnumClassBuilderConfig =
	{
		..._DEFAULT_SHARED_ENUM_CLASS_BUILDER_CONFIG,
	};

export interface _BasicEnumNamespacedMethods<TEnumShape extends EnumLike>
	extends _SharedNamespacedMethods<TEnumShape> {}
