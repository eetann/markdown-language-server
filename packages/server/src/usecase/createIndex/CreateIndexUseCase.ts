import { readdirSync } from "node:fs";
import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import type { IIndexer } from "../shared/IIndexer";

export class CreateIndexUseCase {
	constructor(private indexer: IIndexer) {}

	execute(workspaceFolder: string): Index {
		const index: Index = this.indexer.createIndex(workspaceFolder);

		const entries = readdirSync(workspaceFolder, {
			recursive: true,
			withFileTypes: true,
		});
		for (const entry of entries ?? []) {
			if (
				entry.isDirectory() ||
				!entry.name.endsWith(".md") ||
				entry.parentPath.match("node_modules")
			) {
				continue;
			}
			const absolutePath = path.join(entry.parentPath, entry.name);
			this.indexer.addDocument(index, absolutePath);
		}

		return index;
	}
}
