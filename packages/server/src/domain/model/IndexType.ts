import type { Range as ZeroBasedRange } from "@volar/language-service";

export type Heading = {
	text: string;
	range: ZeroBasedRange;
};

export type IndexDocument = {
	headings: Heading[];
	title: string;
};

export class Index {
	documents: {
		[relativePath: string]: IndexDocument;
	} = {};
	constructor(public workspaceFolder = "") {}

	addOneDocument(relativePath: string): void {
		this.documents[relativePath] = {
			headings: [],
			title: "",
		};
	}

	getDocument(relativePath: string): IndexDocument | undefined {
		return this.documents[relativePath];
	}

	addHeading(relativePath: string, heading: Heading) {
		this.documents[relativePath].headings.push(heading);
	}

	extractTitle(relativePath: string, content: string): void {
		const targetDoc = this.documents[relativePath];
		// TODO: frontmatterがあった場合

		if (targetDoc.headings.length > 0) {
			targetDoc.title = targetDoc.headings[0].text;
			return;
		}

		targetDoc.title = content.split("\n")[0] ?? "";
	}
}
