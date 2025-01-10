import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { type Processor, unified } from "unified";

const parser = unified().use(remarkParse).use(remarkGfm);

export class MarkdownParser {
	private nodes: ReturnType<Processor["parse"]>;
	constructor(text: string) {
		this.nodes = parser.parse(text);
	}

	getNodes() {
		return this.nodes;
	}
}
