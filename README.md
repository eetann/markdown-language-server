# Markdown Language Server
A Language Server for Markdown with support for advanced features like wikiLinks, heading navigation, and more.


## Features

- completion
- jump internal link
- create wikilink
- get links from other files


### Completion
You can complete links in Markdown files in wikiLink format.

![Completion](https://github.com/user-attachments/assets/58e63a56-f4d8-46b2-9406-eda86aeb1d59)

example:
- `[[foo.md|title]]`
- `[[foo.md#heading|title]]`
- `[[#my-heading]]`


### Goto Definition
You can jump to the Markdown file indicated by wikiLink under the cursor.

example:
- `[[foo.md|title]]` -> jump to file `foo.md`
- `[[foo.md#heading|title]]` -> jump to heading `heading` of the file `foo.md`
- `[[#my-heading]]` -> jump to heading `my-heading` of the open file


### Code Action
You can create a wikiLink based on the current cursor position.

![Code Action](https://github.com/user-attachments/assets/b08bc49f-b4f5-448b-ae1c-ef29b5323732)

example: foo.md
```markdown
# Title
sushi
## ninja
@ <- cursor here
## Tokyo
```
In this example, the following links can be created using Code Action.

- `[[foo.md]]`
- `[[foo.md|Title]]`
- `[[foo.md#ninja|Title]]`


### References
You can view a list of links to the open file.

![References](https://github.com/user-attachments/assets/68ae3907-9a72-4eb0-ac59-fbce47636918)

In the example in the image, `grammar.md` is open. There appear to be three links to `grammar.md`.


## What is considered Title?
In this Language Server, you will find titles in the following order.

1. first heading
2. first line

Maybe I can support frontmatter later?


## Internal link format
The format of internal links is a relative path starting from the workspace.
```
/workspace
/workspace/foo.md
/workspace/bar.md
```

-> It would be a link like `foo.md` and `bar.md`.


## setting
It is not available now.

When file `mdconfig.json5` is created, it is recognized as a workspace. The contents of the file can be empty.
This is useful in the mono-repo structure.

Maybe in the future use `mdconfig.json5` to load settings for each repository.


## How to use
You need to build.

### build
```sh
pnpm install
cd packages/server/
pnpm run build
```

### Neovim
Set up as follows.

```lua
local util = require("lspconfig.util")
local configs = require("lspconfig.configs")

-- Write down the path to this repository here
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


### VSCode
If you want to run it on VSCode, you also need VSCode extensions.
Fortunately, it is available in this repository.

```sh
cd packages/vscode/
pnpm run build
```


## Sample Repository for Testing
A sample workspace is available for those who want to try it out now.

```sh
cd packages/sample/
```

## Development
This Language Server is developed using [Volar](https://volarjs.dev/). Volar makes it easier to develop and test.

### Using Volar Labs in VSCode
It is useful to use VSCode and [Volar Labs](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volarjs-labs)(extension) when checking the behavior of Language Server.
Volar Labs makes it easy to check Language Server restart and initialization options and logs.

The debugging procedure is as follows.
1. Open this repository in VSCode
2. Use `Run and Debug` panel to launch `Launch Extension`
3. A debug window will then open
4. Open OUTPUT panel and set the channel to `Markdown Language Server by eetann`.

> [!NOTE]
> The OUTPUT channel named `Markdown Language Server` is made by VSCode.
> I'd like to rename the Language Server side of this repository, but I can't think of a good name.


