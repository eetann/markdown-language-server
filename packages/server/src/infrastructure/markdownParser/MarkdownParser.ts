import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export class MarkdownParser {
	execute(text: string): Root {
		// TODO: テストは通るけど、LSPとして実行する時にエラーになる
		// Error: Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither
		return unified().use(remarkParse).use(remarkGfm).parse(text);
	}
}
