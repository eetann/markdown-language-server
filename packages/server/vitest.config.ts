import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@/": `${__dirname}/src/`,
		},
	},
	test: {
		globals: true,
	},
});
