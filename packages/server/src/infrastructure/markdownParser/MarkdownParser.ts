import type { CompileResults, VFileWithOutput } from "node_modules/unified/lib";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export class MarkdownParser {
	// private nodes: VFileWithOutput<CompileResults> | undefined = undefined;

	async parse(text: string) {
		return await unified().use(remarkParse).use(remarkGfm).process(text);
	}
}
