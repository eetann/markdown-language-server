import {
	type CompletionItem,
	CompletionItemKind,
	type LanguageServicePluginInstance,
} from "@volar/language-server";

export class ProvideCompletionItemsUseCase {
	constructor() {
		console.log("ProvideCompletionItemsUseCase constructor");
	}

	execute: LanguageServicePluginInstance["provideCompletionItems"] = (
		textDocument,
		position,
		_completionContext,
		token,
	) => {
		console.log("ProvideCompletionItemsUseCase execute");
		if (token.isCancellationRequested) return null;
		const items: CompletionItem[] = [];
		items.push({
			label: "volar-test!",
			kind: CompletionItemKind.Text,
		});
		return {
			isIncomplete: false,
			items: items,
		};
	};
}
