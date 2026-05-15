import type { Add } from "ts-arithmetic";

// Fast-path mapping for common small numeric literals to avoid invoking the
// heavier `ts-arithmetic` machinery for the typical enum auto-increment use-case.
// Falls back to `Add<TNumber, 1>` for numbers outside the mapped range.
export type _IncrementNumberByOneStage<TNumber extends number> =
	TNumber extends 0
		? 1
		: TNumber extends 1
			? 2
			: TNumber extends 2
				? 3
				: TNumber extends 3
					? 4
					: TNumber extends 4
						? 5
						: TNumber extends 5
							? 6
							: TNumber extends 6
								? 7
								: TNumber extends 7
									? 8
									: TNumber extends 8
										? 9
										: TNumber extends 9
											? 10
											: TNumber extends 10
												? 11
												: TNumber extends 11
													? 12
													: TNumber extends 12
														? 13
														: TNumber extends 13
															? 14
															: TNumber extends 14
																? 15
																: TNumber extends 15
																	? 16
																	: TNumber extends 16
																		? 17
																		: TNumber extends 17
																			? 18
																			: TNumber extends 18
																				? 19
																				: TNumber extends 19
																					? 20
																					: Add<TNumber, 1>;

// export type _AssertNonNumericString<TString extends string> = TString extends `${infer R}`
// 	? R extends number ? never : TString
// 	: TString
