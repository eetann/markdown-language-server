import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { type Config, default_config } from "@/domain/model/config/Config";
import { CompactDictionary, CompactDictionaryBuilder } from "jsmigemo";
import JSON5 from "json5";

export function getDict(migemo_path: string): CompactDictionary {
	if (migemo_path === "") {
		return new CompactDictionary(CompactDictionaryBuilder.build(new Map()));
	}
	const buffer = readFileSync(migemo_path);
	// @ts-ignore
	return new CompactDictionary(buffer.buffer);
}

export class LoadConfigUseCase {
	execute(workspaceFolder: string): Config {
		const config_path = path.join(workspaceFolder, "mdconfig.json5");
		if (!existsSync(config_path)) {
			return default_config;
		}
		try {
			const content = readFileSync(config_path, "utf-8");
			const user_config = JSON5.parse(content);
			// 設定が増えたらちゃんとvalidationライブラリを導入する
			if (
				typeof user_config.migemo_path === "string" &&
				existsSync(user_config.migemo_path)
			) {
				return { ...default_config, migemo_path: user_config.migemo_path };
			}
		} catch (error) {
			// TODO: エラー毎に処理を分ける
			console.log(error);
		}
		return default_config;
	}
}
