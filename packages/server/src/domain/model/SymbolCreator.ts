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
	private _namespace = "";
	private _local_id = 1;
	constructor(filename: string) {
		this._filename = escapedIdentifier(filename);
	}

	get filename() {
		return `${this.scheme} ${this.package} ${this._filename}/`;
	}

	get namespace() {
		if (this._namespace !== "") {
			return this._namespace;
		}
		return this.filename;
	}

	createNamespace(namespace: string) {
		this._namespace = `${this.scheme} ${this.package} ${escapedIdentifier(namespace)}/`;
		return this._namespace;
	}

	createType(type: string) {
		return `${this.namespace}${escapedIdentifier(type)}#`;
	}
	createTerm(parentSymbol: string, term: string) {
		return `${parentSymbol}${escapedIdentifier(term)}.`;
	}

	createMethod(parentSymbol: string, method: string) {
		return `${parentSymbol}${escapedIdentifier(method)}().`;
	}

	createIdentifier(identifier: string) {
		return `${this.namespace}${escapedIdentifier(identifier)}#`;
	}

	createLocalId() {
		return `local ${this._local_id++}`;
	}
}
