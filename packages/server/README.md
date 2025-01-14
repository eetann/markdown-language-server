# server

## SCIP
SCIPに独自の変更を加えている

```sh
mkdir proto
curl https://raw.githubusercontent.com/sourcegraph/scip/refs/heads/main/scip.proto > proto/scip.proto
pnpm install @bufbuild/protobuf
pnpm install -D @bufbuild/protoc-gen-es @bufbuild/buf
nvim buf.gen.yaml
pnpm exec buf generate
```


### TODO

- [x] VSCodeで開くリポジトリをsampleに変更
- [x] 補完のサンプルを追加
- [x] indexerの実装
- [ ] 生意気な見出しを注意するサンプルのdiagnosticを追加
