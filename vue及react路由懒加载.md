## vue路由懒加载
* 参考 [vue-router官网](https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk) 做如下import
``` javascript
// 动态import页面 webpack代码分割
const Home = () => import('@/view/Home.vue')
const Test = () => import('@/view/Test.vue')

const routes = [
  {
    path: '/',
    name: 'index',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
}
```
* 安装`babel-plugin-syntax-dynamic-import` 然后.bablerc加入
```
{
  "plugins": ["syntax-dynamic-import"]
}
```
* vue-router必须3.0以上
* 这样每次在请求test的时候才会加载test相关组件，做到路由懒加载

## react路由组件懒加载
主要用的是react-loadable这个库 如下
``` javascript
...
import Loadable from 'react-loadable'
...
// 路由懒加载
const Comp1 = Loadable({
  loader: () => import('@src/view/Comp1'),
  loading: () => null
})
const Comp2 = Loadable({
  loader: () => import('@src/view/Comp2'),
  loading: () => null
})
...
// Route
<Route path="/comp1" component={Comp1} />
<Route path="/comp2" component={Comp2} />
```
