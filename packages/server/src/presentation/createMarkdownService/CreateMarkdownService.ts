import { CommandProvider } from "@/usecase/shared/CommandProvider";
import {
	CodeActionKind,
	type Connection,
	type LanguageServicePlugin,
} from "@volar/language-server";
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
			referencesProvider: true,
			codeLensProvider: {
				resolveProvider: false,
			},
			codeActionProvider: {
				codeActionKinds: [CodeActionKind.RefactorRewrite],
			},
			executeCommandProvider: commandProvider.getCommandKeys(),
		},
		create: new InstanceCreator(connection, commandProvider).execute,
	};
};
