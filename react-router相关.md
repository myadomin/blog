## react-router tips
#### Switch
``` javascript
<Switch>
  <Route path="/aa" component={A} />
  <Route path="/bb" component={B} />
  <Route path="/cc" component={C} />
  <Route path="/dd" component={D} />
  <Route path="/" render={() => <Redirect to="/aa"/>} />
</Switch>
```
* 加了Switch那路由就从上往下匹配且只匹配一次，比如输入/aa就只匹配path="/aa"，不会再往下去匹配到path="/"
* 路由path="/"应该写在最后，因为如果输入/abc，都没匹配到就匹配到最后的/路由(跳转到路由aa)，如果这个路由写在最前面，输入/xxx都会匹配到/路由
* 如果加了exact `<Route exact path="/" component={E} />`，那只有输入/才能匹配到路由path="/"，否者/xxx都可以匹配到路由path="/"
#### withRouter
``` javascript
class Home extends Component {
  xxxx
}
export default Home
```
* 假如上面的Home组件本身就是路由组件(即有定义`<Route path="/" component={Home} />`)，那Home组件的props就有location, history等路由相关信息，可以通过this.props.history.push(a)做动态跳转等相关路由操作
* 假如Home组件本省不是路由组件，那`export default withRouter(Home)`通过高阶组件withRouter包裹Home组件后，那Home组件的props也有location, history等路由相关信息了
* 如果withRouter以后需要用到redux的connect，必须是withRouter包裹connect，因为connect会重写了withRouter的shouldComponentUpdate方法，导致不响应location的变化从而路由不跳转，写法如下
``` javascript
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home))
```
#### 路由跳转的几种方式
* `this.props.history.push(a)` 非路由组件记得withRouter
* `<Redirect to="/aa"/>`
* 用router对象跳转(当不在组件里的时候)
``` javascript
// 引入HashRouter
import {HashRouter} from 'react-router-dom'
const router = new HashRouter()
// 用router跳转
router.history.push('/autoAuth')
```