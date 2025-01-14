import { readFileSync } from "node:fs";
import path from "node:path";
import { SymbolCreator } from "@/domain/model/SymbolCreator";
import type { AbstractNode } from "@/domain/model/markdownNode/NodeStrategy";
import type { Index } from "@/domain/model/scip_pb";
import { MarkdownParser } from "@/infrastructure/markdownParser/MarkdownParser";
import { IndexStrategy } from "./IndexStrategy";

export function getPaths(
	workspaceFolder: string,
	filePath: string,
	isRelative: boolean,
) {
	let relativePath = "";
	let absolutePath = "";
	if (isRelative) {
		relativePath = filePath;
		absolutePath = path.join(workspaceFolder, filePath);
	} else {
		relativePath = path.relative(workspaceFolder, filePath);
		absolutePath = filePath;
	}
	return {
		relativePath,
		absolutePath,
	};
}

export function traverseForIndex(
	node: AbstractNode,
	parentSymbol: string,
	onEnter?: (node: AbstractNode, parentSymbol: string) => void,
	onLeave?: (node: AbstractNode) => void,
) {
	if (typeof onEnter !== "undefined") {
		onEnter(node, parentSymbol);
	}
	for (const child of node.children ?? []) {
		traverseForIndex(child, node.symbol, onEnter, onLeave);
	}
	if (typeof onLeave !== "undefined") {
		onLeave(node);
	}
}

export class Indexer {
	execute(
		index: Index,
		workspaceFolder: string,
		filePath: string,
		isRelative: boolean,
	) {
		const { relativePath, absolutePath } = getPaths(
			workspaceFolder,
			filePath,
			isRelative,
		);

		const content = readFileSync(absolutePath, "utf-8");

		try {
			const rootNode = new MarkdownParser().execute(content);
			const symbolCreator = new SymbolCreator(relativePath);
			const strategy = new IndexStrategy(index, relativePath, symbolCreator);
			traverseForIndex(rootNode, "", strategy.onEnter, strategy.onLeave);
		} catch (error) {
			console.error(error);
		}
	}
}
