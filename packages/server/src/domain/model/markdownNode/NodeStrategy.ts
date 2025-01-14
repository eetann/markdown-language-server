import {
	type Index,
	type Occurrence,
	OccurrenceSchema,
	type SymbolInformation,
	SymbolInformationSchema,
} from "@/domain/model/scip_pb";
import { type MessageInitShape, create } from "@bufbuild/protobuf";
import type { Node, Parent } from "mdast";
import type { SymbolCreator } from "../SymbolCreator";

export type AbstractNode = Node & { symbol?: string; children?: Node[] };

export function createSymbolInformation(
	symbol: MessageInitShape<typeof SymbolInformationSchema>,
) {
	return create(SymbolInformationSchema, symbol);
}

export function createOccurrenceSameLine(
	symbol: string,
	node: AbstractNode,
	occurrence?: MessageInitShape<typeof OccurrenceSchema>,
) {
	return create(OccurrenceSchema, {
		symbol,
		range: [
			node.position.start.line - 1,
			node.position.start.column - 1,
			node.position.end.column - 1,
		],
		...occurrence,
	});
}

export function createOccurrenceMultipleLine(
	symbol: string,
	node: AbstractNode,
	occurrence?: MessageInitShape<typeof OccurrenceSchema>,
) {
	return create(OccurrenceSchema, {
		symbol,
		range: [
			node.position.start.line - 1,
			node.position.start.column - 1,
			node.position.end.line - 1,
			node.position.end.column - 1,
		],
		...occurrence,
	});
}

export class NodeStrategy {
	constructor(
		protected index: Index,
		protected relativePath: string,
		protected symbolCreator: SymbolCreator,
	) {}

	getSymbol(_node: AbstractNode, parentSymbol: string): string {
		return parentSymbol;
	}
	onEnter(node: AbstractNode, parentSymbol: string): void {
		node.symbol = this.getSymbol(node, parentSymbol);
	}

	getType(_node: AbstractNode): string {
		return "";
	}

	createSymbolInformations(_node: AbstractNode): SymbolInformation[] {
		return [];
	}
	insertSymbolInformations(node: AbstractNode): void {
		const symbols = this.createSymbolInformations(node);
		this.index.documents[this.relativePath].symbols.push(...symbols);
	}

	createOccurrences(_node: AbstractNode): Occurrence[] {
		return [];
	}
	insertOccurrences(node: AbstractNode): void {
		const occurrences = this.createOccurrences(node);
		this.index.documents[this.relativePath].occurrences.push(...occurrences);
	}

	onLeave(node: AbstractNode): void {
		this.insertSymbolInformations(node);
		this.insertOccurrences(node);
	}
}
