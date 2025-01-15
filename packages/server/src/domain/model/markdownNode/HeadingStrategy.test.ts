import path from "node:path";
import { CreateIndexUseCase } from "@/usecase/createIndex/CreateIndexUseCase";

describe("HeadingStrategy.test", () => {
	it("normal", () => {
		const workspaceFolder = path.resolve("../sample/");
		const index = new CreateIndexUseCase().execute(workspaceFolder);

		const headingsDocument = index.documents["headings.md"];
		expect(headingsDocument.headings.length).toBe(9);
		expect(headingsDocument.headings).toContainEqual(
			expect.objectContaining({
				text: "H1 Heading",
			}),
		);
		expect(headingsDocument.headings).toContainEqual(
			expect.objectContaining({
				text: "with `inline codeblock`",
			}),
		);
	});
});
