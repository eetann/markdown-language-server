import type { CompileResults, VFileWithOutput } from "node_modules/unified/lib";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export class MarkdownParser {
	private nodes: VFileWithOutput<CompileResults>;
	constructor(text: string) {
		(async () => {
			this.nodes = await unified()
				.use(remarkParse)
				.use(remarkGfm)
				.process(text);
		})();
	}

	getNodes() {
		return this.nodes;
	}
}
