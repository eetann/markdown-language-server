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
