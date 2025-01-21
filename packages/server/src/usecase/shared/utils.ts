import path from "node:path";
import { Range } from "@volar/language-server";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";

export function getLineText(
	textDocument: TextDocument,
	position: ZeroBasedPosition,
) {
	return textDocument.getText(
		Range.create(position.line, 0, position.line + 1, 0),
	);
}

export function extractRelativePath(
	uri: string,
	workspaceFolder: string,
): string {
	const decodedUri = decodeURIComponent(decodeURIComponent(uri));
	const absolutePath = decodedUri.replace(
		/^volar-embedded-content:\/\/root\/file:\/\//,
		"",
	);
	return path.relative(workspaceFolder, absolutePath);
}
