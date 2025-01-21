import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";
import {
	MarkdownParser,
	type WikiLinkNode,
	isWikiLinkNode,
} from "./MarkdownParser";

describe("MarkdownParser", () => {
	const parser = new MarkdownParser();

	it("test", () => {
		const content = `
# H1 Heading
## List
### Bullet List
- This is a bullet list
- The much-anticipated bullet list
    - So happy to have bullets
    - The long-awaited nesting
        - The nest of the nest, a dream come true

* List with asterisks
- List with hyphens
+ List with pluses
`;
		const result = parser.parse(content);
		expect(result.type).toBe("root");
	});

	it("wikilink", () => {
		const content = "[[https://example.com]]";
		const result = parser.parse(content);
		expect(result.children[0].children[0].type).toBe("wikiLink");
	});

	it("wikilink with alias", () => {
		const content = "[[https://example.com|fooo]]";
		const result = parser.parse(content);
		const node = result.children[0].children[0];
		expect(isWikiLinkNode(node)).toBeTruthy();
		expect((node as WikiLinkNode).data.alias).toBe("fooo");
	});

	// TODO: パーサーを変更する必要がある
	// ![[ ]] に対する補完や移動を実装する必要は無さそう？
	it.todo("wikilink image", () => {
		const content = "![[foo.png]]";
		const result = parser.parse(content);
		const node = result.children[0].children[0];
		expect(isWikiLinkNode(node)).toBeTruthy();
		expect((node as WikiLinkNode).value).toBe("foo.png");
	});

	it("getCurrentNode", () => {
		const content = "text [[https://example.com]] text";
		// text node
		const position: ZeroBasedPosition = {
			line: 0,
			character: 4,
		};
		let node = parser.getCurrentNode(content, position);
		expect(node.type).toBe("text");
		// wikiLink node
		position.character = 5;
		node = parser.getCurrentNode(content, position);
		expect(node.type).toBe("wikiLink");
	});

	it("getCurrentNode before wikiLink is born", () => {
		const content = "text [[]]";
		// text node
		const position: ZeroBasedPosition = {
			line: 0,
			character: 4,
		};
		let node = parser.getCurrentNode(content, position);
		expect(node.type).toBe("text");
		// [[]] is text node
		position.character = 5;
		node = parser.getCurrentNode(content, position);
		expect(node.type).toBe("text");
	});

	it("getCurrentNode inside nested list", () => {
		const content = "- foo\n    - [[]]";
		// text node
		const position: ZeroBasedPosition = {
			line: 1,
			character: 8,
		};
		const node = parser.getCurrentNode(content, position);
		expect(node.type).toBe("text");
		// @ts-ignore
		expect(node.value).toBe("[[]]");
	});
});
