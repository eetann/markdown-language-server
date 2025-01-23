import { Indexer } from "@/infrastructure/indexer/Indexer";
import { CreateIndexUseCase } from "@/usecase/createIndex/CreateIndexUseCase";
import { vol } from "memfs";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("WikilinkStrategy", () => {
	const workspaceFolder = "/workspace";
	vol.reset();

	const json = {
		[`${workspaceFolder}/foo.md`]: `\
# H1 Heading
[[bar.md]]
[[bar.md#bar-h2]]
`,
		[`${workspaceFolder}/bar.md`]: `\
# bar-title
[[foo.md|foooo]]
`,
	};
	vol.fromJSON(json, workspaceFolder);
	const indexer = new Indexer();

	it("normal", () => {
		const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);

		const fooDoc = index.getDocument("foo.md");
		expect(fooDoc.internalLinks.length).toBe(2);
		expect(fooDoc.internalLinks[0].relativePath).toEqual("bar.md");
		// zero-based index
		expect(fooDoc.internalLinks[0].linkNodeRage).toEqual({
			start: { line: 1, character: 0 },
			end: { line: 1, character: 10 },
		});
		expect(fooDoc.internalLinks[1].relativePath).toEqual("bar.md");
		expect(fooDoc.internalLinks[1].linkNodeRage).toEqual({
			start: { line: 2, character: 0 },
			end: { line: 2, character: 17 },
		});

		const barDoc = index.getDocument("bar.md");
		expect(barDoc.internalLinks.length).toBe(1);
		expect(barDoc.internalLinks[0].relativePath).toEqual("foo.md");
		expect(barDoc.internalLinks[0].linkNodeRage).toEqual({
			start: { line: 1, character: 0 },
			end: { line: 1, character: 16 },
		});
	});
});
