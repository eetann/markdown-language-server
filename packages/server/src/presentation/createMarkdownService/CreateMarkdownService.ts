import { ProvideExecuteCommand } from "@/usecase/provideExecuteCommand/ProvideExecuteCommand";
import type { Connection, LanguageServicePlugin } from "@volar/language-server";
import { InstanceCreator } from "./InstanceCreator";

export const createMarkdownService = (
	connection: Connection,
): LanguageServicePlugin => {
	return {
		capabilities: {
			// textDocumentSyncはvolar側でIncrementalにしてるっぽい
			completionProvider: {
				triggerCharacters: ["["],
				resolveProvider: true,
			},
			definitionProvider: true,
			codeLensProvider: {
				resolveProvider: false,
			},
			executeCommandProvider: ProvideExecuteCommand.provide(),
		},
		create: new InstanceCreator(connection).execute,
	};
};
