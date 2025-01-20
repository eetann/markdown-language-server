import type { Range as ZeroBasedRange } from "@volar/language-service";

export type Heading = {
	text: string;
	range: ZeroBasedRange;
};

export type IndexDocument = {
	headings: Heading[];
	title: string;
};

export type Index = {
	workspaceFolder: string;
	documents: {
		[relativePath: string]: IndexDocument;
	};
};
