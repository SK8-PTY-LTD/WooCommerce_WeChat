const app = getApp()

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) { resolve(res) }
      obj.fail = function (res) { reject(res) }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */

function putRequest(url, data) {
  var putRequest = wxPromisify(wx.request)
  return putRequest({
    url: url,
    method: 'PUT',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

function putRequestWithToken(url, data, token) {
  var putRequest = wxPromisify(wx.request)
  return putRequest({
    url: url,
    method: 'PUT',
    data: data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + token
    }
  })
}

function getRequestWithToken(url, token, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json',
    }
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */

function postRequestWithToken(url, token, data) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/json",
      'Authorization': 'Bearer ' + token
    }
  })
}
// Get token
function getToken(url, username, password) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    header: {
      "content-type": "application/json",
    },
    data: {
      "username": username,
      "password": password
    }
  })
}

function postRequest(url, data) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/json",
    }
  })
}

module.exports = {
  getToken: getToken,
  postRequest: postRequest,
  getRequest: getRequest,
  putRequest: putRequest,
  postRequestWithToken: postRequestWithToken,
  getRequestWithToken: getRequestWithToken,
  putRequestWithToken: putRequestWithToken
}