#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const util = require("util");
const { execSync } = require("child_process");

const libs = {
  lodash: { global: "_", files: ["lodash.min.js"] },
  vue: { global: "Vue", files: ["dist/vue.runtime.min.js"] },
  vuetify: { global: "Vuetify", files: ["dist/vuetify.min.css", "dist/vuetify.min.js"] },
  vuex: { global: "Vuex", files: ["dist/vuex.min.js"] },
  "vue-router": { global: "VueRouter", files: ["dist/vue-router.min.js "] },
  "material-design-icons-iconfont": {
    files: ["dist/fonts/MaterialIcons-Regular.woff2", "dist/material-design-icons.css"]
  },
  "roboto-fontface": {
    files: [
      "fonts/roboto/Roboto-Regular.woff2",
      "fonts/roboto/Roboto-RegularItalic.woff2",
      "fonts/roboto/Roboto-Thin.woff2",
      "fonts/roboto/Roboto-ThinItalic.woff2",
      "fonts/roboto/Roboto-Light.woff2",
      "fonts/roboto/Roboto-LightItalic.woff2",
      "fonts/roboto/Roboto-Medium.woff2",
      "fonts/roboto/Roboto-MediumItalic.woff2",
      "fonts/roboto/Roboto-Bold.woff2",
      "fonts/roboto/Roboto-BoldItalic.woff2",
      "fonts/roboto/Roboto-Black.woff2",
      "fonts/roboto/Roboto-BlackItalic.woff2",
      "css/roboto/roboto-fontface.css"
    ]
  }
};

execSync("mkdir -p ./public/libs");

const libsJson = {};
for (mod of Object.keys(libs)) {
  console.log(`module:${mod}`);
  const info = libs[mod];
  for (f of info.files) {
    console.log(`\t\t${f}`);
    const from = path.join("./node_modules", mod, f);
    const to = path.join("./public/libs/", mod, f);

    execSync(`mkdir -p ${path.dirname(to)}`);
    execSync(`cp -f ${from} ${to}`);
  }
  // 更新库信息
  const pkg = JSON.parse(fs.readFileSync(path.join("./node_modules", mod, "package.json")));

  libsJson[mod] = {
    version: pkg.version,
    global: info.global,
    js: info.files.filter(name => {
      // return false;
      return name.search(/.*\.js$/) >= 0;
    }),
    css: info.files.filter(name => {
      // return false;
      return name.search(/.*\.css$/) >= 0;
    })
  };
  console.log(libsJson);
  fs.writeFileSync("./public/libs/libs.json", JSON.stringify(libsJson, null, 2));
}
