import { Index } from "@/domain/model/IndexType";
import { Indexer } from "@/infrastructure/indexer/Indexer";
import { CreateIndexUseCase } from "@/usecase/createIndex/CreateIndexUseCase";
import { ProvideCodeActionsUseCase } from "@/usecase/provideCodeActions/ProvideCodeActionsUseCase";
import { ProvideCodeLensesUseCase } from "@/usecase/provideCodeLenses/ProvideCodeLensesUseCase";
import { ProvideCompletionItemsUseCase } from "@/usecase/provideCompletionItems/ProvideCompletionItemsUseCase";
import { ProvideDefinitionUseCase } from "@/usecase/provideDefinition/ProvideDefinitionUseCase";
import { ProvideReferencesUseCase } from "@/usecase/provideReferences/ProvideReferencesUseCase";
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
import { URI } from "vscode-uri";

export class InstanceCreator {
	private index: Index = new Index();
	private indexer = new Indexer();
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
			provideReferences: (...args) =>
				new ProvideReferencesUseCase(this.index).execute(...args),
			provideCodeLenses: (...args) =>
				new ProvideCodeLensesUseCase().execute(...args),
			provideCodeActions: (...args) =>
				new ProvideCodeActionsUseCase(this.index).execute(...args),
		};
	};

	async initialize() {
		console.debug("initialize start");

		const progress = await this.connection.window.createWorkDoneProgress();
		progress.begin("Loading workspace");

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
		this.index = new CreateIndexUseCase(this.indexer).execute(
			workspaceFolders[0],
		);
	}

	onChange() {
		this.connection.onNotification(
			DidChangeWatchedFilesNotification.type,
			(params) => {
				for (const change of params.changes) {
					const absolutePath = URI.parse(change.uri).fsPath;
					switch (change.type) {
						case FileChangeType.Created:
							console.debug(`File created: ${absolutePath}`);
							this.indexer.addDocument(this.index, absolutePath);
							break;
						case FileChangeType.Changed:
							console.debug(`File changed: ${absolutePath}`);
							this.indexer.addDocument(this.index, absolutePath);
							break;
						case FileChangeType.Deleted:
							console.debug(`File deleted: ${absolutePath}`);
							this.indexer.deleteDocument(this.index, absolutePath);
							break;
						default:
							break;
					}
				}
			},
		);
	}
}
