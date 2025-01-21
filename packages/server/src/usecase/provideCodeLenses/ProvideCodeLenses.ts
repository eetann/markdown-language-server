import { Range } from "@volar/language-server";
import type { LanguageServicePluginInstance } from "@volar/language-service";
import type { TextDocument } from "vscode-languageserver-textdocument";

export class ProvideCodeLenses {
	execute: LanguageServicePluginInstance["provideCodeLenses"] = (
		_textDocument: TextDocument,
	) => {
		return [
			{
				range: Range.create(0, 0, 1000, 0),
				command: {
					title: "get workspaceFolder",
					command: "get-workspacefolder",
				},
			},
		];
	};
}
