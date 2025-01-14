import type { Node } from "mdast";
import type { Index } from "../IndexType";

declare module "mdast" {
	interface Node {
		children?: Node[];
	}
}

export type AbstractNode = Node;

export class NodeStrategy {
	constructor(
		protected index: Index,
		protected relativePath: string,
	) {}
	onEnter(_node: AbstractNode): void {}
	onLeave(_node: AbstractNode): void {}
}
