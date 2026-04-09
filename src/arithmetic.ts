import type * as TsArithmetic from "ts-arithmetic";

// Helper for addition
export function add<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Add<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a + b;
}

// Helper for subtraction
export function subtract<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Subtract<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a - b;
}

// Helper for multiplication
export function multiply<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Multiply<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a * b;
}

// Helper for division
export function divide<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Divide<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a / b;
}

// Helper for modulo
export function mod<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Mod<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a % b;
}

// Helper for negation
export function negate<A extends number>(a: A): TsArithmetic.Negate<A> {
	// @ts-expect-error: runtime value is not type-checked
	return -a;
}

// Helper for absolute value
export function abs<A extends number>(a: A): TsArithmetic.Abs<A> {
	// @ts-expect-error: runtime value is not type-checked
	return Math.abs(a);
}

// Comparison: eq (===)
export function eq<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Eq<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a === b;
}

// Greater than
export function gt<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Gt<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a > b;
}

// Greater than or equal
export function gte<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.GtOrEq<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a >= b;
}

// Less than
export function lt<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Lt<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a < b;
}

// Less than or equal
export function lte<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.LtOrEq<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a <= b;
}

// Compare (returns -1, 0, 1)
export function compare<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Compare<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return a === b ? 0 : a < b ? -1 : 1;
}

// Min
export function min<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Min<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return Math.min(a, b);
}

// Max
export function max<A extends number, B extends number>(
	a: A,
	b: B,
): TsArithmetic.Max<A, B> {
	// @ts-expect-error: runtime value is not type-checked
	return Math.max(a, b);
}

// IsEven
export function isEven<A extends number>(a: A): TsArithmetic.IsEven<A> {
	// @ts-expect-error: runtime value is not type-checked
	return a % 2 === 0;
}

// IsOdd
export function isOdd<A extends number>(a: A): TsArithmetic.IsOdd<A> {
	// @ts-expect-error: runtime value is not type-checked
	return a % 2 !== 0;
}

// IsInt
export function isInt<A extends number>(a: A): TsArithmetic.IsInt<A> {
	// @ts-expect-error: runtime value is not type-checked
	return Number.isInteger(a);
}

// IsNotInt
export function isNotInt<A extends number>(a: A): TsArithmetic.IsNotInt<A> {
	// @ts-expect-error: runtime value is not type-checked
	return !Number.isInteger(a);
}

// IsPositive
export function isPositive<A extends number>(a: A): TsArithmetic.IsPositive<A> {
	// @ts-expect-error: runtime value is not type-checked
	return a > 0;
}

// IsNegative
export function isNegative<A extends number>(a: A): TsArithmetic.IsNegative<A> {
	// @ts-expect-error: runtime value is not type-checked
	return a < 0;
}

/**
 * Utility for explicit type-level casting.
 * Usage: asType<Add<typeof foo, typeof bar>>(foo + bar)
 */
export function asType<T>(value: unknown): T {
	return value as T;
}
