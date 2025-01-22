import process from "node:process";
import esbuild from "esbuild";

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	entryPoints: ["src/index.ts"],
	bundle: true,
	format: "cjs",
	target: "ESNext",
	logLevel: "info",
	sourcemap: !prod,
	platform: "node",
	treeShaking: true,
	outfile: "dist/index.cjs",
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
