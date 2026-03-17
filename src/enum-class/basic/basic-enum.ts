import type { EnumEntries, EnumKeys, EnumLike, EnumValues } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import type { _GetUserEnumConfigAfterApplyingDefaults, _NamespacedMethods } from "../_shared";
import {
	_DEFAULT_BASIC_ENUM_CONFIG,
	type _BasicEnumConfig,
	type _DefaultBasicEnumConfig,
	type _GetBasicEnumShape,
} from "./_shared";

export default class BasicEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends _BasicEnumConfig,
> {
	readonly #size = 0;

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	declare readonly $: ReadonlyDeep<_NamespacedMethods<TEnumShape>>;

	private constructor(enumLike: TEnumShape, config?: Partial<TConfig>) {
		const { freeze }: _BasicEnumConfig = { ..._DEFAULT_BASIC_ENUM_CONFIG, ...config };

		for (const k in enumLike)
			if (
				Object.getOwnPropertyDescriptor(enumLike, k) &&
				(isNaN(+k) || typeof enumLike[k] !== "string")
			) {
				//@ts-expect-error Inference Limitation
				this[k] = enumLike[k];
				this.#size++;
			}

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

		return freeze ? Object.freeze(this) : this;
	}

	/** Instantiates a new BasicEnum.
	 *
	 * This is preferred over `new BasicEnum` since it's more typesafe
	 */
	static new<const TEnumShape extends EnumLike, const TConfig extends Partial<_BasicEnumConfig>>(
		enumLike: TEnumShape,
		config?: TConfig,
	): _GetBasicEnumShape<
		TEnumShape,
		_GetUserEnumConfigAfterApplyingDefaults<_BasicEnumConfig, _DefaultBasicEnumConfig, TConfig>
	> {
		//@ts-expect-error Inference Limitation
		return new BasicEnum(enumLike, config);
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
