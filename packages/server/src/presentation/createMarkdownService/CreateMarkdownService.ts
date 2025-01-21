import { CommandProvider } from "@/usecase/shared/CommandProvider";
import type { Connection, LanguageServicePlugin } from "@volar/language-server";
import { InstanceCreator } from "./InstanceCreator";

export const createMarkdownService = (
	connection: Connection,
): LanguageServicePlugin => {
	const commandProvider = new CommandProvider(connection);
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
			executeCommandProvider: commandProvider.getCommandKeys(),
		},
		create: new InstanceCreator(connection, commandProvider).execute,
	};
};
