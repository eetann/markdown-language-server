import type { Heading, Index } from "@/domain/model/IndexType";
import { CodeActionKind, Range } from "@volar/language-server";
import type {
	CodeAction,
	LanguageServicePluginInstance,
	TextDocumentEdit,
	TextEdit,
} from "@volar/language-service";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { extractRelativePath } from "../shared/utils";

export class ProvideCodeActions {
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideCodeActions"] = (
		textDocument: TextDocument,
		range: Range,
	): CodeAction[] => {
		return [...this.actionCreateWikilink(textDocument, range)];
	};

	createWikilink(textDocument: TextDocument, cursorRange: Range): string {
		const relativePath = extractRelativePath(
			textDocument.uri,
			this.index.workspaceFolder,
		);
		let wikilink = "";
		// foo
		// ## target heading
		// target line
		// ## etc
		const doc = this.index.getDocument(relativePath);
		let url = relativePath;
		const lastHeading: Heading | undefined = doc.headings.findLast(
			(h) => h.range.end.line <= cursorRange.start.line,
		);
		if (lastHeading && lastHeading.text !== doc.title) {
			// TODO: エスケープ
			url += `#${lastHeading.text}`;
		}
		if (doc.title === "") {
			wikilink = `[[${url}]]`;
		} else {
			wikilink = `[[${url}|${doc.title}]]`;
		}

		wikilink += "\n";
		return wikilink;
	}

	actionCreateWikilink(
		textDocument: TextDocument,
		cursorRange: Range,
	): CodeAction[] {
		if (this.index.workspaceFolder === "") {
			return [];
		}
		const textEdit: TextEdit = {
			range: Range.create(
				cursorRange.start.line + 1,
				0,
				cursorRange.start.line + 1,
				0,
			),
			newText: this.createWikilink(textDocument, cursorRange),
		};
		const documentEdit: TextDocumentEdit = {
			textDocument,
			edits: [textEdit],
		};
		return [
			{
				title: "create wikilink based on cursor position",
				kind: CodeActionKind.RefactorRewrite,
				edit: {
					documentChanges: [documentEdit],
				},
			},
		];
	}
}
