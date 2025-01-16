import path from "node:path";
import { MarkdownParser } from "@/infrastructure/markdownParser/MarkdownParser";
import { CreateIndexUseCase } from "./CreateIndexUseCase";

describe("CreateIndexUseCase", () => {
	it("normal", () => {
		const workspaceFolder = path.resolve("../sample/");
		const markdownParser = new MarkdownParser();
		const index = new CreateIndexUseCase(markdownParser).execute(
			workspaceFolder,
		);

		const grammarDocument = index.documents["grammar.md"];
		expect(grammarDocument).not.toBeUndefined();
		expect(grammarDocument.headings.length).not.toBe(0);

		const linksDocument = index.documents["links.md"];
		expect(linksDocument).not.toBeUndefined();
		expect(linksDocument.headings.length).toBe(3);
	});
});
