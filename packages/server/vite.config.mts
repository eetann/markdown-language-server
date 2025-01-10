import { type UserConfig, defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import type { InlineConfig } from "vitest/node";

export default defineConfig({
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: 3000,
	},
	resolve: {
		alias: {
			"@/": `${__dirname}/src/`,
		},
	},
	plugins: [
		...VitePluginNode({
			adapter: "express",
			appPath: "./src/index.ts",
			exportName: "viteNodeApp",
			initAppOnBoot: false,
			tsCompiler: "esbuild",
		}),
	],
	test: {
		globals: true,
	},
} as UserConfig & { test: InlineConfig });
