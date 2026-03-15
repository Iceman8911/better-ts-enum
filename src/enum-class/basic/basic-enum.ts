import type { EnumEntries, EnumKeys, EnumLike, EnumValues } from "../../types/enum/enum-class";
import type { Simplify, UnionToTuple } from "type-fest";

interface NamespacedMethods<TEnumShape extends EnumLike> {
	keys(): EnumKeys<TEnumShape>;
	values(): EnumValues<TEnumShape>;
	entries(): EnumEntries<TEnumShape>;
	size: UnionToTuple<keyof TEnumShape>["length"];

	/** Solely for inferring the types of the enum.
	 *
	 * In truth, this is actually `undefined`
	 */
	infer: {
		keys: Simplify<keyof TEnumShape>;
		values: Simplify<TEnumShape[keyof TEnumShape]>;
	};
}


export default class BasicEnum<const TEnumShape extends EnumLike> {
	readonly #size: number;

	private constructor(enumLike: TEnumShape) {
		Object.assign(this, enumLike);

		this.#size = Object.keys(this).length;

		return Object.freeze(this) as this;
	}

	/** Instantiates a new BasicEnum.
	 *
	 * This is preferred over `new BasicEnum` since it's more typesafe
	 */
	static new<const TEnumShape extends EnumLike>(
		enumLike: TEnumShape,
	): BasicEnum<TEnumShape> & Readonly<TEnumShape> {
		return new BasicEnum(enumLike) as BasicEnum<TEnumShape> & Readonly<TEnumShape>;
	}

	//@ts-expect-error Inference Limitation
	*#keys(): EnumKeys<TEnumShape> {
		let key: keyof TEnumShape;

		for (key in this) {
			yield key;
		}
	}

	//@ts-expect-error Inference Limitation
	*#values(): EnumValues<TEnumShape> {
		let key: keyof TEnumShape;

		for (key in this) {
			//@ts-expect-error Inference Limitation
			yield this[key];
		}
	}

	//@ts-expect-error Inference Limitation
	*#entries(): EnumEntries<TEnumShape> {
		let key: keyof TEnumShape;

		for (key in this) {
			//@ts-expect-error Inference Limitation
			yield [key, this[key]];
		}
	}

	[Symbol.iterator](): EnumEntries<TEnumShape> {
		return this.#entries();
	}

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	get $(): NamespacedMethods<TEnumShape> {
		const self = this;

		//@ts-expect-error Inference Limitation
		return {
			keys() {
				return self.#keys();
			},
			entries() {
				return self.#entries();
			},
			values() {
				return self.#values();
			},
			size: self.#size,
		};
	}
}
