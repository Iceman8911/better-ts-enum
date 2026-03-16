import { defineConfig } from "bunup";

export default defineConfig({
	entry: "src/*.ts",
	format: ["esm", "cjs"],
	exports: true,
	packages: "external",
});
