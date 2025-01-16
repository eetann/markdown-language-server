import {
	createConnection,
	createServer,
	createSimpleProject,
} from "@volar/language-server/node";
import { MarkdownLanguagePlugin } from "./presentation/LanguagePlugin";
import { createMarkdownService } from "./presentation/createMarkdownService/CreateMarkdownService";

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize((params) => {
	return server.initialize(
		params,
		createSimpleProject([MarkdownLanguagePlugin]),
		[createMarkdownService(connection)],
	);
});

connection.onInitialized(server.initialized);
connection.onShutdown(server.shutdown);
