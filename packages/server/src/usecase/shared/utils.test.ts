import { TextDocument } from "vscode-languageserver-textdocument";
import { extractRelativePath, getLineText } from "./utils";

describe("getLineText", () => {
	const content = "line1\nline2\nline3";
	const textDocument = TextDocument.create(
		"file://test",
		"markdown",
		1,
		content,
	);
	it("should return the text of the specified line", () => {
		const position = { line: 1, character: 0 };
		const result = getLineText(textDocument, position);
		expect(result).toBe("line2\n");
	});
	it("should return the text without line break if last line", () => {
		const position = { line: 2, character: 0 };
		const result = getLineText(textDocument, position);
		expect(result).toBe("line3");
	});
});

describe("extractRelativePath", () => {
	it("with volar", () => {
		const workspaceFolder = "/Users/foo/project";
		const uri =
			"volar-embedded-content://root/file:///Users/foo/project/file.ts";

		const result = extractRelativePath(workspaceFolder, uri);

		expect(result).toBe("file.ts");
	});

	it("with out volar", () => {
		const workspaceFolder = "/Users/foo/project";
		const uri = "file:///Users/foo/project/file.ts";

		const result = extractRelativePath(workspaceFolder, uri);

		expect(result).toBe("file.ts");
	});
});
