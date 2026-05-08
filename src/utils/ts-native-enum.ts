import type { EnumLike } from "../types/enum/enum-class";
import { hasOwn } from "./object";

export function copyEnumLikeEntriesWithoutReverseMapping<
	TEnum extends EnumLike,
>(numericEnum: TEnum, objectToCopyTo: object = {}) {
	for (const k in numericEnum)
		if (
			hasOwn(numericEnum, k) &&
			(Number.isNaN(+k) || typeof numericEnum[k] !== "string")
		)
			//@ts-expect-error inference limitation
			objectToCopyTo[k] = numericEnum[k];

	return objectToCopyTo;
}
