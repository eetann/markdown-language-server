import type { Index } from "@/domain/model/IndexType";
import {
	MarkdownParser,
	isTextNode,
} from "@/domain/service/markdownParser/MarkdownParser";
import {
	type CompletionItem,
	CompletionItemKind,
	type LanguageServicePluginInstance,
} from "@volar/language-server";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { getLineText } from "../shared/utils";

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
		const lineText = getLineText(textDocument, position);
		if (!this.isShouldProvide(lineText, position)) {
			return items;
		}

		items.push(...this.provideWikilink());
		return items;
	}

	isShouldProvide(
		lineText: string,
		cursorPosition: ZeroBasedPosition,
	): boolean {
		const oneLinePosition = { ...cursorPosition, line: 0 };
		const node = this.markdownParser.getCurrentNode(lineText, oneLinePosition);

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
				oneLinePosition.character + 1 ===
					node.position.start.column + match.index + 2
			) {
				return true;
			}
		}
		return false;
	}

	provideWikilink(): CompletionItem[] {
		const items: CompletionItem[] = [];
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			// TODO: titleのエスケープが必要であればやる
			const label = doc.title === "" ? relativePath : doc.title;
			items.push({
				label,
				kind: CompletionItemKind.File,
				insertText: relativePath,
				detail: "File name only",
				documentation: relativePath,
			});
			items.push({
				label,
				kind: CompletionItemKind.Text,
				insertText: `${relativePath}|${label}`,
				detail: "File and Title",
				documentation: `${relativePath}|${label}`,
			});
			for (const heading of doc.headings) {
				// TODO: 現在開いているファイルなら、ファイル名を削る
				const insertText = `${relativePath}#${heading.text}|${heading.text}`;
				items.push({
					label: `${relativePath}#${heading.text}`,
					kind: CompletionItemKind.Text,
					insertText,
					detail: "File and Heading",
					documentation: insertText,
				});
			}
		}

		return items;
	}
}
