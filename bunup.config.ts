import { defineConfig } from "bunup";

export default defineConfig([
	{
		entry: "src/basic-enum.ts",
		outDir: "dist/basic-enum",
		name: "basic-enum",
		format: ["esm", "cjs"],
	},
	{
		entry: "src/basic-enum.ts",
		outDir: "dist/min/basic-enum",
		name: "min/basic-enum",
		format: ["esm", "cjs"],
		minify: true,
	},
	{
		entry: "src/arithmetic.ts",
		name: "arithmetic",
		format: ["esm", "cjs"],
		outDir: "dist/arithmetic",
	},
	{
		entry: "src/arithmetic.ts",
		name: "min/arithmetic",
		format: ["esm", "cjs"],
		outDir: "dist/min/arithmetic",
		minify: true,
	},
]);
