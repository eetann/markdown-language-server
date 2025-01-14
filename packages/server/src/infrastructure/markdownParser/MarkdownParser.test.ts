import { MarkdownParser } from "./MarkdownParser";

describe("MarkdownParser", () => {
	it("test", () => {
		const parser = new MarkdownParser();
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
		const result = parser.execute(content);
		expect(result.type).toBe("root");
	});
});
