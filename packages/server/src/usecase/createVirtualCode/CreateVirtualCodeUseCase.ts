import type { CodeMapping, LanguagePlugin } from "@volar/language-server";
import type { VirtualCode } from "@volar/language-server";
import type { IScriptSnapshot } from "typescript";

export class MarkdownVirtualCode implements VirtualCode {
	id = "root";
	languageId = "markdown";
	mappings: CodeMapping[];

	constructor(public snapshot: IScriptSnapshot) {
		this.mappings = [
			{
				sourceOffsets: [0],
				generatedOffsets: [0],
				lengths: [snapshot.getLength()],
				data: {
					verification: true,
					completion: true,
					semantic: true,
					navigation: true,
					structure: true,
					format: true,
				},
			},
		];
	}
}

export class CreateVirtualCodeUseCase {
	execute: LanguagePlugin["createVirtualCode"] = (_, languageId, snapshot) => {
		if (languageId === "markdown") {
			return new MarkdownVirtualCode(snapshot);
		}
		return undefined;
	};
}
