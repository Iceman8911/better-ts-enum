import type { EnumLike } from "../types/enum/enum-class";

export function removeReverseMappingFromNumericEnum<TEnum extends EnumLike>(
	numericEnum: TEnum,
): TEnum {
	const r = {} as TEnum;

	for (const k in numericEnum)
		if (
			Object.getOwnPropertyDescriptor(numericEnum, k) &&
			(isNaN(+k) || typeof numericEnum[k] !== "string")
		)
			r[k] = numericEnum[k];

	return r as TEnum;
}
