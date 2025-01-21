import path from "node:path";
import { type Connection, Range } from "@volar/language-server";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";

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
		/^(volar-embedded-content:\/\/root\/)?file:\/\//,
		"",
	);
	return path.relative(workspaceFolder, absolutePath);
}

// contextでも取得できるけどたぶんcommandから呼べない
export async function getWorkspaceFolders(
	connection: Connection,
): Promise<string[]> {
	const workspaceFolders: string[] = [];
	const folders = (await connection.workspace.getWorkspaceFolders()) ?? [];
	for (const folder of folders) {
		workspaceFolders.push(URI.parse(folder.uri).fsPath);
	}
	return workspaceFolders;
}
