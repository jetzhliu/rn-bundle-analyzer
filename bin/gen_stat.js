const fs = require("fs").promises;
const bundlePath = process.argv[2];
if (!bundlePath) {
  console.error(`usage: node gen_stat.js {bundlePath} {moduleIds}`);
  process.exit(-1);
}
const moduleIds = process.argv[3] || "";

function extraModules(content, id2path) {
  const modules = [];
  const id2module = [];
  const reg = /^__d\((.+?),(\d+),\[([\d,]+)?\]\);$/gm;
  let m;
  while ((m = reg.exec(content))) {
    const mod = {
      id: m[2],
      name: id2path ? id2path[m[2]] : `./${m[2]}.js`,
      chunks: ["main"],
      size: m[1].length
    };
    id2module[parseInt(m[2], 10)] = {
      info: mod,
      src: m[1],
      deps: m[3] && m[3].split(",")
    };
    modules.push(mod);
  }
  const webpackBundle = `(function(){})([${id2module
    .map(mod => {
      if (mod) {
        return mod.src;
      } else {
        return "";
      }
    })
    .join(",\n")}])`;
  return {
    modules,
    id2module,
    webpackBundle
  };
}
async function main() {
  const content = await fs.readFile(bundlePath, "utf-8");
  const id2path = moduleIds && require(moduleIds);
  const { modules, id2module, webpackBundle } = extraModules(content, id2path);
  const stat = {
    assets: [
      {
        name: "webpackbundle.js",
        size: 100,
        chunks: ["main"]
      }
    ],
    chunks: [
      {
        modules
      }
    ]
  };
  await Promise.all([
    fs.writeFile("./stat.json", JSON.stringify(stat, null, 2)),
    fs.writeFile("./webpackbundle.js", webpackBundle)
  ]);
}
main();
// const stat = {
//   assets: [
//     {
//       name: "webpackbundle.js",
//       size: 100,
//       chunks: ["main"]
//     }
//   ],
//   chunks: [
//     {
//       modules: [
//         {
//           id: "1",
//           name: "./1.js",
//           size: 10,
//           chunks: ["main"]
//         }
//       ]
//     }
//   ]
// };
// fs.writeFileSync("./stat.json", JSON.stringify(stat, null, 2));
