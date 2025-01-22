import type { Text } from "mdast";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";
import { calcOffset } from "./utils";

describe("ProvideCompletionItemsUseCase calcOffset", () => {
	it("one line", () => {
		const textNode: Text = {
			type: "text",
			value: "[[]]",
			position: {
				start: { line: 5, column: 1 },
				end: { line: 5, column: 4 },
			},
		};
		const cursorPosition: ZeroBasedPosition = { line: 4, character: 2 };
		const result = calcOffset(textNode, cursorPosition);
		expect(result).toBe(2);
	});

	it("multiple line", () => {
		const textNode: Text = {
			type: "text",
			value: "foo\nbar[[]]",
			position: {
				start: { line: 5, column: 1 },
				end: { line: 6, column: 7 },
			},
		};
		const cursorPosition: ZeroBasedPosition = { line: 5, character: 5 };
		const result = calcOffset(textNode, cursorPosition);
		expect(result).toBe(9);
	});

	it("inside list", () => {
		const textNode: Text = {
			type: "text",
			value: "[[]]",
			position: {
				start: { line: 1, column: 3 },
				end: { line: 1, column: 7 },
			},
		};
		// - [[@]]
		// 01234 character = 4
		const cursorPosition: ZeroBasedPosition = { line: 0, character: 4 };
		const result = calcOffset(textNode, cursorPosition);
		// [[@]]
		// 012 result = 2
		expect(result).toBe(2);
	});

	it("after link", () => {
		const textNode: Text = {
			type: "text",
			value: "\n[[]]",
			position: {
				start: { line: 1, column: 27 },
				end: { line: 2, column: 5 },
			},
		};
		// [foo](https://example.com)
		// [[@]]
		// 012 character = 2
		const cursorPosition: ZeroBasedPosition = { line: 1, character: 2 };
		const result = calcOffset(textNode, cursorPosition);
		// \n[[@]]
		// 0 123 index = 3
		expect(result).toBe(3);
	});
});
