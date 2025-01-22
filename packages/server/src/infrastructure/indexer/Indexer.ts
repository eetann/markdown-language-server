import { readFileSync } from "node:fs";
import path from "node:path";
import { Index } from "@/domain/model/IndexType";
import { IndexStrategy } from "@/domain/model/markdownNode/IndexStrategy";
import { MarkdownParser } from "@/domain/service/markdownParser/MarkdownParser";
import type { IIndexer } from "@/usecase/shared/IIndexer";
import type { Node } from "mdast";

function traverseForIndex(
	node: Node,
	onEnter?: (node: Node) => void,
	onLeave?: (node: Node) => void,
) {
	if (typeof onEnter !== "undefined") {
		onEnter(node);
	}
	for (const child of node.children ?? []) {
		traverseForIndex(child, onEnter, onLeave);
	}
	if (typeof onLeave !== "undefined") {
		onLeave(node);
	}
}

export class Indexer implements IIndexer {
	createIndex(workspaceFolder: string) {
		return new Index(workspaceFolder);
	}

	addDocument(index: Index, absolutePath: string): void {
		const relativePath = path.relative(index.workspaceFolder, absolutePath);
		try {
			const content = readFileSync(absolutePath, "utf-8");
			const rootNode = new MarkdownParser().parse(content);
			const strategy = new IndexStrategy(index, relativePath);
			traverseForIndex(rootNode, strategy.onEnter, strategy.onLeave);
			index.extractTitle(relativePath, content);
		} catch (error) {
			console.error(error);
		}
	}
	deleteDocument(index: Index, absolutePath: string): void {
		throw new Error("Method not implemented.");
	}
}
