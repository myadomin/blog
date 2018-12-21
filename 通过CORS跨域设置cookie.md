## 通过CORS 跨域设置cookie
* 请求登录：responesHeader返回Set-Cookie: xxx，后端向前端写cookie存在浏览器上
* 之后任意请求：从浏览器读取cookie然后requestHeader附带上Cookie，前端向后端传递cookie
* 以上都是基于同域的请求，跨域后1和2都不能正常进行，为解决这个问题启用CORS跨域
* 后端做如下设置 nodejs示例
``` javascript
app.all('*', function(req, res, next) {
  // 允许跨域 后面设置了Access-Control-Allow-Credentials那这里就不能为'*'
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  // 允许cookie跨域通用
  res.header('Access-Control-Allow-Credentials', true)
  next();
});
```
* 前端做如下设置 axios示例
``` javascript
// 跨域的header头上可以附带cookie
axios.defaults.withCredentials = true
```
* [demo地址](https://github.com/myadomin/react-adomin-temp/tree/master/examples/corsCookie)
