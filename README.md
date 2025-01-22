# markdown-language-server
WIP

- wikilink
    - 補完(見出し付きのやつも追加)
    - 作成(CodeAction経由で可能)
    - 遷移
        - カーソル位置のwikilinkのノートを開く
        - 見出し付きも対応

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
		root_dir = util.root_pattern("mdconfig.json5", ".git"),
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
cd packages/server/
pnpm run build
```

### 試す用のリポジトリ

```sh
cd packages/sample/
```

## VSCodeで動かす

```sh
cd packages/vscode/
pnpm run build
```
このリポジトリをVSCodeで開いて、debug and runから`Launch Extension`。
