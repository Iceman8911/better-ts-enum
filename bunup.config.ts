import { defineConfig } from "bunup";

export default defineConfig([
	{
		entry: "src/index.ts",
		name: "betterenum",
		format: ["esm", "cjs"],
	},
	{
		entry: "src/arithmetic.ts",
		name: "arithmetic",
		format: ["esm", "cjs"],
		outDir: "dist/arithmetic",
	},
]);
