import { describe, expectTypeOf, it } from "bun:test";
import type { _IncrementNumberByOneStage } from "./_utils";

describe("_IncrementNumberByOneStage", () => {
	it("should increment positive integers", () => {
		expectTypeOf<_IncrementNumberByOneStage<0>>().toEqualTypeOf<1>();
		expectTypeOf<_IncrementNumberByOneStage<1>>().toEqualTypeOf<2>();
		expectTypeOf<_IncrementNumberByOneStage<2>>().toEqualTypeOf<3>();
		expectTypeOf<_IncrementNumberByOneStage<41>>().toEqualTypeOf<42>();
	});

	it("should increment positive floats", () => {
		expectTypeOf<_IncrementNumberByOneStage<2.3>>().toEqualTypeOf<3.3>();
		expectTypeOf<_IncrementNumberByOneStage<0.5>>().toEqualTypeOf<1.5>();
		expectTypeOf<_IncrementNumberByOneStage<1.25>>().toEqualTypeOf<2.25>();
	});

	it("should increment negative integers", () => {
		expectTypeOf<_IncrementNumberByOneStage<-1>>().toEqualTypeOf<0>();
		expectTypeOf<_IncrementNumberByOneStage<-2>>().toEqualTypeOf<-1>();
		expectTypeOf<_IncrementNumberByOneStage<-42>>().toEqualTypeOf<-41>();
	});

	it("should increment negative floats", () => {
		expectTypeOf<_IncrementNumberByOneStage<-2.3>>().toEqualTypeOf<-1.3>();
		expectTypeOf<_IncrementNumberByOneStage<-0.5>>().toEqualTypeOf<0.5>();
		expectTypeOf<_IncrementNumberByOneStage<-1.25>>().toEqualTypeOf<-0.25>();
	});

	it("should not affect 'out-of-range' numbers like Infinity, and NaN", () => {
		expectTypeOf<
			_IncrementNumberByOneStage<typeof Infinity>
		>().toEqualTypeOf<number>();
		expectTypeOf<
			_IncrementNumberByOneStage<typeof NaN>
		>().toEqualTypeOf<number>();
	});
});
