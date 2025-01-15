import type { Heading } from "mdast";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { NodeStrategy } from "./NodeStrategy";

export class HeadingStrategy extends NodeStrategy {
	onLeave(node: Heading) {
		const text = unified()
			.use(remarkStringify)
			.stringify({ type: "root", children: node.children })
			.trimEnd();
		this.index.documents[this.relativePath].headings.push({
			text,
			range: {
				start: {
					line: node.position.start.line - 1,
					character: node.position.start.column - 1,
				},
				end: {
					line: node.position.end.line - 1,
					character: node.position.end.column - 1,
				},
			},
		});
	}
}
