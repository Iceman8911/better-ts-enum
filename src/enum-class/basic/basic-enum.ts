import type { EnumEntries, EnumKeys, EnumLike, EnumValues } from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import type { _GetUserEnumConfigAfterApplyingDefaults } from "../_shared";
import {
	_DEFAULT_BASIC_ENUM_CLASS_CONFIG,
	type _BasicEnumClassConfig,
	type _BasicEnumNamespacedMethods,
	type _DefaultBasicEnumClassConfig,
	type _GetBasicEnumShape,
} from "./_shared";

export default class BasicEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends _BasicEnumClassConfig,
> {
	readonly #size = 0;

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	declare readonly $: ReadonlyDeep<_BasicEnumNamespacedMethods<TEnumShape>>;

	private constructor(enumLike: TEnumShape, config?: Partial<TConfig>) {
		const { freeze }: _BasicEnumClassConfig = { ..._DEFAULT_BASIC_ENUM_CLASS_CONFIG, ...config };

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

		const namespacedMethods: _BasicEnumNamespacedMethods<TEnumShape> = {
			keys: self.#keys.bind(self),
			entries: self.#entries.bind(self),
			values: self.#values.bind(self),
			size: self.#size,
			isKey: self.#isKey.bind(self),
			isValue: self.#isValue.bind(self),
			//@ts-expect-error Inference Limitation
			get infer() {
				return self.#infer;
			},
			//@ts-expect-error Inference Limitation
			get raw() {
				return { ...self };
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
	static new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<_BasicEnumClassConfig>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): _GetBasicEnumShape<
		TEnumShape,
		_GetUserEnumConfigAfterApplyingDefaults<
			_BasicEnumClassConfig,
			_DefaultBasicEnumClassConfig,
			TConfig
		>
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

	#isKey(arg: unknown): arg is _BasicEnumNamespacedMethods<TEnumShape>["infer"]["keys"] {
		return `${arg}` in self && arg !== "$";
	}

	#isValue(arg: unknown): arg is _BasicEnumNamespacedMethods<TEnumShape>["infer"]["values"] {
		let isPresent = false;

		for (const value of this.#values()) {
			if (value === arg) {
				isPresent = true;
				break;
			}
		}

		return isPresent;
	}

	get #infer() {
		throw Error("`this.#infer` is a type-only property. Do not call it in runtime code.");
	}

	[Symbol.iterator](): EnumEntries<TEnumShape> {
		return this.#entries();
	}
}
