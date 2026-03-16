import type { EnumEntries, EnumKeys, EnumLike, EnumValues } from "../../types/enum/enum-class";
import type { ReadonlyDeep, Simplify, UnionToTuple } from "type-fest";
import type { _NamespacedMethods } from "../_shared";
import type { _GetBasicEnumShape } from "./_shared";

export default class BasicEnum<const TEnumShape extends EnumLike> {
	readonly #size: number;

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	declare readonly $: ReadonlyDeep<_NamespacedMethods<TEnumShape>>;

	private constructor(enumLike: TEnumShape) {
		Object.assign(this, enumLike);

		this.#size = Object.keys(this).length;

		const self = this;

		const namespacedMethods: _NamespacedMethods<TEnumShape> = {
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
			//@ts-expect-error Typescript Limitation
			isKey(arg) {
				return `${arg}` in self && arg !== "$";
			},
			//@ts-expect-error Typescript Limitation
			isValue(arg) {
				let isPresent = false;

				for (const value of self.#values()) {
					if (value === arg) {
						isPresent = true;
						break;
					}
				}

				return isPresent;
			},
		};

		Object.defineProperty(this, "$", {
			value: namespacedMethods,
			enumerable: false,
			configurable: true,
			writable: false,
		});

		return Object.freeze(this) as this;
	}

	/** Instantiates a new BasicEnum.
	 *
	 * This is preferred over `new BasicEnum` since it's more typesafe
	 */
	static new<const TEnumShape extends EnumLike>(
		enumLike: TEnumShape,
	): _GetBasicEnumShape<TEnumShape> {
		return new BasicEnum(enumLike) as _GetBasicEnumShape<TEnumShape>;
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
}
