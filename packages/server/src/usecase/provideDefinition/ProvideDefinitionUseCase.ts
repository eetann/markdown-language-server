import type { Index } from "@/domain/model/IndexType";
import type {
	CancellationToken,
	LanguageServicePluginInstance,
	LocationLink,
} from "@volar/language-service";
import type {
	TextDocument,
	Position as ZeroBasedPosition,
} from "vscode-languageserver-textdocument";

export class ProvideDefinitionUseCase {
	constructor(private index: Index) {
		console.log("constructor");
	}

	execute: LanguageServicePluginInstance["provideDefinition"] = (
		textDocument: TextDocument,
		position: ZeroBasedPosition,
		token: CancellationToken,
	) => {
		// if (token.isCancellationRequested) return;
		console.log("execute");
		return [
			{
				targetUri: textDocument.uri,
				targetRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 10 },
				},
				targetSelectionRange: {
					start: { line: 0, character: 0 },
					end: { line: 0, character: 10 },
				},
			},
		];
		// console.log(token);
		// // TODO: ここでtokenをパースしてindexから探す
		// const line = 0;
		// const range = {
		// 	start: { line, character: 0 },
		// 	end: { line, character: 1 },
		// };
		// const location: LocationLink = {
		// 	targetUri: "",
		// 	targetRange: range,
		// 	targetSelectionRange: range,
		// };
		// return [location];
	};
}
