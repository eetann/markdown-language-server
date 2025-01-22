import { Indexer } from "@/infrastructure/indexer/Indexer";
import { Range } from "@volar/language-server";
import { vol } from "memfs";
import { describe, expect, it } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CreateIndexUseCase } from "../createIndex/CreateIndexUseCase";
import { ProvideReferencesUseCase } from "./ProvideReferencesUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("ProvideReferences", () => {
	describe("getWikilinkElement", () => {
		const workspaceFolder = "/workspace";
		vol.reset();

		const fooContent = `\
# H1 Heading
[[bar.md]]
[[bar.md#bar-h2]]
`;
		const barContent = `\
# bar-title
[[foo.md|foooo]]
`;
		const json = {
			[`${workspaceFolder}/foo.md`]: fooContent,
			[`${workspaceFolder}/bar.md`]: barContent,
		};
		vol.fromJSON(json, workspaceFolder);
		const indexer = new Indexer();
		const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);
		const useCase = new ProvideReferencesUseCase(index);

		it("normal", () => {
			const textDocument = TextDocument.create(
				`${workspaceFolder}/foo.md`,
				"markdown",
				1,
				fooContent,
			);

			const locations = useCase.execute(
				textDocument,
				{ line: 0, character: 0 },
				{
					includeDeclaration: false,
				},
				undefined,
			);
			// @ts-ignore
			expect(locations.length).toBe(1);
			expect(locations[0]).toEqual({
				uri: `${workspaceFolder}/bar.md`,
				range: Range.create(1, 0, 1, 16),
			});
		});
	});
});
