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
import { extractRelativePath } from "../shared/utils";
import { Score, calcOffset, getSortText } from "./utils";

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
		// items.push({
		// 	label: "volar-test!",
		// 	kind: CompletionItemKind.Text,
		// });

		if (this.isShouldProvide(textDocument, position)) {
			items.push(...this.provideWikilink(textDocument.uri));
		}

		return {
			isIncomplete: false,
			items,
		};
	};

	isShouldProvide(
		textDocument: TextDocument,
		cursorPosition: ZeroBasedPosition,
	): boolean {
		const node = this.markdownParser.getCurrentNode(
			textDocument.getText(),
			cursorPosition,
		);

		if (isTextNode(node)) {
			// [[の直後なら補完させる
			const cursorOffset = calcOffset(node, cursorPosition);
			if (
				2 <= cursorOffset &&
				node.value.slice(cursorOffset - 2, cursorOffset) === "[["
			) {
				return true;
			}
		}
		return false;
	}

	provideWikilink(currentUri: string): CompletionItem[] {
		const items: CompletionItem[] = [];
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			// TODO: titleのエスケープが必要であればやる
			const label = doc.title === "" ? relativePath : doc.title;
			items.push({
				label: relativePath,
				kind: CompletionItemKind.Text,
				insertText: relativePath,
				detail: "file.md",
				sortText: getSortText(relativePath, Score.filename),
				documentation: `Title: ${label}`,
			});
			const insertText = `${relativePath}|${label}`;
			items.push({
				label: insertText,
				kind: CompletionItemKind.Text,
				insertText,
				detail: "file.md|title",
				sortText: getSortText(insertText, Score.filenameTitle),
				documentation: insertText,
			});
			const currentRelativePath = extractRelativePath(
				this.index.workspaceFolder,
				currentUri,
			);
			const isCurrentFile = currentRelativePath === relativePath;
			for (const heading of doc.headings) {
				if (isCurrentFile) {
					const label = `#${heading.text}`;
					items.push({
						label,
						kind: CompletionItemKind.Text,
						insertText: label,
						detail: "#heading-this-file",
						sortText: getSortText(label, Score.heading),
						documentation: label,
					});
				} else {
					const label = `${relativePath}#${heading.text}`;
					const insertText = `${relativePath}#${heading.text}|${heading.text}`;
					items.push({
						label,
						kind: CompletionItemKind.Text,
						insertText,
						detail: "file.md#heading|title",
						sortText: getSortText(label, Score.filenameHeadingTitle),
						documentation: insertText,
					});
				}
			}
		}

		return items;
	}
}
