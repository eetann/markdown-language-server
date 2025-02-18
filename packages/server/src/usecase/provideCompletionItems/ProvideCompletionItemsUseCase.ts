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
import type Kuroshiro from "kuroshiro";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { extractRelativePath } from "../shared/utils";
import { Score, calcOffset, getSortText } from "./utils";

export class ProvideCompletionItemsUseCase {
	private markdownParser = new MarkdownParser();
	constructor(
		private index: Index,
		private kuroshiro: Kuroshiro,
	) {}

	execute: LanguageServicePluginInstance["provideCompletionItems"] = async (
		textDocument,
		position,
		_completionContext,
		token,
	) => {
		if (token.isCancellationRequested) return null;
		const items: CompletionItem[] = [];
		// items.push({
		// 	label: "volar-test!",
		// 	kind: CompletionItemKind.Value,
		// });

		if (this.isShouldProvide(textDocument, position)) {
			const _items = await this.provideWikilink(textDocument.uri);
			items.push(..._items);
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

	async provideWikilink(currentUri: string): Promise<CompletionItem[]> {
		const items: CompletionItem[] = [];
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			// TODO: titleのエスケープが必要であればやる
			const label = doc.title === "" ? relativePath : doc.title;
			items.push({
				label: relativePath,
				kind: CompletionItemKind.Value,
				insertText: relativePath,
				detail: "file.md",
				sortText: getSortText(relativePath, Score.filename),
				documentation: `Title: ${label}`,
			});
			const insertText = `${relativePath}|${label}`;
			const filterText = await this.getFilterText(insertText);
			items.push({
				label: insertText,
				kind: CompletionItemKind.Value,
				insertText,
				detail: "file.md|title",
				sortText: getSortText(insertText, Score.filenameTitle),
				filterText,
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
						kind: CompletionItemKind.Value,
						insertText: label,
						detail: "#heading-this-file",
						sortText: getSortText(label, Score.heading),
						documentation: label,
					});
				} else {
					const label = `${relativePath}#${heading.text}`;
					const insertText = `${relativePath}#${heading.text}|${heading.text}`;
					// TODO: 途中からの検索はできない？
					const filterText = await this.getFilterText(heading.text);
					items.push({
						label,
						kind: CompletionItemKind.Value,
						insertText,
						detail: "file.md#heading|title",
						sortText: getSortText(label, Score.filenameHeadingTitle),
						filterText,
						documentation: insertText,
					});
				}
			}
		}

		return items;
	}

	async getFilterText(text: string): Promise<string> {
		return await this.kuroshiro.convert(text, {
			to: "romaji",
			romajiSystem: "passport",
		});
	}
}
