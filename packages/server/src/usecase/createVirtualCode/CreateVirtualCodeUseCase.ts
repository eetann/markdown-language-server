import type { LanguagePlugin } from "@volar/language-server";
import type { VirtualCode } from "@volar/language-server";
import type { IScriptSnapshot } from "typescript";

export class MarkdownVirtualCode implements VirtualCode {
	id = "root";
	languageId = "markdown";
	mappings = [];

	constructor(public snapshot: IScriptSnapshot) {
		this.mappings = [
			{
				sourceOffsets: [0],
				generatedOffsets: [0],
				lengths: [snapshot.getLength()],
				data: {
					completion: true,
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
