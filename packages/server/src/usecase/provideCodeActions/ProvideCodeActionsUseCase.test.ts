import { Indexer } from "@/infrastructure/indexer/Indexer";
import type { Range } from "@volar/language-server";
import { vol } from "memfs";
import { describe, expect, it } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CreateIndexUseCase } from "../createIndex/CreateIndexUseCase";
import { ProvideCodeActionsUseCase } from "./ProvideCodeActionsUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("ProvideCodeActions", () => {
	describe("getWikilinkElement", () => {
		const workspaceFolder = "/workspace";
		const uri = `${workspaceFolder}/foo.md`;
		vol.reset();

		const content = `\
# Document Title
## Heading A
foo
## Heading B
bar
`;
		const json = {
			[uri]: content,
		};
		vol.fromJSON(json, workspaceFolder);
		const indexer = new Indexer();
		it("with heading", () => {
			const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);

			const provideCodeActions = new ProvideCodeActionsUseCase(index);
			const textDocument = TextDocument.create(uri, "markdown", 1, content);
			// @foo
			let cursorRange: Range = {
				start: { line: 2, character: 0 },
				end: { line: 2, character: 0 },
			};

			let result = provideCodeActions.getWikilinkElement(
				textDocument,
				cursorRange,
			);
			expect(result).toEqual({
				relativePath: "foo.md",
				headingText: "Heading A",
				title: "Document Title",
			});

			// @## Heading A
			cursorRange = {
				start: { line: 1, character: 0 },
				end: { line: 1, character: 0 },
			};
			result = provideCodeActions.getWikilinkElement(textDocument, cursorRange);
			expect(result).toEqual({
				relativePath: "foo.md",
				headingText: "Heading A",
				title: "Document Title",
			});
		});

		it("without heading", () => {
			const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);

			const provideCodeActions = new ProvideCodeActionsUseCase(index);
			const textDocument = TextDocument.create(uri, "markdown", 1, content);
			// @foo
			const cursorRange = {
				start: { line: 0, character: 0 },
				end: { line: 0, character: 0 },
			};
			const result = provideCodeActions.getWikilinkElement(
				textDocument,
				cursorRange,
			);
			expect(result).toEqual({
				relativePath: "foo.md",
				headingText: "",
				title: "Document Title",
			});
		});
	});
});
