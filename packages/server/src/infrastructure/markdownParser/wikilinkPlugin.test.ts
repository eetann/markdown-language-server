import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { wikilinkPlugin } from "./wikilinkPlugin";

describe("wikilinkPlugin", () => {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(wikilinkPlugin);
	it("normal", async () => {
		const rootNode = processor.parse("[[https://example.com]]");
		const nodes = (await processor.run(rootNode)) as Root;
		const paragraphNode = nodes.children[0];
		expect(paragraphNode.type).toBe("paragraph");
		expect(paragraphNode.children[0].type).toBe("wikilink");
	});
});
