# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

## List
### Bullet List
- This is a bullet list
- The much-anticipated bullet list
    - So happy to have bullets
    - The long-awaited nesting
        - The nest of the nest, a dream come true

* List with asterisks
- List with hyphens
+ List with pluses

### Numbered List
1. Numbered list
2. This one isn't much different

### Checkboxes
- [ ] Unchecked
- [x] Checked
    - Bullet points
    - [ ] Unchecked
    - [x] Checked

- Bullet points
- [ ] Unchecked
- [x] Checked
- [-] Canceled

## Text Formatting

**Bold** and of course, *italic* for stylish formatting.
Here is an example of ~~strikethrough~~.
Inline code like `print("hello")` is also supported.

## Link Rendering
[Link](https://example.com) will only display the text part.
![Image](test.png) will change the icon.

There are others that change the icon (customizable).
- [Link to github.com](https://github.com/MeanderingProgrammer/render-markdown.nvim)
- [Link to neovim.io](https://neovim.io/doc/user/vim_diff.html#nvim-features)
- [Link to file](test.md)
- [[wikilink]]
- [[wikilink|Displayed Text for wikilink]]

## Table Rendering
Alignments are also expressed.

| Default    | Left Align | Centered     | Right Align |
| ---------- | :--------- | :----------: | ----------: |
| Item       | `Code`     | **Bold**     | ~~Strike~~  |
| Item       | Item       | [Link](/test)| Item        |
| 1          | 2          | 3            | 4           |

## Code Block Decorations

```lua
vim.print("fooo")
-- Lua comment
```

```
言語指定なし
```

```diff
- Don't delete me... Help me...
+ I have taken over
```

```txt title="foo"
with title
```

## Quote
> This is a wonderful sentence.
> How lovely it is. So captivating.

## Callouts

> [!NOTE]
> The ones you see on GitHub and such.

> [!WARNING] Title reflected as well
> Here is the body of the callout.

> [!CAUTION]
> Warning

> [!HINT]
> If it's a hint, write `[!HINT]`.

> [!FAQ]
> Many commonly used ones are available.

> [!TLDR]
> Of course, customizable.

## Horizontal Line
↓ Horizontal line

---

↑ Horizontal line
