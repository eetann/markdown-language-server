import type { Index } from "@/domain/model/IndexType";
import { getUriFromRelativePath } from "@/domain/shared/utils";
import type {
	LanguageServicePluginInstance,
	Location,
} from "@volar/language-service";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { extractRelativePath } from "../shared/utils";

export class ProvideReferencesUseCase {
	constructor(private index: Index) {}

	execute: LanguageServicePluginInstance["provideReferences"] = (
		textDocument: TextDocument,
	): Location[] => {
		if (this.index.workspaceFolder === "") {
			return [];
		}

		const currentRelativePath = extractRelativePath(
			this.index.workspaceFolder,
			textDocument.uri,
		);
		const locations: Location[] = [];
		for (const [docRelativePath, doc] of Object.entries(this.index.documents)) {
			for (const internalLink of doc.internalLinks) {
				if (internalLink.relativePath === currentRelativePath) {
					locations.push({
						uri: getUriFromRelativePath(
							this.index.workspaceFolder,
							docRelativePath,
						),
						range: internalLink.linkNodeRage,
					});
				}
			}
		}
		return locations;
	};
}
