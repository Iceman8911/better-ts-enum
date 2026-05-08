import type {
	EnumEntries,
	EnumKeys,
	EnumLike,
	EnumValues,
} from "../../types/enum/enum-class";
import type { ReadonlyDeep } from "type-fest";
import { EnumNs } from "../_shared";
import { MinimalEnum } from "../minimal/minimal-enum";
import { defineProperty, freeze, keys } from "../../utils/object";
import type { BasicEnumNs } from "./_shared";

export class BasicEnum<
	const TEnumShape extends EnumLike,
	const TConfig extends EnumNs.ClassConfig,
> extends MinimalEnum<TEnumShape, TConfig> {
	readonly #size: number;

	/** Namespace for all class methods.
	 *
	 * This is used to prevent collisions with valid enum keys
	 */
	declare readonly $: ReadonlyDeep<EnumNs.Methods<TEnumShape>>;

	private constructor(enumLike: TEnumShape, _config: TConfig) {
		if ("$" in enumLike)
			throw Error("'$' cannot be used as an enum key since it is reserved.");

		super(enumLike, _config);

		// TODO: Consider a less wasteful way to do this. Less allocations and all
		this.#size = keys(this).length;

		const self = this;

		const namespacedMethods: EnumNs.Methods<TEnumShape> = {
			keys: () => self.#keys(),
			entries: () => self.#entries(),
			values: () => self.#values(),
			size: self.#size,
			isKey: (key) => self.#isKey(key),
			isValue: (val) => self.#isValue(val),
			//@ts-expect-error Inference Limitation
			get raw() {
				return { ...self };
			},
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
		const TConfig extends Partial<EnumNs.ClassConfig>,
	>(
		enumLike: TEnumShape,
		config?: TConfig,
	): BasicEnumNs.GetShape<
		TEnumShape,
		EnumNs.MergeConfig<EnumNs.ClassConfig, EnumNs.DefaultClassConfig, TConfig>
	> {
		const resolvedConfig: EnumNs.ClassConfig = {
			...EnumNs.DefaultClassConfig,
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

	#isKey(arg: unknown): arg is EnumNs.Methods<TEnumShape>["infer"]["keys"] {
		return `${arg}` in this && arg !== "$";
	}

	#isValue(arg: unknown): arg is EnumNs.Methods<TEnumShape>["infer"]["values"] {
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
