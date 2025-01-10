import { CreateVirtualCodeUseCase } from "@/usecase/createVirtualCode/CreateVirtualCodeUseCase";
import type { LanguagePlugin } from "@volar/language-core";
import type { URI } from "vscode-uri";

export const MarkdownLanguagePlugin: LanguagePlugin<URI> = {
	getLanguageId(uri) {
		if (uri.path.endsWith("md")) {
			return "markdown";
		}
	},
	createVirtualCode(scriptId, languageId, snapshot, ctx) {
		return new CreateVirtualCodeUseCase().execute(
			scriptId,
			languageId,
			snapshot,
			ctx,
		);
	},
	// updateVirtualCode(uri, languageCode, snapshot) {
	// 	languageCode.update(snapshot);
	// 	return languageCode;
	// },
};
