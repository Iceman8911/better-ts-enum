import type { Add } from "ts-arithmetic";

export type _IncrementNumberByOneStage<TNumber extends number> = Add<
	TNumber,
	1
>;

// export type _AssertNonNumericString<TString extends string> = TString extends `${infer R}`
// 	? R extends number ? never : TString
// 	: TString
