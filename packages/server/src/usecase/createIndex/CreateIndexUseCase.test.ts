import path from "node:path";
import { CreateIndexUseCase } from "./CreateIndexUseCase";

describe("CreateIndexUseCase", () => {
	it("normal", () => {
		const workspaceFolder = path.resolve("../sample/");
		const index = new CreateIndexUseCase().execute(workspaceFolder);

		const prefix = "markdown-language-server . . .";
		const sampleDocument = index.documents["grammar.md"];
		expect(sampleDocument).not.toBeUndefined();
		// expect(sampleDocument.symbols).toHaveProperty(symbol);
	});
});
