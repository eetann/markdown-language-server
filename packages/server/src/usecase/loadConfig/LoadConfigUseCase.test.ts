import { vol } from "memfs";
import { LoadConfigUseCase } from "./LoadConfigUseCase";

vi.mock("fs", async () => {
	const memfs = await vi.importActual<{ fs: object }>("memfs");

	// Support both `import fs from "fs"` and "import { readFileSync } from "fs"`
	return { default: memfs.fs, ...memfs.fs };
});

beforeEach(() => {
	vol.reset();
});

describe("LoadConfig", () => {
	const workspaceFolder = "/workspace";
	const usecase = new LoadConfigUseCase();
	it("no file", () => {
		const result = usecase.execute(workspaceFolder);
		expect(result.migemo_path).toBe("");
	});

	it("normal file", () => {
		const json = {
			[`${workspaceFolder}/mdconfig.json5`]: `\
{
  migemo_path: "/workspace/jisyo"
}
`,
			[`${workspaceFolder}/jisyo`]: `\
うたu /歌/謡/
`,
		};
		vol.fromJSON(json, workspaceFolder);

		const result = usecase.execute(workspaceFolder);
		expect(result).toEqual({
			migemo_path: "/workspace/jisyo",
		});
	});

	it("wrong json5 format", () => {
		const json = {
			[`${workspaceFolder}/mdconfig.json5`]: `\
{
  migemo_path: "
}
`,
		};
		vol.fromJSON(json, workspaceFolder);
		const result = usecase.execute(workspaceFolder);
		expect(result.migemo_path).toBe("");
	});

	it("wrong json5 format", () => {
		const json = {
			[`${workspaceFolder}/mdconfig.json5`]: `\
{
  migemo_path: "/workspace/no-jisyo"
}
`,
		};
		vol.fromJSON(json, workspaceFolder);
		const result = usecase.execute(workspaceFolder);
		expect(result.migemo_path).toBe("");
	});
});
