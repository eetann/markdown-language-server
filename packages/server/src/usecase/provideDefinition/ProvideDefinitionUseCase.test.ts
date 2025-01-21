import type { CancellationToken } from "@volar/language-service";
import { vol } from "memfs";
import { TextDocument } from "vscode-languageserver-textdocument";
import { CreateIndexUseCase } from "../createIndex/CreateIndexUseCase";
import { ProvideDefinitionUseCase } from "./ProvideDefinitionUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

describe("ProvideDefinitionUseCase", () => {
	const token: CancellationToken = {
		isCancellationRequested: false,
		onCancellationRequested: undefined,
	};
	const workspaceFolder = "/workspace";
	const fooContent = `\
# Heading1
[[bar.md]]
[[http://exmaple.com]]
[[no-exist.md]]
[[bar.md#no-exist]]
[[bar.md|bar-title]]
[[bar.md#bar-h2|bar-h2]]
[[#Heading1]]
- foo
    - [[bar.md]]
`;
	const barContent = `\
# bar-h1
## bar-h2
`;
	const textDocument = TextDocument.create(
		"file:///workspace/foo.md",
		"markdown",
		1,
		fooContent,
	);

	vol.reset();
	const json = {
		[`${workspaceFolder}/foo.md`]: fooContent,
		[`${workspaceFolder}/bar.md`]: barContent,
	};
	vol.fromJSON(json, workspaceFolder);
	const index = new CreateIndexUseCase().execute(workspaceFolder);
	const useCase = new ProvideDefinitionUseCase(index);

	it("should return empty array for a non-wiki link node", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 0, character: 0 },
			token,
		);
		expect(result).toEqual([]);
	});

	it("should provide definition for a valid wiki link node", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 1, character: 0 },
			token,
		);
		// @ts-ignore
		expect(result.length).toBe(1);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/bar.md",
				targetRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 0 },
				},
			}),
		);
	});

	it("should return empty array for a wiki link node with external URL", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 2, character: 0 },
			token,
		);
		expect(result).toEqual([]);
	});

	it("should return empty array when document is not found in the index", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 3, character: 0 },
			token,
		);
		expect(result).toEqual([]);
	});

	it("should provide definition for a wiki link node with a non-existent heading", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 4, character: 0 },
			token,
		);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/bar.md",
				targetRange: {
					// Heading does not exist, so the jump position is at the top
					start: { line: 0, character: 0 },
					end: { line: 0, character: 0 },
				},
			}),
		);
	});

	it("should provide definition for link with aliase", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 5, character: 0 },
			token,
		);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/bar.md",
				targetRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 0 },
				},
			}),
		);
	});

	it("should provide definition for link with heading", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 6, character: 0 },
			token,
		);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/bar.md",
				targetRange: {
					start: { line: 1, character: 0 },
					end: { line: 1, character: 9 },
				},
			}),
		);
	});

	it("should provide definition for link with self heading", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 7, character: 0 },
			token,
		);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/foo.md",
				targetRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 10 },
				},
			}),
		);
	});

	it("should provide definition for link inside nested list", () => {
		const result = useCase.execute(
			textDocument,
			{ line: 9, character: 8 },
			token,
		);
		expect(result[0]).toEqual(
			expect.objectContaining({
				targetUri: "file:///workspace/bar.md",
				targetRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 0 },
				},
			}),
		);
	});
});
