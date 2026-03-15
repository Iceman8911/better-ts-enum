import type { EnumValue } from "../types/enum/enum-entry";
import type { EnumComputedArg, EnumConstructorArg } from "../types/enum/enum-class-constructor";
import type { InferEnumFromConstructorArgs } from "../types/enum/enum-class-constructor";

type EnumShape = Record<string, EnumValue>;

type Step<TEnumSoFar extends EnumShape> = EnumConstructorArg<TEnumSoFar>;
type AnyStep = Step<Record<string, EnumValue>>;

type NextEnum<TArgs extends readonly unknown[]> = InferEnumFromConstructorArgs<TArgs>;

function isEntryArg(value: unknown): value is readonly [string, EnumValue] {
	return (
		Array.isArray(value) &&
		value.length === 2 &&
		typeof value[0] === "string" &&
		(typeof value[1] === "string" || typeof value[1] === "number")
	);
}

function isComputedArg(value: unknown): value is EnumComputedArg<Record<string, EnumValue>> {
	return typeof value === "function";
}

function resolveArg(arg: AnyStep, enumSoFar: EnumShape): string | readonly [string, EnumValue] {
	if (isComputedArg(arg)) return arg(enumSoFar);
	return arg as string | readonly [string, EnumValue];
}

export default class BasicEnum<const TArgs extends readonly AnyStep[] = readonly AnyStep[]> {
	static new(): {};

	static new<const A0 extends Step<{}>>(a0: A0): NextEnum<[A0]>;

	static new<const A0 extends Step<{}>, const A1 extends Step<NextEnum<[A0]>>>(
		a0: A0,
		a1: A1,
	): NextEnum<[A0, A1]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
	>(a0: A0, a1: A1, a2: A2): NextEnum<[A0, A1, A2]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
	>(a0: A0, a1: A1, a2: A2, a3: A3): NextEnum<[A0, A1, A2, A3]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
	>(a0: A0, a1: A1, a2: A2, a3: A3, a4: A4): NextEnum<[A0, A1, A2, A3, A4]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
		const A5 extends Step<NextEnum<[A0, A1, A2, A3, A4]>>,
	>(a0: A0, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): NextEnum<[A0, A1, A2, A3, A4, A5]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
		const A5 extends Step<NextEnum<[A0, A1, A2, A3, A4]>>,
		const A6 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5]>>,
	>(a0: A0, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): NextEnum<[A0, A1, A2, A3, A4, A5, A6]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
		const A5 extends Step<NextEnum<[A0, A1, A2, A3, A4]>>,
		const A6 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5]>>,
		const A7 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6]>>,
	>(
		a0: A0,
		a1: A1,
		a2: A2,
		a3: A3,
		a4: A4,
		a5: A5,
		a6: A6,
		a7: A7,
	): NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
		const A5 extends Step<NextEnum<[A0, A1, A2, A3, A4]>>,
		const A6 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5]>>,
		const A7 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6]>>,
		const A8 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7]>>,
	>(
		a0: A0,
		a1: A1,
		a2: A2,
		a3: A3,
		a4: A4,
		a5: A5,
		a6: A6,
		a7: A7,
		a8: A8,
	): NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7, A8]>;

	static new<
		const A0 extends Step<{}>,
		const A1 extends Step<NextEnum<[A0]>>,
		const A2 extends Step<NextEnum<[A0, A1]>>,
		const A3 extends Step<NextEnum<[A0, A1, A2]>>,
		const A4 extends Step<NextEnum<[A0, A1, A2, A3]>>,
		const A5 extends Step<NextEnum<[A0, A1, A2, A3, A4]>>,
		const A6 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5]>>,
		const A7 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6]>>,
		const A8 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7]>>,
		const A9 extends Step<NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7, A8]>>,
	>(
		a0: A0,
		a1: A1,
		a2: A2,
		a3: A3,
		a4: A4,
		a5: A5,
		a6: A6,
		a7: A7,
		a8: A8,
		a9: A9,
	): NextEnum<[A0, A1, A2, A3, A4, A5, A6, A7, A8, A9]>;

	static new(...args: readonly AnyStep[]): Record<string, EnumValue> {
		return new BasicEnum(...args) as unknown as Record<string, EnumValue>;
	}

	constructor(...args: TArgs) {
		const out: EnumShape = {};
		let nextAuto = 0;

		for (const raw of args as unknown as readonly AnyStep[]) {
			const resolved = resolveArg(raw, out);

			if (typeof resolved === "string") {
				out[resolved] = nextAuto;
				nextAuto += 1;
				continue;
			}

			if (isEntryArg(resolved)) {
				const [key, value] = resolved;
				out[key] = value;

				if (typeof value === "number" && Number.isFinite(value)) {
					nextAuto = value + 1;
				}

				continue;
			}

			throw new TypeError("Invalid enum constructor argument.");
		}

		Object.assign(this, out);
	}
}
