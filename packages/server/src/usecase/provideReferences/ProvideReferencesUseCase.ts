import type { Index } from "@/domain/model/IndexType";
import { getUriFromRelativePath } from "@/domain/shared/utils";
import type {
	LanguageServicePluginInstance,
	Location,
} from "@volar/language-service";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { extractUri } from "../shared/utils";

export class ProvideReferencesUseCase {
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideReferences"] = (
		textDocument: TextDocument,
	): Location[] => {
		if (this.index.workspaceFolder === "") {
			return [];
		}
		const currentUri = extractUri(textDocument.uri);
		const locations: Location[] = [];
		for (const [relativePath, doc] of Object.entries(this.index.documents)) {
			const linkNodeUri = getUriFromRelativePath(
				this.index.workspaceFolder,
				relativePath,
			);
			for (const internalLink of doc.internalLinks) {
				if (internalLink.targetUri === currentUri) {
					locations.push({
						uri: linkNodeUri,
						range: internalLink.linkNodeRage,
					});
				}
			}
		}
		return locations;
	};
}
