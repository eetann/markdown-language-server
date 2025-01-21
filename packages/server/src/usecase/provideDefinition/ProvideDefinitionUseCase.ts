import path from "node:path";
import type { Index, IndexDocument } from "@/domain/model/IndexType";
import {
	MarkdownParser,
	isWikiLinkNode,
} from "@/domain/service/markdownParser/MarkdownParser";
import type {
	LanguageServicePluginInstance,
	LocationLink,
} from "@volar/language-service";
import type {
	Range,
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";
import { URI } from "vscode-uri";
import { extractRelativePath } from "../shared/utils";

export class ProvideDefinitionUseCase {
	markdownParser = new MarkdownParser();
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideDefinition"] = (
		textDocument: TextDocument,
		cursorPosition: ZeroBasedPosition,
	) => {
		const node = this.markdownParser.getCurrentNode(
			textDocument.getText(),
			cursorPosition,
		);

		if (!isWikiLinkNode(node)) {
			return [];
		}

		const [url, heading = ""] = node.value.split("#");
		if (url.startsWith("http") || this.index.workspaceFolder === "") {
			return [];
		}

		const { relativePath, targetUri } = this.getPaths(url, textDocument.uri);
		const doc = this.index.getDocument(relativePath);
		if (!doc) {
			return [];
		}

		const range = this.getRange(doc, heading);
		const location: LocationLink = {
			targetUri,
			targetRange: range,
			targetSelectionRange: range,
		};
		return [location];
	};

	getPaths(url: string, documentUri: string) {
		let relativePath = url;
		let targetUri = documentUri;
		// 開いているファイルの場合は相対パスを取得
		if (relativePath === "") {
			relativePath = extractRelativePath(targetUri, this.index.workspaceFolder);
		} else {
			const absolutePath = path.resolve(this.index.workspaceFolder, url);
			targetUri = URI.file(absolutePath).toString();
		}
		return {
			relativePath,
			targetUri,
		};
	}

	getRange(doc: IndexDocument, heading: string): Range {
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
		return range;
	}
}
