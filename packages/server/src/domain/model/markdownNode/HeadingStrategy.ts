import type { Heading } from "mdast";
import { NodeStrategy } from "./NodeStrategy";

export class HeadingStrategy extends NodeStrategy {
	onLeave(node: Heading) {
		this.index.documents[this.relativePath].headings.push({
			text: "foooooo",
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
