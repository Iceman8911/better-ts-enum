import { defineConfig } from "bunup";

export default defineConfig([
	{
		entry: "src/basic-enum.ts",
		outDir: "dist/basic-enum",
		name: "basic-enum",
		format: ["esm", "cjs"],
	},
	{
		entry: "src/arithmetic.ts",
		name: "arithmetic",
		format: ["esm", "cjs"],
		outDir: "dist/arithmetic",
	},
]);
