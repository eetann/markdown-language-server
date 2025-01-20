import type { Index } from "@/domain/model/IndexType";
import {
	MarkdownParser,
	isTextNode,
} from "@/domain/service/markdownParser/MarkdownParser";
import {
	type CompletionItem,
	CompletionItemKind,
	type LanguageServicePluginInstance,
	Range,
} from "@volar/language-server";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";

export class ProvideCompletionItemsUseCase {
	private markdownParser = new MarkdownParser();
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideCompletionItems"] = (
		textDocument,
		position,
		_completionContext,
		token,
	) => {
		if (token.isCancellationRequested) return null;
		const items: CompletionItem[] = [];
		items.push({
			label: "volar-test!",
			kind: CompletionItemKind.Text,
		});
		items.push(...this.createItems(textDocument, position));
		return {
			isIncomplete: false,
			items: items,
		};
	};

	createItems(
		textDocument: TextDocument,
		position: ZeroBasedPosition,
	): CompletionItem[] {
		const items: CompletionItem[] = [];
		const lineText = textDocument.getText(
			Range.create(position.line, 0, position.line + 1, 0),
		);
		if (!this.isShouldProvide(lineText, position)) {
			return items;
		}

		// TODO: ファイル名+タイトルの補完
		// TODO: ファイル名+タイトル+見出しの補完
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			const label = doc.title === "" ? relativePath : doc.title;
			items.push({
				label,
				kind: CompletionItemKind.File,
				insertText: relativePath,
				detail: "File name only",
			});
			// for (const heading of doc.headings) {
			// }
		}
		return items;
	}

	isShouldProvide(
		lineText: string,
		cursorPosition: ZeroBasedPosition,
	): boolean {
		const position = { ...cursorPosition, line: 0 };
		const node = this.markdownParser.getCurrentNode(lineText, position);

		if (isTextNode(node)) {
			const match = node.value.match(/\[\[/);
			// [[の直後なら補完させる
			if (
				match?.index != null &&
				// character 0[1[2 (0-base)
				// column [[
				//        ^ = 1 (1-base)
				// index [[
				//       ^ = 0 (0-base)
				position.character + 1 === node.position.start.column + match.index + 2
			) {
				return true;
			}
		}
		return false;
	}
}
