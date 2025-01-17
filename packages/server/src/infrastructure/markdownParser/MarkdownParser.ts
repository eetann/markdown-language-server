import type { Data, Literal, Node, Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkWililink from "remark-wiki-link";
import { unified } from "unified";

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

export class MarkdownParser {
	parse(text: string): Root {
		return unified()
			.use(remarkParse)
			.use(remarkWililink, { aliasDivider: "|" })
			.use(remarkGfm)
			.parse(text);
	}
}
