import type { Index } from "@/domain/model/IndexType";
import { CreateIndexUseCase } from "@/usecase/createIndex/CreateIndexUseCase";
import { ProvideCodeLenses } from "@/usecase/provideCodeLenses/ProvideCodeLenses";
import { ProvideCompletionItemsUseCase } from "@/usecase/provideCompletionItems/ProvideCompletionItemsUseCase";
import { ProvideDefinitionUseCase } from "@/usecase/provideDefinition/ProvideDefinitionUseCase";
import type { CommandProvider } from "@/usecase/shared/CommandProvider";
import { getWorkspaceFolders } from "@/usecase/shared/utils";
import {
	type Connection,
	DidChangeWatchedFilesNotification,
	FileChangeType,
	type LanguageServiceContext,
	type LanguageServicePluginInstance,
	MessageType,
	ShowMessageNotification,
} from "@volar/language-server";

export class InstanceCreator {
	private index: Index = { workspaceFolder: "", documents: {} };
	constructor(
		private connection: Connection,
		private commandProvider: CommandProvider,
	) {}

	// Use arrow function to keep `this` in the defined scope
	execute = (
		_context: LanguageServiceContext,
	): LanguageServicePluginInstance => {
		this.initialize();
		// @volar/language-core の lib/editorFeatures.ts でフラグを確認する
		// たとえば、VirtualCodeのmappings.data.navigationがtrueじゃないとprovideDefinitionは有効にならない
		return {
			provideCompletionItems: (...args) =>
				new ProvideCompletionItemsUseCase(this.index).execute(...args),
			provideDefinition: (...args) =>
				new ProvideDefinitionUseCase(this.index).execute(...args),
			provideCodeLenses: (...args) => new ProvideCodeLenses().execute(...args),
		};
	};

	async initialize() {
		console.debug("initialize start");

		const progress = await this.connection.window.createWorkDoneProgress();
		progress.begin("initializing...");

		this.commandProvider.onExecuteCommand();
		await this.createIndex();
		this.onChange();

		progress.done();
		this.connection.sendNotification(ShowMessageNotification.type, {
			type: MessageType.Info,
			message: "Markdown Language Server initialized.",
		});
		console.debug("initialize end");
	}

	async createIndex() {
		const workspaceFolders = await getWorkspaceFolders(this.connection);
		// TODO: ワークスペースが複数あるときの対応
		this.index = new CreateIndexUseCase().execute(workspaceFolders[0]);
	}

	onChange() {
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
	}
}
