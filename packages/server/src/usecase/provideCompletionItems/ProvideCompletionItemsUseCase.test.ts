import type { Index } from "@/domain/model/IndexType";
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
	const index: Index = {
		workspaceFolder: "",
		documents: {},
	};
	const provider = new ProvideCompletionItemsUseCase(index);

	it("provide after [[", () => {
		const lineText = "foo [[ bar";
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		// foo [[@
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
		// foo [@[
		position.character = 5;
		expect(provider.isShouldProvide(lineText, position)).toBeFalsy();
	});

	it("provide inside [[ and ]]", () => {
		let lineText = "foo [[]]bar";
		// foo [[@]]bar
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
		// foo [[]@]bar
		position.character = 7;
		expect(provider.isShouldProvide(lineText, position)).toBeFalsy();
		// [[@]]
		lineText = "[[]]";
		position.character = 2;
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
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
	const index = new CreateIndexUseCase().execute(workspaceFolder);
	const useCase = new ProvideCompletionItemsUseCase(index);
	const result = useCase.provideWikilink(currentUri);

	it("provide wikilink: file name only", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "foo-h1",
				insertText: "foo.md",
				documentation: "foo.md",
			}),
		);
	});

	it("provide wikilink: file and title", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "foo-h1",
				insertText: "foo.md|foo-h1",
				documentation: "foo.md|foo-h1",
			}),
		);
	});

	it("provide wikilink: heading of current file", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "#foo-h2",
				insertText: "#foo-h2",
				documentation: "#foo-h2",
			}),
		);
	});

	it("provide wikilink: heading of other file", () => {
		expect(result).toContainEqual(
			expect.objectContaining({
				label: "bar.md#bar-h2",
				insertText: "bar.md#bar-h2|bar-h2",
				documentation: "bar.md#bar-h2|bar-h2",
			}),
		);
	});
});
