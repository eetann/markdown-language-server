import type { Index } from "@/domain/model/IndexType";
import { HeadingStrategy } from "@/domain/model/markdownNode/HeadingStrategy";
import {
	type AbstractNode,
	NodeStrategy,
} from "@/domain/model/markdownNode/NodeStrategy";

export class IndexStrategy extends NodeStrategy {
	private strategies: Map<string, NodeStrategy>;

	constructor(
		public index: Index,
		relativePath: string,
	) {
		super(index, relativePath);
		this.index.addDocument(relativePath);

		this.strategies = new Map();
		this.strategies.set("root", new NodeStrategy(index, relativePath));
		this.strategies.set("heading", new HeadingStrategy(index, relativePath));
	}

	// thisを固定するためにarrow functionを使う
	onEnter = (node: AbstractNode) => {
		this.strategies.get(node.type)?.onEnter(node);
	};

	onLeave = (node: AbstractNode) => {
		this.strategies.get(node.type)?.onLeave(node);
	};
}
