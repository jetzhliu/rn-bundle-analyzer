# rn-bundle-analyzer

A CLI utility that analyses react-native bundle size and dependencies using webpack-bundle-analyzer

# usage

metro/src/lib/createModuleIdFactory.js

```js
function createModuleIdFactory() {
  const fileToIdMap = new Map();
  process.on("exit", () => {
    const pwdLength = process.cwd().length;
    const moduleIds = Array.from(fileToIdMap).reduce((acc, cur) => {
      acc[cur[1]] =
        "." + cur[0].substr(pwdLength).replace(/node_modules/g, "~");
      return acc;
    }, {});
    require("fs").writeFileSync(
      "./moduleIds.json",
      JSON.stringify(moduleIds, null, 2)
    );
  });
  // ...
}
```

```bash
node gen_stat.js {bundlePath} {moduleIds}
```
