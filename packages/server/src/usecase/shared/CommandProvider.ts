import type { Connection, LanguageServicePlugin } from "@volar/language-server";
import {
	type ExecuteCommandParams,
	MessageType,
	ShowMessageNotification,
} from "@volar/language-server";
import { getWorkspaceFolders } from "./utils";

export const COMMAND_GET_WORKSPACEFOLDER = "get-workspacefolder";

export class CommandProvider {
	private commands: Record<string, (...args: unknown[]) => void>;
	constructor(private connection: Connection) {
		this.commands = {
			[COMMAND_GET_WORKSPACEFOLDER]: async () => {
				this.getWorkspaceFolders();
			},
		};
	}

	getCommandKeys(): LanguageServicePlugin["capabilities"]["executeCommandProvider"] {
		return { commands: Object.keys(this.commands) };
	}

	async executeCommand(params: ExecuteCommandParams) {
		if (this.commands[params.command]) {
			this.commands[params.command](...params.arguments);
		} else {
			console.log("called unknown command");
			console.log(params.command);
		}
	}

	onExecuteCommand() {
		this.connection.onExecuteCommand(
			async (params) => await this.executeCommand(params),
		);
	}

	async getWorkspaceFolders() {
		const workspaceFolders = await getWorkspaceFolders(this.connection);
		const message = `workspaceFolders:\n${workspaceFolders.join("\n")}`;
		this.connection.sendNotification(ShowMessageNotification.type, {
			message,
			type: MessageType.Info,
		});
		console.debug(workspaceFolders);
	}
}
