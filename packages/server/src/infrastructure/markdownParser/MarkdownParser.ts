import type { IMarkdownParser } from "@/usecase/shared/IMarkdownParser";
import type { Data, Literal, Node, Root } from "mdast";
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

function isLiteral(node: unknown): node is Literal {
	return isNode(node) && "value" in node;
}

export function isWikiLink(node: unknown): node is WikiLinkNode {
	return isLiteral(node) && node.type === "wikiLink";
}

export class MarkdownParser implements IMarkdownParser {
	private parser = unified()
		.use(remarkParse)
		.use(remarkWililink, { aliasDivider: "|" })
		.use(remarkGfm);

	parse(text: string): Root {
		return this.parser.parse(text);
	}

	getCurrentNode(text: string, position: ZeroBasedPosition): Node | undefined {
		const tree = this.parse(text);
		let targetNode: Node | undefined = undefined;
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
