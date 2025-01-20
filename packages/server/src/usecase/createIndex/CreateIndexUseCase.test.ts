import path from "node:path";
import { CreateIndexUseCase } from "./CreateIndexUseCase";

describe("CreateIndexUseCase", () => {
	it("normal", () => {
		const workspaceFolder = path.resolve("../sample/");
		const index = new CreateIndexUseCase().execute(workspaceFolder);

		const grammarDocument = index.documents["grammar.md"];
		expect(grammarDocument).not.toBeUndefined();
		expect(grammarDocument.headings.length).not.toBe(0);
		expect(grammarDocument.title).toBe("H1 Heading");

		const linksDocument = index.documents["links.md"];
		expect(linksDocument.headings.length).toBe(3);
		expect(linksDocument.title).toBe("links");

		const plainTitleDocument = index.documents["plain-title.md"];
		expect(plainTitleDocument.title).toBe(
			"There is no h1, so this is the title",
		);
	});
});
