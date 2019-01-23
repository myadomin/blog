## css module
#### 为什么要有css module
新增的react vue等mvvm单页面架构，最终打包的时候css都打在一个js或者一个css里面，非常容易出现css class冲突，为了解决这个问题出现了css module
#### css module如何解决冲突
配置css module后，编译出的html文件每个class都会加上一个唯一的hash值，假如在两个组件都写了class title，最后编译出的html里class是`index__title__18nSI`  `class="index__title__899ndd"` 这种，这样就解决了同名class title的冲突。
#### css module如何实现
* 对于vue 直接用 `<style lang="stylus" scoped>`
* 对于react要自己配置webpack，如下
``` javascript
{
  test: /\.css$/,
  // 不包括node_modules里的css
  exclude: [resolve('../node_modules')],
  use: ['style-loader', {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      // css modules支持
      modules: true,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  }]
},
{
  test: /\.less$/,
  // 不包括node_modules里的less
  exclude: [resolve('../node_modules')],
  use: ['style-loader', {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      // less modules支持
      modules: true,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  }, 'less-loader']
},
```
#### css module如何应用
* 在react js文件中`import styles from './index.less'`, 在jsx中`<div className={styles.title}>`
* 在index.less中
```
.title {
  padding: 0 0 20px;
  border-bottom: 1px solid #eee
}
```
* 这个title会加上hash值 实际的class是`class="index__title__899ndd"`这样，这样即使在其他组件也写`<div className={styles.title}>`，那其他组件的class会编译成`class="index__title__xxxx"`，这样都加title的class就不会有冲突了
* 如果一个dom要加多个class，``<div className={`${styles.logo} ${styles.abc}`}>``这样写
* 如果要用全局class不带hash的
``` css
// 全局css设置 用普通的className="notAssignedCustomerTable"
:global {
  .notAssignedCustomerTable {
    .ant-table-thead {
      .ant-table-selection-column {
        span{
          display: none
        }
      }
    }  
  }
}
```
