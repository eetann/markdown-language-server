import type { Node } from "mdast";
import type { Index } from "../IndexType";

declare module "mdast" {
	interface Node {
		children?: Node[];
	}
}

export class NodeStrategy {
	constructor(
		protected index: Index,
		protected relativePath: string,
	) {}
	onEnter(_node: Node): void {}
	onLeave(_node: Node): void {}
}
