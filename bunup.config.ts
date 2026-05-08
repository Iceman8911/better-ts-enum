import { defineConfig } from "bunup";

export default defineConfig([
	{
		name: "bundler",
		entry: "src/*.ts",
		format: ["esm", "cjs"],
		exports: true,
		packages: "bundle",
		dts: { resolve: true, splitting: true, inferTypes: true },
		report: { brotli: true, gzip: true },
	},
	{
		name: "browser",
		entry: "src/*.ts",
		format: "esm",
		outDir: "dist/min",
		packages: "bundle",
		sourcemap: "linked",
		target: "browser",
		minify: true,
		clean: false,
		dts: { resolve: true, splitting: true, inferTypes: true },
		report: { brotli: true, gzip: true },
	},
]);
