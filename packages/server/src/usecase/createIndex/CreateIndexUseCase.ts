import { readdirSync } from "node:fs";
import path from "node:path";
import type { Index } from "@/domain/model/IndexType";
import { Indexer } from "./Indexer";

export class CreateIndexUseCase {
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
			if (!entry.isFile() || !entry.name.endsWith(".md")) {
				continue;
			}
			const absolutePath = path.join(entry.parentPath, entry.name);
			new Indexer().execute(index, workspaceFolder, absolutePath, false);
		}

		return index;
	}
}
