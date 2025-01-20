import type { Index } from "@/domain/model/IndexType";

export class TitleExtractor {
	execute(index: Index, relativePath: string, content: string): void {
		const targetDoc = index.documents[relativePath];
		// TODO: frontmatterがあった場合

		if (targetDoc.headings.length > 0) {
			targetDoc.title = targetDoc.headings[0].text;
			return;
		}

		targetDoc.title = content.split("\n")[0] ?? "";
	}
}
