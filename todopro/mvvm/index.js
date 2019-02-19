let data = {
  title: 'todo list',
  user: 'mirone',
  todos: [
    {
      creator: 'mirone',
      content: 'write mvvm',
      done: 'undone',
      date: '2016-11-17',
      members: [
        {
          name: 'kaito'
        }
      ]
    }
  ]
}

// watcher
class Register {
  constructor () {
    // 存放所有回调对象，回调对象由三个key组成：obj, key, fn，其中fn应该是一个数组，放着所有发生变化时要执行的回调函数
    this.routes = []
  }
  // 添加一个回调
  regist (obj, k, fn) {
    const _i = this.routes.find(function (el) {
      if ((el.key === k || el.key.toString() === k.toString()) && Object.is(el.obj, obj)) {
        return el
      }
    })
    if (_i) {
      // 如果已经存在该obj和key组成的对象
      _i.fn.push(fn)
    } else {
      // 如果尚不存在
      this.routes.push({
        obj: obj,
        key: k,
        fn: [fn]
      })
    }
  }
  // 解析结束时调用，绑定所有回调
  build () {
    this.routes.forEach((route) => {
      observer(route.obj, route.key, route.fn)
    })
  }
}

const register = new Register()

// 模板解析 complie部分
function scan (node) {
  if (!node.getAttribute('data-list')) {
    for (let i = 0; i < node.children.length; i++) {
      const _thisNode = node.children[i]
      parseModel(_thisNode)
      parseClass(_thisNode)
      parseEvent(_thisNode)
      if (_thisNode.children.length) {
        scan(_thisNode)
      }
    }
  } else {
    parseList(node)
  }
}
// event要有一个eventList,大概结构为：
const eventList = {
  typeWriter: {
    type: 'input', // 事件的种类
    fn: function () {
      // 事件的处理函数，函数的this代表函数绑定的DOM节点
    }
  }
}
function parseEvent (node) {
  if (node.getAttribute('data-event')) {
    const eventName = node.getAttribute('data-event')
    node.addEventListener(eventList[eventName].type, eventList[eventName].fn.bind(node))
  }
}
// 根据在模版中的位置解析模版，这里的Path是一个数组，代表了当前数据在Model中的位置
function parseData (str, node) {
  const _list = str.split(':')
  let _data,
    _path
  let p = []
  _list.forEach((key, index) => {
    if (index === 0) {
      _data = data[key]
      p.push(key)
    } else {
      _path = node.path[index - 1]
      p.push(_path)
      _data = _data[_path][key]
      p.push(key)
    }
  })
  return {
    path: p,
    data: _data
  }
}
function parseModel (node) {
  if (node.getAttribute('data-model')) {
    const modelName = node.getAttribute('data-model')
    const _data = parseData(modelName, node)
    register.regist(data, _data.path, function (old, now) {
      if (node.tagName === 'INPUT') {
        node.value = now
      } else {
        node.innerText = now
      }
      // 添加console便于调试
      console.log(`${old} ---> ${now}`)
    })
    // if (node.tagName === 'INPUT') {
    //   node.value = _data.data
    // } else {
    //   node.innerText = _data.data
    // }
  }
}
function parseClass (node) {
  if (node.getAttribute('data-class')) {
    const className = node.getAttribute('data-class')
    const _data = parseData(className, node)
    if (!node.classList.contains(_data.data)) {
      register.regist(data, _data.path, function (old, now) {
        node.classList.remove(old)
        node.classList.add(now)
        console.log(`${old} ---> ${now}`)
      })
      // node.classList.add(_data.data)
    }
  }
}
function parseListItem (node) {
  return getItem(node)
}
function getItem (node) {
  let target
  for (let i = 0; i < node.children.length; i++) {
    const _thisNode = node.children[i]
    if (node.path) {
      _thisNode.path = node.path.slice()
    }
    parseEvent(_thisNode)
    parseClass(_thisNode)
    parseModel(_thisNode)
    if (_thisNode.getAttribute('data-list-item')) {
      target = _thisNode
    } else {
      getItem(_thisNode)
    }
  }
  return target
}
function parseList (node) {
  const _item = parseListItem(node)
  const _list = node.getAttribute('data-list')
  const _listData = parseData(_list, node)
  register.regist(data, _listData.path, () => {
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
    const _listData = parseData(_list, node)
    node.appendChild(_item)
    _listData.data.forEach((_dataItem, index) => {
      const _copyItem = _item.cloneNode(true)
      if (node.path) {
        _copyItem.path = node.path.slice()
      }
      if (!_copyItem.path) {
        _copyItem.path = []
      }
      _copyItem.path.push(index)
      scan(_copyItem)
      node.insertBefore(_copyItem, _item)
    })
    node.removeChild(_item)
  })
}

// 数据解析 observer
function observer (obj, k, callback) {
  if (Object.prototype.toString.call(k) === '[object Array]') {
    observePath(obj, k, callback)
  } else {
    let old = obj[k]
    if (Object.prototype.toString.call(old) === '[object Array]') {
      observeArray(old, callback)
    } else if (old.toString() === '[object Object]') {
      observeAllKey(old, callback)
    } else {
      observeItem(obj, k, callback)
    }
  }
}
function observePath (obj, path, callback) {
  let _path = obj
  let _key
  path.forEach((p, index) => {
    if (parseInt(p) === p) {
      p = parseInt(p)
    }
    if (index < path.length - 1) {
      _path = _path[p]
    } else {
      _key = p
    }
  })
  observer(_path, _key, callback)
}
function observeItem (obj, k, callback) {
  let old = obj[k]
  Object.defineProperty(obj, k, {
    enumerable: true,
    configurable: true,
    get: function () {
      return old
    },
    set: function (now) {
      if (now !== old) {
        callback.forEach((fn) => {
          fn(old, now)
        })
      }
      old = now
    }
  })
}
function observeAllKey (obj, callback) {
  Object.keys(obj).forEach(function (key) {
    observer(obj, key, callback)
  })
}
function observeArray (arr, callback) {
  const oam = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
  const arrayProto = Array.prototype
  const hackProto = Object.create(Array.prototype)
  oam.forEach(function (method) {
    Object.defineProperty(hackProto, method, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function (...arg) {
        let me = this
        let old = arr.slice()
        let now = arrayProto[method].call(me, ...arg)
        callback.forEach((fn) => {
          fn(old, this, ...arg)
        })
        return now
      }
    })
  })
  arr.__proto__ = hackProto
}

class Parser {
  constructor (dom, data) {
    scan(document.getElementById(dom))
    // 当模版解析结束后绑定所有事件
    register.build()
  }
}
const aa = new Parser('root', data)
