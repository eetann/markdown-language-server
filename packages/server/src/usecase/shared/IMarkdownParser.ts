import type { Root } from "mdast";

export interface IMarkdownParser {
	parse(text: string): Root;
}
