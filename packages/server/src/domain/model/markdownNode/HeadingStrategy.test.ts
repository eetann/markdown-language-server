import { Indexer } from "@/infrastructure/indexer/Indexer";
import { CreateIndexUseCase } from "@/usecase/createIndex/CreateIndexUseCase";
import { vol } from "memfs";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("HeadingStrategy", () => {
	const workspaceFolder = "/workspace";
	vol.reset();

	const json = {
		[`${workspaceFolder}/foo.md`]: `\
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## normal
## with [Link](https://example.com)
## with \`inline codeblock\`
`,
	};
	vol.fromJSON(json, workspaceFolder);
	const indexer = new Indexer();

	it("normal", () => {
		const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);

		const headingsDocument = index.getDocument("foo.md");
		expect(headingsDocument.headings.length).toBe(9);
		expect(headingsDocument.headings).toContainEqual(
			expect.objectContaining({
				text: "H1 Heading",
			}),
		);
		expect(headingsDocument.headings).toContainEqual(
			expect.objectContaining({
				text: "with `inline codeblock`",
			}),
		);
	});
});
