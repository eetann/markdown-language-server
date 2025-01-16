import type { Index } from "@/domain/model/IndexType";
import {
	type CompletionItem,
	CompletionItemKind,
	type LanguageServicePluginInstance,
} from "@volar/language-server";

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
		// TODO: リンク補完ができるのは条件付きにする
		// TODO: ファイル名だけの補完
		// TODO: ファイル名+タイトルの補完
		// TODO: ファイル名+タイトル+見出しの補完
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			console.log(relativePath);
			items.push({
				label: `[[${relativePath}]]`,
				kind: CompletionItemKind.Text,
			});
			// for (const heading of doc.headings) {
			// }
		}
		return {
			isIncomplete: false,
			items: items,
		};
	};
}
