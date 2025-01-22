import path from "node:path";
import { URI } from "vscode-uri";

export function getUriFromRelativePath(
	workspaceFolder: string,
	relativePath: string,
) {
	const absolutePath = path.resolve(workspaceFolder, relativePath);
	return URI.file(absolutePath).toString();
}
