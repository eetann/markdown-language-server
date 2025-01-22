import type { Node } from "mdast";
import type { Index } from "../IndexType";
import { HeadingStrategy } from "./HeadingStrategy";
import { NodeStrategy } from "./NodeStrategy";
import { WikiLinkStrategy } from "./WikiLinkStrategy";

export class IndexStrategy extends NodeStrategy {
	private strategies: Map<string, NodeStrategy>;

	constructor(
		public index: Index,
		relativePath: string,
	) {
		super(index, relativePath);
		this.index.addOneDocument(relativePath);

		this.strategies = new Map();
		this.strategies.set("root", new NodeStrategy(index, relativePath));
		this.strategies.set("heading", new HeadingStrategy(index, relativePath));
		this.strategies.set("wikiLink", new WikiLinkStrategy(index, relativePath));
	}

	// thisを固定するためにarrow functionを使う
	onEnter = (node: Node) => {
		this.strategies.get(node.type)?.onEnter(node);
	};

	onLeave = (node: Node) => {
		this.strategies.get(node.type)?.onLeave(node);
	};
}
