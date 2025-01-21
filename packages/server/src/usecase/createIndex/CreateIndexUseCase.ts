import { readdirSync } from "node:fs";
import path from "node:path";
import { Index } from "@/domain/model/IndexType";
import { Indexer } from "./Indexer";

export class CreateIndexUseCase {
	execute(workspaceFolder: string): Index {
		const index: Index = new Index(workspaceFolder);

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
			new Indexer().execute(index, absolutePath, false);
		}

		return index;
	}
}
