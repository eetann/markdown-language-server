import type { Index } from "@/domain/model/IndexType";

export abstract class IIndexer {
	abstract createIndex(workspaceFolder: string): Index;

	abstract addDocument(index: Index, absolutePath: string): void;

	abstract deleteDocument(index: Index, absolutePath: string): void;
}
