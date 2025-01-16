import { readdirSync } from "node:fs";
import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import type { IMarkdownParser } from "../shared/IMarkdownParser";
import { Indexer } from "./Indexer";

export class CreateIndexUseCase {
	constructor(private markdownParser: IMarkdownParser) {}

	execute(workspaceFolder: string): Index {
		const index: Index = {
			workspaceFolder,
			documents: {},
		};

		const entries = readdirSync(path.join(workspaceFolder), {
			recursive: true,
			withFileTypes: true,
		});
		for (const entry of entries) {
			if (
				entry.isDirectory() ||
				!entry.name.endsWith(".md") ||
				entry.parentPath.match("node_modules")
			) {
				continue;
			}
			const absolutePath = path.join(entry.parentPath, entry.name);
			new Indexer(this.markdownParser).execute(
				index,
				workspaceFolder,
				absolutePath,
				false,
			);
		}

		return index;
	}
}
