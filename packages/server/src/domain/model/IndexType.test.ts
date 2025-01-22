import { Index } from "./IndexType";

describe("extractTitle", () => {
	const workspaceFolder = "/workspace";
	const index: Index = new Index(workspaceFolder);
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
		index.extractTitle(relativePath, "# foo-title\nbody");
		expect(index.documents[relativePath].title).toBe("foo-title");
	});

	it("no heading", () => {
		index.documents[relativePath] = {
			headings: [],
			title: "",
		};
		index.extractTitle(relativePath, "It's the text, but it's also the title.");
		expect(index.documents[relativePath].title).toBe(
			"It's the text, but it's also the title.",
		);
	});
});
