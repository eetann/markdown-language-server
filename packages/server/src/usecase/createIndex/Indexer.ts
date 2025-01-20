import { readFileSync } from "node:fs";
import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import type { AbstractNode } from "@/domain/model/markdownNode/NodeStrategy";
import { MarkdownParser } from "@/domain/service/markdownParser/MarkdownParser";
import { IndexStrategy } from "./IndexStrategy";
import { TitleExtractor } from "./TitleExtractor";

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
			const rootNode = new MarkdownParser().parse(content);
			const strategy = new IndexStrategy(index, relativePath);
			traverseForIndex(rootNode, strategy.onEnter, strategy.onLeave);
			new TitleExtractor().execute(index, relativePath, content);
		} catch (error) {
			console.error(error);
		}
	}
}
