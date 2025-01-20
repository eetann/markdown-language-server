import type { Data, Literal, Node, Root, Text } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkWililink from "remark-wiki-link";
import { unified } from "unified";
import { CONTINUE, visit } from "unist-util-visit";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";

interface WikiLinkHProperties {
	className: string;
	href: string;
	[key: string]: unknown;
}

interface WikiLinkData extends Data {
	alias: string;
	exists: boolean;
	permalink: string;
	hProperties: WikiLinkHProperties;
	hChildren: Array<{ value: string }>;
}

export interface WikiLinkNode extends Literal {
	type: "wikiLink";
	data: WikiLinkData;
}

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
			if (
				node.position &&
				position.line + 1 >= node.position.start.line &&
				position.line + 1 <= node.position.end.line &&
				position.character + 1 >= node.position.start.column &&
				position.character + 1 <= node.position.end.column
			) {
				targetNode = node;
				return CONTINUE;
			}
		});
		return targetNode;
	}
}
