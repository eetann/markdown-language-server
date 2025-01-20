import type { Index } from "@/domain/model/IndexType";
import { TitleExtractor } from "./TitleExtractor";

describe("TitleExtractor", () => {
	const index: Index = {
		workspaceFolder: "",
		documents: {},
	};
	const range = {
		start: { line: 0, character: 0 },
		end: { line: 0, character: 9 - 1 },
	};
	const relativePath = "foo.md";

	it("first heading", () => {
		index.documents[relativePath] = {
			headings: [{ text: "foo-title", range }],
			title: "",
		};
		new TitleExtractor().execute(index, relativePath, "# foo-title\nbody");
		expect(index.documents[relativePath].title).toBe("foo-title");
	});

	it("no heading", () => {
		index.documents[relativePath] = {
			headings: [],
			title: "",
		};
		new TitleExtractor().execute(
			index,
			relativePath,
			"It's the text, but it's also the title.",
		);
		expect(index.documents[relativePath].title).toBe(
			"It's the text, but it's also the title.",
		);
	});
});
