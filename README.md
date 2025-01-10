# markdown-language-server
WIP

## VSCodeでVolar Labsを動かす
このリポジトリをVSCodeで開いて、debug and runから`Launch Extension`

## Language Serverを試すとき

Neovimの場合

```lua
local util = require("lspconfig.util")
local configs = require("lspconfig.configs")

-- ここにこのリポジトリのパスを書いておく
local server_path = vim.fn.expand("~/ghq/github.com/eetann/markdown-language-server/")

configs["markdown-language-server"] = {
	default_config = {
		cmd = { "node", server_path .. "packages/server/bin/markdown-language-server.cjs", "--stdio" },
		filetypes = { "markdown" },
		root_dir = util.root_pattern(".git"),
		settings = {},
	},
}

local lspconfig = require("lspconfig")
lspconfig["markdown-language-server"].setup{
  capabilities = capabilities
}
```

```sh
pnpm install
pnpm run build
```

### 試す用のリポジトリ

```sh
cd packages/sample/
```

## VSCodeで動かす

```sh
cd packages/vscode
pnpm run build
```
このリポジトリをVSCodeで開いて、debug and runから`Launch Extension`。

### TODO

- [ ] VSCodeで開くリポジトリをsampleに変更
- [ ] 生意気な見出しを注意するサンプルのdiagnosticを追加
- [ ] 補完のサンプルを追加
- [ ] indexerの実装
