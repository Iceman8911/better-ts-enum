import type { ReadonlyDeep } from "type-fest";
import type {
	EnumEntries,
	EnumKeys,
	EnumLike,
	EnumValues,
} from "../../types/enum/enum-class";
import { defineProperty, freeze, keys } from "../../utils/object";
import {
	type Config,
	DefaultConfig,
	type MergeConfig,
	type Methods,
} from "../_shared/enum";
import { MinimalEnum } from "../minimal/minimal-enum";
import type { GetShape } from "./_shared";

export class BasicEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends Config,
> extends MinimalEnum<TEnumShape, TConfig> {
	readonly #size: number;

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	declare readonly $: ReadonlyDeep<Methods<TEnumShape>>;

	private constructor(enumLike: TEnumShape, _config: TConfig) {
		super(enumLike, _config);

		// TODO: Consider a less wasteful way to do this. Less allocations and all
		this.#size = keys(this).length;

		const self = this;

		const namespacedMethods: Methods<TEnumShape> = {
			entries: () => self.#entries(),
			isKey: (key) => self.#isKey(key),
			isValue: (val) => self.#isValue(val),
			keys: () => self.#keys(),
			//@ts-expect-error Inference Limitation
			get raw() {
				return { ...self };
			},
			size: self.#size,
			values: () => self.#values(),
		};

		// `defineProperty` is used to explictly make this readonly and non-enumerable/configurable/writable
		defineProperty(this, "$", {
			value: namespacedMethods,
		});
	}

	/** Instantiates a new BasicEnum.
	 *
	 * This is preferred over `new BasicEnum` since it's more typesafe
	 */
	static override new<
		const TEnumShape extends EnumLike,
		const TConfig extends Partial<Config>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): GetShape<TEnumShape, MergeConfig<Config, DefaultConfig, TConfig>> {
		const resolvedConfig: Config = {
			...DefaultConfig,
			...config,
		};

		const instance = new BasicEnum(enumLike, resolvedConfig);

		//@ts-expect-error Inference Limitation
		return resolvedConfig.freeze ? freeze(instance) : instance;
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
		for (const key of this.#keys()) {
			//@ts-expect-error Inference Limitation
			yield this[key];
		}
	}

	//@ts-expect-error Inference Limitation
	*#entries(): EnumEntries<TEnumShape> {
		for (const key of this.#keys()) {
			//@ts-expect-error Inference Limitation
			yield [key, this[key]];
		}
	}

	#isKey(arg: unknown): arg is Methods<TEnumShape>["infer"]["keys"] {
		return `${arg}` in this && arg !== "$";
	}

	#isValue(arg: unknown): arg is Methods<TEnumShape>["infer"]["values"] {
		let isPresent = false;

		for (const value of this.#values()) {
			if (value === arg) {
				isPresent = true;
				break;
			}
		}

		return isPresent;
	}

	[Symbol.iterator](): EnumEntries<TEnumShape> {
		return this.#entries();
	}
}
