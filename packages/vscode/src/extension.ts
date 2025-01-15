// ref: https://volarjs.dev/guides/first-server/#the-client
import * as serverProtocol from "@volar/language-server/protocol";
import { createLabsInfo } from "@volar/vscode";
import * as vscode from "vscode";
import * as lsp from "vscode-languageclient/node";

let client: lsp.BaseLanguageClient;

// As its name suggests, this function is called when the extension is activated.
export async function activate(context: vscode.ExtensionContext) {
	const serverModule = vscode.Uri.joinPath(
		context.extensionUri,
		"node_modules",
		"@eetann/markdown-language-server",
		"dist",
		"index.js",
	);
	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: { execArgv: <string[]>[] },
		},
		debug: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: { execArgv: ["--nolazy", `--inspect=${6009}`] },
		},
	};

	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [{ language: "markdown" }],
		initializationOptions: {},
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher("**/*.md"),
		},
	};

	// Create the language client with all the options we've defined, and start it.
	client = new lsp.LanguageClient(
		"markdown-language-server",
		"Markdown Language Server",
		serverOptions,
		clientOptions,
	);
	console.log("before start");
	await client.start();
	console.log("after start");

	// Needed code to add support for Volar Labs
	// https://volarjs.dev/core-concepts/volar-labs/
	const labsInfo = createLabsInfo(serverProtocol);
	labsInfo.addLanguageClient(client);
	return labsInfo.extensionExports;
}

// ... and this function is called when the extension is deactivated!
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deactivate(): Thenable<any> | undefined {
	return client?.stop();
}
