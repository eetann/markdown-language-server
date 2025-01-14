import type { Heading } from "mdast";
import type { Occurrence } from "../scip_pb";
import { NodeStrategy, createOccurrenceSameLine } from "./NodeStrategy";

export class HeadingStrategy extends NodeStrategy {
	createOccurrences(node: Heading): Occurrence[] {
		return [createOccurrenceSameLine(node.symbol, node, {})];
	}
}
