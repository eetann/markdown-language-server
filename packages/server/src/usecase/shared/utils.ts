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
