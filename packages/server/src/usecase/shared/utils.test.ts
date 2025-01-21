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
	it("should return the relative path from the workspace folder", () => {
		const uri =
			"volar-embedded-content://root/file:///Users/foo/project/file.ts";
		const workspaceFolder = "/Users/foo/project";

		const result = extractRelativePath(uri, workspaceFolder);

		expect(result).toBe("file.ts");
	});
});
