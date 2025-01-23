import { getUriFromRelativePath } from "@/domain/shared/utils";
import { Range } from "@volar/language-server";
import type { Data, Literal } from "mdast";
import { NodeStrategy } from "./NodeStrategy";

interface WikiLinkHProperties {
	className: string;
	href: string;
	[key: string]: unknown;
}

interface WikiLinkData extends Data {
	alias: string;
	exists: boolean;
	permalink: string;
	hProperties: WikiLinkHProperties;
	hChildren: Array<{ value: string }>;
}

export interface WikiLinkNode extends Literal {
	type: "wikiLink";
	data: WikiLinkData;
}

export class WikiLinkStrategy extends NodeStrategy {
	onLeave(node: WikiLinkNode): void {
		const url = node.value.split("#")[0];
		if (!url.endsWith(".md")) {
			return;
		}
		this.index.addInternalLinks(this.relativePath, {
			relativePath: url,
			linkNodeRage: Range.create(
				node.position.start.line - 1,
				node.position.start.column - 1,
				node.position.end.line - 1,
				node.position.end.column - 1,
			),
		});
	}
}
