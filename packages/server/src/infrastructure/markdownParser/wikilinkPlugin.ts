import type { Node, Nodes, Paragraph, Parent, Text } from "mdast";
import { gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";
import type { Plugin } from "unified";
import { type BuildVisitor, visit } from "unist-util-visit";

function isNode(target: unknown): target is Node {
	return typeof target === "object" && target !== null && "type" in target;
}
export function isParent(node: unknown): node is Parent {
	return isNode(node) && Array.isArray(node.children);
}

function isParagraph(node: unknown): node is Paragraph {
	return isNode(node) && node.type === "paragraph";
}

function isText(node: unknown): node is Text {
	return isNode(node) && node.type === "text";
}

function isWikilink(node: unknown): node is Paragraph {
	if (!isParagraph(node)) {
		return false;
	}
	// 補完中のことを考えると`[[カーソル]]`の場合も含むようにして、brokenにする
	const hasValidWilinink = /!?\[\[([^\]]*)\]\]/g;
	const textContent = toMarkdown({ type: "root", children: node.children });
	return hasValidWilinink.test(textContent);
}

interface WikilinkNode extends Parent {
	type: "wikilink";
	url: string;
	heading: string;
	displayText: string;
}

const visitor: BuildVisitor = (
	node: Paragraph,
	index: number,
	parent: Parent | undefined,
) => {
	if (!parent) {
		return;
	}
	const newChildren = [];
	let buffer: Parent["children"] = [];
	let inWikilink = false;

	function flushBuffer(
		url: string,
		heading: string,
		displayText: string,
	): void {
		if (buffer.length === 0) {
			return;
		}
		const wikilinkNode: WikilinkNode = {
			type: "wikilink",
			url,
			heading,
			displayText,
			children: [...buffer],
		};
		newChildren.push(wikilinkNode);

		buffer = [];
	}

	for (const child of node.children) {
		if (child.type === "text") {
			const parts = child.value.split(/(\[\[|\]\])/);
			for (const part of parts) {
				if (part === "") {
					continue;
				}
				if (part === "[[") {
					inWikilink = true;
					continue;
				}
				if (part === "]]") {
					inWikilink = false;

					const content = toMarkdown(
						{
							type: "root",
							children: buffer,
						},
						{ extensions: [gfmToMarkdown()] },
					).trimEnd();
					const [rawUrl, displayText = rawUrl] = content.split("|");
					const [url, heading = ""] = rawUrl.split("#");
					flushBuffer(url, heading, displayText);
					continue;
				}
				if (inWikilink) {
					// TODO: positionの更新
					buffer.push({ ...child, value: part });
				} else {
					// リンク外のテキスト
					const textNode: Text = {
						...child,
						type: "text",
						value: part,
					};
					newChildren.push(textNode);
				}
			}
		} else if (inWikilink) {
			// strong, emphasis, link(gfm)など
			if (child.type === "link") {
				buffer.push({ type: "text", value: child.url });
				continue;
			}
			buffer.push(child);
		} else {
			// wikilinkではない部分
			newChildren.push(child);
		}
	}

	parent.children[index] = {
		type: "paragraph",
		children: newChildren,
	};
};

export const wikilinkPlugin: Plugin = () => {
	return (tree: Nodes) => {
		visit(tree, isWikilink, visitor);
	};
};
