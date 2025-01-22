import type { Text } from "mdast";
import type { Position as ZeroBasedPosition } from "vscode-languageserver-textdocument";
// |                       | filename | heading | title | priority |
// |-----------------------|----------|---------|-------|----------|
// | foo.sm                | o        | x       | x     | 4        |
// | foo.xs\|title         | o        | x       | o     | 0        |
// | foo.xs#heading        | o        | o       | x     | 2        |
// | foo.xs#heading\|title | o        | o       | o     | 1        |
// | #heading              | x        | o       | x     | 3        |
// | #heading\|title       | x        | o       | o     | 5        |
export const Score = {
	filename: 4,
	filenameTitle: 0,
	filenameHeading: 2,
	filenameHeadingTitle: 1,
	heading: 3,
	headingTitle: 5,
};
type Score = (typeof Score)[keyof typeof Score];

export function getSortText(label: string, score: Score) {
	return `${"_".repeat(score)}${label}`;
}

export function calcOffset(
	textNode: Text,
	cursorPosition: ZeroBasedPosition,
): number {
	if (textNode.position.start.line === cursorPosition.line + 1) {
		return cursorPosition.character + 1 - textNode.position.start.column;
	}
	const targetLine = cursorPosition.line + 1 - textNode.position.start.line;
	const lines = textNode.value.split("\n");

	let index = 0;
	for (let i = 0; i < targetLine; i++) {
		index += lines[i].length + 1; // Add 1 for newline
	}
	index += cursorPosition.character;
	return index;
}
