import type { Index } from "@/domain/model/IndexType";
import {
	type CompletionItem,
	CompletionItemKind,
	type LanguageServicePluginInstance,
	Range,
} from "@volar/language-server";
import type {
	Position,
	TextDocument,
} from "vscode-languageserver-textdocument";

export class ProvideCompletionItemsUseCase {
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
		position: Position,
	): CompletionItem[] {
		const items: CompletionItem[] = [];
		const line = textDocument.getText(
			Range.create(position.line, 0, position.line + 1, 0),
		);
		// TODO: 正規表現だと2重を判定できない
		const inSideWikilink = /\[\[([^\]]*)\]\]/;
		if (!inSideWikilink.test(line)) {
			return [];
		}

		// TODO: リンク補完ができるのは条件付きにする
		// TODO: ファイル名だけの補完
		// TODO: ファイル名+タイトルの補完
		// TODO: ファイル名+タイトル+見出しの補完
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			items.push({
				label: relativePath,
				kind: CompletionItemKind.Text,
			});
			// for (const heading of doc.headings) {
			// }
		}
		return items;
	}
}
