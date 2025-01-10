import {
	type Connection,
	DidChangeWatchedFilesNotification,
	FileChangeType,
	type LanguageServiceContext,
	type LanguageServicePluginInstance,
	MessageType,
	ShowMessageNotification,
} from "@volar/language-server";
import { URI } from "vscode-uri";

export class InstanceCreator {
	constructor(private connection: Connection) {}

	// Use arrow function to keep `this` in the defined scope
	execute = (
		_context: LanguageServiceContext,
	): LanguageServicePluginInstance => {
		this.initialize();
		return {};
	};

	async initialize() {
		console.debug("initialize start");

		const progress = await this.connection.window.createWorkDoneProgress();
		progress.begin("initializing...");

		this.connection.onNotification(
			DidChangeWatchedFilesNotification.type,
			(params) => {
				for (const change of params.changes) {
					switch (change.type) {
						case FileChangeType.Created:
							console.log(`File created: ${change.uri}`);
							break;
						case FileChangeType.Changed:
							console.log(`File changed: ${change.uri}`);
							break;
						case FileChangeType.Deleted:
							console.log(`File deleted: ${change.uri}`);
							break;
						default:
							break;
					}
				}
			},
		);

		progress.done();
		this.connection.sendNotification(ShowMessageNotification.type, {
			type: MessageType.Info,
			message: "Markdown Language Server initialized.",
		});
		console.debug("initialize end");
	}

	async getWorkspaceFolders() {
		const workspaceFolders: string[] = [];
		const folders =
			(await this.connection.workspace.getWorkspaceFolders()) ?? [];
		for (const folder of folders) {
			workspaceFolders.push(URI.parse(folder.uri).fsPath);
		}
		return workspaceFolders;
	}
}
