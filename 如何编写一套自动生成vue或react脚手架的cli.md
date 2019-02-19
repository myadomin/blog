### 概述
本文将介绍如何写一套类似vue-cli的工具，自动生成vue或者react的脚手架

### 大致思路
* `commander` 获取当前cmd输入参数
* `inquirer` 获取cmd问询后的信息对象meta
* `download-git-repo` 根据cmd输入参数去git下载对应的脚手架模板
* `metalsmith` `handlebars` 根据meta将脚手架模板处理生成为需要的文件
* [源码参考我的github](https://github.com/myadomin/adomin-cli)

### 新建index.js文件
``` javascript
// 以nodejs执行此文件 例如执行node index.js 输出1111
#! /usr/bin/env node
console.log(1111)
```

### commander 获取当前cmd输入参数
``` javascript
#! /usr/bin/env node
...
program
// cmd输入node index.js -v ，输出package.json的版本号
.version(pkg.version, '-v, --version')
.command('init [projectType] [projectName]')
// cmd输入node index.js init vue abc ，那么projectType是vue projectName是abc
// cmd输入node index.js init react abc ，那么projectType是react projectName是abc
.action(function(projectType, projectName, options){
  console.log(projectType, projectName)
})
program.parse(process.argv)
```
这样我们就能根据cmd不同的输入做不同的事情了

### inquirer 获取cmd问询后的信息对象meta
``` javascript
#! /usr/bin/env node
...
program
.version(pkg.version, '-v, --version')
.command('init [projectType] [projectName]')
.action(function(projectType, projectName, options){
  ...
  // cmd输入node index.js init vue abc后，出现prompt问询的交互，交互的结果传入到then answers
  inquirer.prompt([
    {
      type: 'list',
      message: 'need example in scaffolding?',
      name: 'needExample',
      choices: [
        "no",
        "yes"
      ],
    }
    {
      type: 'input',
      name: 'projectName',
      message: 'input projectName',
      default: 'myProject'
    },
  ]).then(answers => {
    // prompt问询的交互结果answers
    console.log(projectType, projectName, answers)
    // 根据cmd输入参数去git下载对应的脚手架模板 见下面
    downloadFile(projectType, projectName, answers)
    ...
  })
  ...
})
program.parse(process.argv)
```
这样我们就得到了cmd输入的projectType, projectName以及prompt问询的交互结果answers，然后就可以根据这些参数去git下载对应的脚手架模板

### download-git-repo 根据cmd输入参数去git下载对应的脚手架模板
``` javascript
#! /usr/bin/env node
...
const download = require('download-git-repo')
const url = {
  react: 'direct:https://github.com/myadomin/react-temp.git',
  vue: 'direct:https://github.com/myadomin/vue-temp.git'
}
const downloadFile = (projectType, generatePath, meta) => {
  const downloadPath = generatePath + '_temp'
  // 假如cmd输入的是node index.js init vue abc
  // 那么从相应的github地址(这里存放了vue或者react脚手架模板)下载并生成文件abc_temp
  download(url[projectType], downloadPath, { clone: true }, function (err) {
    if (err) {
      logError('download error')
    } else {
      // 得到abc_temp文件后 准备去处理这个文件
      generate(downloadPath, generatePath, meta)
    }
  })
}
```
这样我们根据cmd输入的projectType, projectName就在本地生成了xxx_temp文件，然后用generate方法处理这个xxx_temp文件

### metalsmith handlebars 根据meta将脚手架模板处理生成为需要的文件
``` javascript
#! /usr/bin/env node
...
const generate = (downloadPath, generatePath, meta) => {
  metalsmith(process.cwd())
  .metadata(meta)
  // 需要处理的文件 也就是之前从github下载的模板文件xxx_temp
  .source(downloadPath)
  // 处理完形成的文件
  .destination(generatePath)
  .clean(true)
  .use((files, metalsmith, done) => {
    const meta = metalsmith.metadata()
    Object.keys(files).forEach(fileName => {
      // 对package.json做Handlebars的模板解析(根据meta解析)
      // meta就是之前prompt问询的交互结果answers
      if (fileName.indexOf('package.json') !== -1) {
        const t = files[fileName].contents.toString()
        files[fileName].contents = new Buffer.from(Handlebars.compile(t)(meta))
      }
      // 根据meta.needExample 决定是否删除examples文件夹
      if (meta.needExample === 'no' && fileName.indexOf('examples') !== -1) {
        delete files[fileName]
      }
    })
    done()
  })
  .build(function(err) {
    // 文件处理完毕 删除xxx_temp文件
    rm(downloadPath)
    ...
  });
}
```
到这里一套基本功能的cli工具就完成了

### npm全局安装
* 在package.json中加入bin
``` json
"bin": {
  "adomin-cli": "./index.js"
}
```
* 发布npm包
`npm login` 如果没有注册就`npm adduser`然后去通过邮箱验证
`npm publish` 这样你的包就在npm网站`https://www.npmjs.com/`上了
注意发布的npm包package.json都用dependencies别用devdependencies，否者全局安装的时候不会安装node_modules
* 之后就可以
  * `npm i adomin-cli -g` 全局安装
  * `adomin-cli init react projectName` 生成react脚手架 
  * `adomin-cli init vue projectName` 生成vue脚手架

