import {
	MarkdownParser,
	type WikiLinkNode,
	isWikiLink,
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
		expect(isWikiLink(node)).toBeTruthy();
		expect((node as WikiLinkNode).data.alias).toBe("fooo");
	});

	// TODO: パーサーを変更する必要がある
	it.todo("wikilink image", () => {
		const content = "![[foo.png]]";
		const result = parser.parse(content);
		const node = result.children[0].children[0];
		expect(isWikiLink(node)).toBeTruthy();
		expect((node as WikiLinkNode).value).toBe("foo.png");
	});
});
