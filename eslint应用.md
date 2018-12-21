### eslint 应用
* 安装 
```
react需要安装 
"babel-eslint": "^8.2.6",
"eslint-config-standard": "~11.0.0",
"eslint-plugin-import": "~2.8.0",
"eslint-plugin-jsx-a11y": "~6.0.3",
"eslint-plugin-node": "^5.2.0",
"eslint-plugin-promise": "^3.4.0",
"eslint-plugin-react": "~7.5.1",
"eslint-plugin-standard": "^3.0.1",
vue需要安装
"babel-eslint": "^7.1.1",
"eslint-config-standard": "^10.2.1",
"eslint-plugin-html": "^3.0.0",
"eslint-plugin-import": "^2.7.0",
"eslint-plugin-node": "^5.2.0",
"eslint-plugin-promise": "^3.4.0",
"eslint-plugin-standard": "^3.0.1",
```
* 配置 eslint-loader
```
// webpack.base.config.js
module: {
  loaders: [
    {
      test: /\.(js|vue)$/,
      // 只有src文件用eslint-loader
      include: [resolve('../src')],
      // *一定要加这个 否则检测不到*
      enforce: 'pre',
      use: [{
        loader: 'eslint-loader',
        options: {
          // 不符合Eslint规则时只console warning(默认false 直接console error)
          // emitWarning: true
        }
      }]
    },
    ....
  ]
},
```
* 根目录新建 .eslintrc.js
```
// .eslintrc.js
module.exports = {
  // eslint找当前配置文件不再往父级查找
  "root": true, 
  "extends": "standard",
  "parser": "babel-eslint",
  "plugins": [
    "react"   // 如果是vue 这里是html
  ],
  "rules": {
    // 关闭统一换行符，"\n" unix(for LF) and "\r\n" for windows(CRLF)，默认unix
    "linebreak-style": "off",
    // 某些变量未引用不报错
    "no-unused-vars": "off"
  }
}
```
* 根目录新建 .eslintignore
```
/dist/
/node_modules/
/notes/
```
* 忽略eslint规则
```
/*eslint-disable*/
import * as types from '../constants/ActionTypes';
/*eslint-disable*/
```
* vscode设置
安装ESlint扩展 然后设置
```
{ 
  // eslint扩展检测代码是否符合规则 不符合标红波浪线
  "eslint.validate": [
      "javascript",
      "javascriptreact",
      {
      "language": "html",
      "autoFix": true
      },
      {
      "language": "vue",
      "autoFix": true
      }
  ],
  // 保存就自动修正为eslint规则
  "eslint.autoFixOnSave": true,
  ......
}
 ```
