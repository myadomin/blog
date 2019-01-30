## babel相关
用vue及react等框架一般会用es6, 而部分浏览器只能兼任到es5，所以用babel进行es6编译及转换为es5给浏览器解析，本文主要讲解`babel-loader`、`.babelrc`、`babel-preset-xxx`、`babel-polyfill`、` babel-plugin-transform-runtime`等概念，如何一步步配置babel。
1. 安装`babel-core` `babel-loader`, webpack配置babel-loader
``` javascript
{
  // babel-loader编译js文件 不包括node_modules文件
  test: /\.js[x]?$/,
  exclude: /node_modules/,
  use: ['babel-loader']
},
```
2. babel-loader可以编译js了，具体按什么规则编译，所以要写`.babelrc`
* 安装`babel-preset-env`, `babel-preset-react`,`babel-preset-stage-0`,
* package.json中定义`.babelrc.js`(相比`.babelrc`这种json文件js文件可以写注释)
``` json
"babel": {
  "presets": [
    "./.babelrc.js"
  ]
},
```
* 根目录下编写`.babelrc.js`
``` javascript
module.exports = {
  presets: [
    // 用`babel-preset-env`, `babel-preset-react`,`babel-preset-stage-0`这三个预设包
    // 预设包的意思：比如babel-preset-react就包括了很多已预设好的babel-plugin-xxx包，不需要一个个npm后再写在下面的plugins里了
    // 注意先后顺序
    "env",
    "react",
    "stage-0"
  ],
  plugins: [
    // 假如要支持mobx的装饰器语法, npm babel-plugin-transform-decorators-legacy, 然后再这里引入这个插件
    "transform-decorators-legacy",
    // antd需要
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ]
}
```
3. 引入`babel-polyfill`
babel默认只转换新的JavaScript语法，而不转换新的API。 例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。这个时候就需要`babel-polyfill`来转换了。
安装`babel-polyfill`，在入口文件`import 'babel-polyfill'`
**到这里你就可以放心的使用es6了！！！！**
4. 一些优化点
* 可以考虑`babel-polyfill`放入webpack entry vendor里
* 可以优化.babelrc.js如下
``` javascript
module.exports = {
  presets: [
    ["env", {
      "targets": {
        // 只支持ie11以上的es6转es5 babel需要转换的代码更少
        "browsers": ["IE >= 11"]
      },
      // 根据当前需要支持的浏览器(IE >= 9)按需加载babel-polyfill
      // 可以有效减少babel-polyfill体积
      "useBuiltIns": true
    }]
    "react",
    "stage-0"
  ],
  ...
}
```
