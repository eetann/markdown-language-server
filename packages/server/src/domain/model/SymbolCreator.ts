function escapedIdentifier(value: string) {
	if (!value) {
		return "";
	}
	if (/^[\w_$+-]+$/i.test(value)) {
		return value;
	}
	return `\`${value.replace(/`/g, "``")}\``;
}

export class SymbolCreator {
	private scheme = "markdown-language-server";
	// <package> ::= <manager> ' ' <package-name> ' ' <version>
	private package = ". . .";
	private _filename: string;
	constructor(filename: string) {
		this._filename = escapedIdentifier(filename);
	}

	get filename() {
		return `${this.scheme} ${this.package} ${this._filename}/`;
	}

	createNamespace(parentSymbol: string, namespace: string) {
		return `${parentSymbol}${escapedIdentifier(namespace)}/`;
	}
}
