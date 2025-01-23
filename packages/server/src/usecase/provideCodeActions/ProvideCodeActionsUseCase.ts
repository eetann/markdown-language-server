import type { Heading, Index } from "@/domain/model/IndexType";
import { CodeActionKind, Range } from "@volar/language-server";
import type {
	CodeAction,
	LanguageServicePluginInstance,
} from "@volar/language-service";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { extractRelativePath } from "../shared/utils";

export class ProvideCodeActionsUseCase {
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideCodeActions"] = (
		textDocument: TextDocument,
		range: Range,
	): CodeAction[] => {
		return [...this.actionCreateWikilink(textDocument, range)];
	};

	getWikilinkElement(textDocument: TextDocument, cursorRange: Range) {
		const relativePath = extractRelativePath(
			this.index.workspaceFolder,
			textDocument.uri,
		);
		// foo
		// ## target heading
		// target line
		// ## etc
		const doc = this.index.getDocument(relativePath);
		const lastHeading: Heading | undefined = doc.headings.findLast(
			(h) => h.range.end.line <= cursorRange.start.line,
		);
		let headingText = "";
		if (lastHeading && lastHeading.text !== doc.title) {
			headingText = lastHeading.text;
		}
		return {
			relativePath,
			headingText,
			title: doc.title,
		};
	}

	actionCreateWikilink(
		textDocument: TextDocument,
		cursorRange: Range,
	): CodeAction[] {
		if (this.index.workspaceFolder === "") {
			return [];
		}
		const codeActionList: CodeAction[] = [];
		const { relativePath, headingText, title } = this.getWikilinkElement(
			textDocument,
			cursorRange,
		);
		const range = Range.create(
			cursorRange.start.line + 1,
			0,
			cursorRange.start.line + 1,
			0,
		);

		const createCodeAction = (title: string, newText: string) => {
			codeActionList.push({
				title,
				kind: CodeActionKind.RefactorRewrite,
				edit: {
					documentChanges: [{ textDocument, edits: [{ range, newText }] }],
				},
			});
		};

		if (title !== "") {
			createCodeAction(
				"create wikilink with title",
				`[[${relativePath}|${title}]]\n`,
			);
			if (headingText !== "") {
				createCodeAction(
					"create wikilink with heading & title",
					`[[${relativePath}#${headingText}|${title}]]\n`,
				);
			}
		}
		const newText = `[[${relativePath}]]\n`;
		createCodeAction("create wikilink filename only", newText);
		return codeActionList;
	}
}
