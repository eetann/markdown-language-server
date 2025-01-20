import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import {
	MarkdownParser,
	isWikiLinkNode,
} from "@/domain/service/markdownParser/MarkdownParser";
import type {
	CancellationToken,
	LanguageServicePluginInstance,
	LocationLink,
} from "@volar/language-service";
import type {
	Range,
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { getLineText } from "../shared/utils";

export class ProvideDefinitionUseCase {
	private markdownParser = new MarkdownParser();
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideDefinition"] = (
		textDocument: TextDocument,
		cursorPosition: ZeroBasedPosition,
	) => {
		const lineText = getLineText(textDocument, cursorPosition);
		const oneLinePosition = { ...cursorPosition, line: 0 };
		const node = this.markdownParser.getCurrentNode(lineText, oneLinePosition);

		if (!isWikiLinkNode(node)) {
			return [];
		}

		const [url, heading = ""] = node.value.split("#");
		if (url.startsWith("http")) {
			return [];
		}
		if (this.index.workspaceFolder === "") {
			return [];
		}
		// TODO: URLが空なら自身の見出しが対象
		const absolutePath = path.resolve(this.index.workspaceFolder, url);
		const targetUri = URI.file(absolutePath).toString();

		const doc = this.index.documents[url];
		if (!doc) {
			return [];
		}

		let range: Range = {
			start: { line: 0, character: 0 },
			end: { line: 0, character: 0 },
		};
		if (heading !== "") {
			const targetHeading = doc.headings.find((v) =>
				v.text.startsWith(heading),
			);
			if (targetHeading) {
				range = targetHeading.range;
			}
		}

		const location: LocationLink = {
			targetUri,
			targetRange: range,
			targetSelectionRange: range,
		};
		return [location];
	};
}
