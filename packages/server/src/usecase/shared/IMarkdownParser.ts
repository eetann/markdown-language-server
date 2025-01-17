import type { Node, Root } from "mdast";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";

export interface IMarkdownParser {
	parse(text: string): Root;
	getCurrentNode(text: string, position: ZeroBasedPosition): Node;
}
