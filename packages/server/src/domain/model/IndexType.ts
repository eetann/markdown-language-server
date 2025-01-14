import type { Range as ZeroBasedRange } from "@volar/language-service";

export type Index = {
	workspaceFolder: string;
	documents: {
		[relativePath: string]: {
			headings: Heading[];
		};
	};
};

export type Heading = {
	text: string;
	range: ZeroBasedRange;
};
