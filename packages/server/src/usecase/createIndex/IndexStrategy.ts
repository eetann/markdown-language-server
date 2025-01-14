import type { SymbolCreator } from "@/domain/model/SymbolCreator";
import {
	type AbstractNode,
	NodeStrategy,
} from "@/domain/model/markdownNode/NodeStrategy";
import { DocumentSchema, type Index } from "@/domain/model/scip_pb";
import { create } from "@bufbuild/protobuf";

export class IndexStrategy extends NodeStrategy {
	private strategies: Map<string, NodeStrategy>;

	constructor(
		public index: Index,
		relativePath: string,
		symbolCreator: SymbolCreator,
	) {
		super(index, relativePath, symbolCreator);
		this.index.documents[relativePath] = create(DocumentSchema, {
			language: "markdown",
		});

		this.strategies = new Map();
		this.strategies.set(
			"root",
			new NodeStrategy(index, relativePath, symbolCreator),
		);
		this.strategies.set(
			"heading",
			new NodeStrategy(index, relativePath, symbolCreator),
		);
	}

	// thisを固定するためにarrow functionを使う
	onEnter = (node: AbstractNode, parentSymbol: string) => {
		this.strategies.get(node.type)?.onEnter(node, parentSymbol);
	};

	getChildren = (node: AbstractNode) => {
		return this.strategies.get(node.type)?.getChildren(node) ?? [];
	};

	onLeave = (node: AbstractNode) => {
		this.strategies.get(node.type)?.onLeave(node);
	};
}
