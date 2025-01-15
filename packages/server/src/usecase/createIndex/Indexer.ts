import { readFileSync } from "node:fs";
import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import type { AbstractNode } from "@/domain/model/markdownNode/NodeStrategy";
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
	onEnter?: (node: AbstractNode) => void,
	onLeave?: (node: AbstractNode) => void,
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
			// TODO: parserはDIにする
			console.log(relativePath);
			const rootNode = new MarkdownParser().execute(content);
			console.log(rootNode);
			const strategy = new IndexStrategy(index, relativePath);
			traverseForIndex(rootNode, strategy.onEnter, strategy.onLeave);
		} catch (error) {
			console.error(error);
		}
	}
}
