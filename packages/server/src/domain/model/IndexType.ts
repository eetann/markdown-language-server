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

	addDocument(relativePath: string): void {
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
}
