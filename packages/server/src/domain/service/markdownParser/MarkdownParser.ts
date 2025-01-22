import type { WikiLinkNode } from "@/domain/model/markdownNode/WikiLinkStrategy";
import type { Literal, Node, Root, Text } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkWililink from "remark-wiki-link";
import { unified } from "unified";
import { CONTINUE, visit } from "unist-util-visit";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";

function isNode(target: unknown): target is Node {
	return typeof target === "object" && target !== null && "type" in target;
}

function isLiteralNode(node: unknown): node is Literal {
	return isNode(node) && "value" in node;
}

export function isTextNode(node: unknown): node is Text {
	return isLiteralNode(node) && node.type === "text";
}

export function isWikiLinkNode(node: unknown): node is WikiLinkNode {
	return isLiteralNode(node) && node.type === "wikiLink";
}

export class MarkdownParser {
	private parser = unified()
		.use(remarkParse)
		.use(remarkWililink, { aliasDivider: "|" })
		.use(remarkGfm);

	parse(text: string): Root {
		return this.parser.parse(text);
	}

	getCurrentNode(text: string, position: ZeroBasedPosition): Node {
		const tree = this.parse(text);
		let targetNode: Node = tree;
		visit(tree, (node) => {
			if (!node.position) {
				return CONTINUE;
			}
			const { start, end } = node.position;
			if (
				(start.line < position.line + 1 ||
					(start.line === position.line + 1 &&
						start.column <= position.character + 1)) &&
				(position.line + 1 < end.line ||
					(position.line + 1 === end.line &&
						position.character + 1 <= end.column))
			) {
				targetNode = node;
				return CONTINUE;
			}
		});
		return targetNode;
	}
}
