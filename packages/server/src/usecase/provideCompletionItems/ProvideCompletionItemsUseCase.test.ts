import type { Index } from "@/domain/model/IndexType";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";
import { ProvideCompletionItemsUseCase } from "./ProvideCompletionItemsUseCase";

describe("ProvideCompletionItemsUseCase", () => {
	const index: Index = {
		workspaceFolder: "",
		documents: {},
	};
	const provider = new ProvideCompletionItemsUseCase(index);

	it("provide after [[", () => {
		const lineText = "foo [[ bar";
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		// foo [[@
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
		// foo [@[
		position.character = 5;
		expect(provider.isShouldProvide(lineText, position)).toBeFalsy();
	});

	it("provide inside [[ and ]]", () => {
		let lineText = "foo [[]]bar";
		// foo [[@]]bar
		const position: ZeroBasedPosition = {
			line: 0,
			character: 6,
		};
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
		// foo [[]@]bar
		position.character = 7;
		expect(provider.isShouldProvide(lineText, position)).toBeFalsy();
		// [[@]]
		lineText = "[[]]";
		position.character = 2;
		expect(provider.isShouldProvide(lineText, position)).toBeTruthy();
	});
});
