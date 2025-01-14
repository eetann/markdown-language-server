import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export class MarkdownParser {
	execute(text: string) {
		return unified().use(remarkParse).use(remarkGfm).parse(text);
	}
}
