import { Indexer } from "@/infrastructure/indexer/Indexer";
import { vol } from "memfs";
import {
	TextDocument,
	type Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { CreateIndexUseCase } from "../createIndex/CreateIndexUseCase";
import { ProvideCompletionItemsUseCase } from "./ProvideCompletionItemsUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("ProvideCompletionItemsUseCase.isShouldProvide", () => {
	const workspaceFolder = "/workspace";
	const fooContent = `\
# foo-h1
## foo-h2
`;

	vol.reset();
	const json = {
		[`${workspaceFolder}/foo.md`]: fooContent,
	};
	vol.fromJSON(json, workspaceFolder);

	const indexer = new Indexer();
	const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);
	const provider = new ProvideCompletionItemsUseCase(index);

	it("provide after [[", () => {
		const textDocument = TextDocument.create(
			`file://${workspaceFolder}/foo.md`,
			"markdown",
			1,
			"foo [[ bar",
		);
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		// foo [[@
		expect(provider.isShouldProvide(textDocument, position)).toBeTruthy();
		// foo [@[
		position.character = 5;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
	});

	it("provide inside [[ and ]]", () => {
		const textDocument = TextDocument.create(
			`file://${workspaceFolder}/bar.md`,
			"markdown",
			1,
			"foo [[]]bar",
		);
		// foo [[@]]bar
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		expect(provider.isShouldProvide(textDocument, position)).toBeTruthy();
		// foo [[]@]bar
		position.character = 7;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
	});

	it("provide inside list", () => {
		const textDocument = TextDocument.create(
			`file://${workspaceFolder}/bar.md`,
			"markdown",
			1,
			"- [[]]",
		);
		// - [[@]]
		const position: ZeroBasedPosition = {
			line: 0,
			character: 4,
		};
		expect(provider.isShouldProvide(textDocument, position)).toBeTruthy();
		// - @[[]]
		position.character = 2;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
		// - [[]]@
		position.character = 6;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
	});

	it("provide inside list with nest", () => {
		const textDocument = TextDocument.create(
			`file://${workspaceFolder}/bar.md`,
			"markdown",
			1,
			"- foo\n    - [[]]",
		);
		// 0123- [[@]]
		const position: ZeroBasedPosition = {
			line: 1,
			character: 4 + 4,
		};
		expect(provider.isShouldProvide(textDocument, position)).toBeTruthy();
		// 0123- @[[]]
		position.character = 4 + 2;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
		// 0123- [[]]@
		position.character = 4 + 6;
		expect(provider.isShouldProvide(textDocument, position)).toBeFalsy();
	});

	it("provide at second line of paragraph", () => {
		const textDocument = TextDocument.create(
			`file://${workspaceFolder}/bar.md`,
			"markdown",
			1,
			"foo\n[[]]",
		);
		const position: ZeroBasedPosition = {
			line: 1,
			character: 2,
		};
		expect(provider.isShouldProvide(textDocument, position)).toBeTruthy();
	});
});

describe("ProvideCompletionItemsUseCase.provideWikilink", () => {
	const workspaceFolder = "/workspace";
	const fooContent = `\
# foo-h1
## foo-h2
`;
	const barContent = `\
# bar-h1
## bar-h2
`;
	const currentUri = "file:///workspace/foo.md";

	vol.reset();
	const json = {
		[`${workspaceFolder}/foo.md`]: fooContent,
		[`${workspaceFolder}/bar.md`]: barContent,
	};
	vol.fromJSON(json, workspaceFolder);

	const indexer = new Indexer();
	const index = new CreateIndexUseCase(indexer).execute(workspaceFolder);
	const useCase = new ProvideCompletionItemsUseCase(index);
	const result = useCase.provideWikilink(currentUri);

	it("provide wikilink: file name only", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "foo.md",
				insertText: "foo.md",
				sortText: "4_foo.md",
				documentation: "Title: foo-h1",
			}),
		);
	});

	it("provide wikilink: file and title", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "foo.md|foo-h1",
				insertText: "foo.md|foo-h1",
				sortText: "0_foo.md|foo-h1",
				documentation: "foo.md|foo-h1",
			}),
		);
	});

	it("provide wikilink: heading of current file", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "#foo-h2",
				insertText: "#foo-h2",
				sortText: "2_#foo-h2",
				documentation: "#foo-h2",
			}),
		);
	});

	it("provide wikilink: heading of other file", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "bar.md#bar-h2",
				insertText: "bar.md#bar-h2|bar-h2",
				sortText: "1_bar.md#bar-h2",
				documentation: "bar.md#bar-h2|bar-h2",
			}),
		);
	});
});
