import type { LanguageServicePlugin } from "@volar/language-service";

export class ProvideExecuteCommand {
	static provide(): LanguageServicePlugin["capabilities"]["executeCommandProvider"] {
		return { commands: ["get-workspacefolder"] };
	}
	register() {}
}
