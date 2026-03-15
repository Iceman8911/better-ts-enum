import { describe, expectTypeOf, it } from "bun:test";
import BasicEnum from "./basic-enum";
import type { Add } from "ts-arithmetic";
import { add } from "../arithmetic";

describe("BasicEnum type inference", () => {
	it("infers auto-incrementing numeric values from string keys", () => {
		const e = BasicEnum.new("foo", "bar", "baz");

		expectTypeOf(e.foo).toEqualTypeOf<0>();
		expectTypeOf(e.bar).toEqualTypeOf<1>();
		expectTypeOf(e.baz).toEqualTypeOf<2>();
	});

	it("infers explicit numeric start and continues incrementing", () => {
		const e = BasicEnum.new(["foo", 1], "bar", "baz");

		expectTypeOf(e.foo).toEqualTypeOf<1>();
		expectTypeOf(e.bar).toEqualTypeOf<2>();
		expectTypeOf(e.baz).toEqualTypeOf<3>();
	});

	it("infers explicit numeric overrides and restarts incrementing after them", () => {
		const e = BasicEnum.new(["foo", 1], "bar", ["baz", -32.5], "bob");

		expectTypeOf(e.foo).toEqualTypeOf<1>();
		expectTypeOf(e.bar).toEqualTypeOf<2>();
		expectTypeOf(e.baz).toEqualTypeOf<-32.5>();
		expectTypeOf(e.bob).toEqualTypeOf<-31.5>();
	});

	it("infers computed entries using the enum-so-far", () => {
		const e = BasicEnum.new(
			["foo", 2],
			"bar",
			({ foo, bar }) => {
				expectTypeOf(foo).toEqualTypeOf<2>();
				expectTypeOf(bar).toEqualTypeOf<3>();

				return ["baz", add(foo, bar)] as const;
			},
			({ baz }) => {
				expectTypeOf(baz).toEqualTypeOf<5>();

				return ["bob", 6] as const;
			},
		);

		expectTypeOf(e.foo).toEqualTypeOf<2>();
		expectTypeOf(e.bar).toEqualTypeOf<3>();
		expectTypeOf(e.baz).toEqualTypeOf<5>();
		expectTypeOf(e.bob).toEqualTypeOf<6>();
	});

	it("infers string-valued entries and keeps auto numbering independent", () => {
		const e = BasicEnum.new(["foo", "1"], "bar", ["baz", "baz"], "bob");

		expectTypeOf(e.foo).toEqualTypeOf<"1">();
		expectTypeOf(e.bar).toEqualTypeOf<0>();
		expectTypeOf(e.baz).toEqualTypeOf<"baz">();
		expectTypeOf(e.bob).toEqualTypeOf<1>();
	});
});
