import path from "node:path";
import { CreateIndexUseCase } from "./CreateIndexUseCase";

describe("CreateIndexUseCase", () => {
	it("normal", () => {
		const workspaceFolder = path.resolve("../sample/");
		const index = new CreateIndexUseCase().execute(workspaceFolder);

		const grammarDocument = index.documents["grammar.md"];
		expect(grammarDocument).not.toBeUndefined();
		expect(grammarDocument.occurrences.length).not.toBe(0);

		const linksDocument = index.documents["links.md"];
		expect(linksDocument).not.toBeUndefined();
		expect(linksDocument.occurrences.length).toBe(3);
	});
});
