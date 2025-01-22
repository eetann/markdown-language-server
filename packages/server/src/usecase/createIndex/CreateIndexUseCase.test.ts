import { Indexer } from "@/infrastructure/indexer/Indexer";
import { vol } from "memfs";
import { CreateIndexUseCase } from "./CreateIndexUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("CreateIndexUseCase", () => {
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

## List
### Bullet List
- This is a bullet list
- The much-anticipated bullet list
    - So happy to have bullets
    - The long-awaited nesting
        - The nest of the nest, a dream come true

* List with asterisks
- List with hyphens
+ List with pluses
`,
		[`${workspaceFolder}/no-h1.md`]: `\
There is no h1, so this is the title
This is the body text
`,
	};
	vol.fromJSON(json, workspaceFolder);
	const indexer = new Indexer();

	it("normal", () => {
		const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);

		const doc = index.getDocument("foo.md");
		expect(doc).not.toBeUndefined();
		expect(doc.headings.length).not.toBe(0);
		expect(doc.title).toBe("H1 Heading");

		expect(index.documents["no-h1.md"].title).toBe(
			"There is no h1, so this is the title",
		);
	});
});
