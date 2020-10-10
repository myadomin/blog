webpack配置
```
plugins: [
    ...
    // 挂载到index.html 生成到dist/index.html 引用main.js commons.js vendor.js
    new HtmlWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
      chunks: ['main', 'commons', 'vendor']
    }),
    // 挂载到test.html 生成到dist/test.html 引用test.js commons.js vendor.js
    new HtmlWebpackPlugin({
      template: resolve('../src/test.html'),
      filename: 'test.html',
      chunks: ['test', 'commons', 'vendor']
    })
    ...
  ]
```

这样npm run build后，通过直接访问index.html及test.html查看页面，但是这样没法本地调试，希望能做到输入`http://localhost:8111/index`就能调试index页面，`http://localhost:8111/test`就能调试test页面。  
启用node服务，拦截路由，然后通过webpack的outputFileStream将本地调试时内存里的文件返回出html，见如下代码
```
// dev-server.js
var express = require('express')
var webpack = require('webpack')
const path = require('path')
var colors = require('colors')
var webpackConfig = require('./scripts/webpack.dev.config')

var app = express()

// webpack编译器
var compiler = webpack(webpackConfig)

// webpack-dev-server中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

app.use(devMiddleware)

// 路由
app.get('/:viewname?', function (req, res, next) {
  var viewname = req.params.viewname + '.html'
  var filepath = path.join(compiler.outputPath, viewname)
  // 必须先npm run bulid，然后读取filepath(dist/index.html dist/test.html等)
  console.log(filepath.red)

  // 使用webpack提供的outputFileSystem读取在内存的filepath文件 输出为html
  compiler.outputFileSystem.readFile(filepath, function (err, result) {
    if (err) {
      // console.log(err)
      // return next(err)
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

module.exports = app.listen(8111, function (err) {
  if (err) {
    // do something
    return
  }

  console.log('Listening at http://localhost:' + '8111' + '\n')
})

```

然后npm run dev
```
// package.json
{
    scripts: {
        "dev": "node ./dev-server.js"   
    }
}
```

参考
https://github.com/Coffcer/Blog/issues/1