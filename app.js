var Api = require('utils/api.js');
var wxRequest = require('utils/wxRequest.js');

App({
  
  globalData: {
    hasLoggedIn: false,
    userInfo: [],
    token: '',
    openid: '',
    isGetUserInfo: false,
    isGetOpenid: false,
    cart: [],
    currCategory: 0,
    toView: null
  },

  calculateShippingFee() {
    var tempWeight = 0;

    let carts = this.globalData.cart;
    for (let i = 0; i < carts.length; i++)
      tempWeight += carts[i].num * carts[i].weight

    return Math.ceil(tempWeight) * 30.00
  },

  cleanCart() { this.globalData.cart = [] },

  presetIndex(currCategory, toView) {
    this.globalData.currCategory = currCategory
    this.globalData.toView = toView
  },

  cartDelete(id) {
    for (var i = 0; i < this.globalData.cart.length; i++)
      if (this.globalData.cart[i].id === id)
        delete this.globalData.cart[i]
  },

  cartAddOne(id) {
    for (var i = 0; i < this.globalData.cart.length; i++)
      if (this.globalData.cart[i].id === id) {
        this.globalData.cart[i].num += 1
        break
      }
  },

  cartMinusOne(id) {
    for (var i = 0; i < this.globalData.cart.length; i++)
      if (this.globalData.cart[i].id === id) {
        if (this.globalData.cart[i].num > 1)
          this.globalData.cart[i].num -= 1
        break
      }
  },

  askCount(id) {
    for (var i = 0; i < this.globalData.cart.length; i++)
      if (this.globalData.cart[i].id === id)
        return this.globalData.cart[i].num
    return 0
  },

  addToCart(id, title, image, num, price, weight, selected) {

    //如果存在就添加数量
    if (this.askCount(id) != 0)
      this.cartAddOne(id)

    // Or create a new item
    else {
      var newCart = this.globalData.cart
      newCart.push({ id: id, title: title, image: image, num: 1, price: price, weight: weight, selected: selected })
      console.log(newCart)
      this.globalData.cart = newCart
    }
  },

  refreshLoginAndGoToUser: function () {

    if (!this.globalData.token)
      this.readToken()

    var username = wx.getStorageSync('username')
    var password = wx.getStorageSync('password')

    if (!username || !password) return

    console.log("username=" + username)
    console.log("password=" + password)

    // Validate token
    var validateToken = wxRequest.postRequestWithToken(Api.getValidate(), this.globalData.token)
    validateToken.then(response => {
      // Invalid
      if (response.data.data.status === 403) {
        var getToken = wxRequest.getToken(Api.getToken(), username, password)
        getToken.then(response => {
          var token = response.data.token
          console.log("0")
          console.log(token)
          wx.setStorageSync('token', token)
          this.readToken()

          // Validate again
          var validateTokenTwice = wxRequest.postRequestWithToken(Api.getValidate(), this.globalData.token)
          validateTokenTwice.then(response => {
            if (response.data.data.status === 403) {
              console.log(token)
              console.log("Still failed")
            }
            else {
              var wordPressUserInfo = wxRequest.getRequestWithToken(Api.getWordPressUserInfo(), this.globalData.token)
              wordPressUserInfo.then(
                response => {
                  this.globalData.userInfo = response.data
                  this.globalData.hasLoggedIn = true
                  wx.switchTab({ url: '../user', })
                  console.log("1")
                })
            }
          })
        })
      }
      // Valid
      else if (response.data.data.status === 200) {
        this.getUserInfo()
        this.globalData.hasLoggedIn = true
        wx.switchTab({ url: '../user', })
        console.log("2")
      }
    })
  },

  refreshLogin: function () {

    if (!this.globalData.token)
      this.readToken()

    var username = wx.getStorageSync('username')
    var password = wx.getStorageSync('password')

    if (!username || !password) return

    console.log("username=" + username)
    console.log("password=" + password)

    // Validate token
    var validateToken = wxRequest.postRequestWithToken(Api.getValidate(), this.globalData.token)
    validateToken.then(response => {
      // Invalid
      if (response.data.data.status === 403) {
        var getToken = wxRequest.getToken(Api.getToken(), username, password)
        getToken.then(response => {
          var token = response.data.token
          console.log("0")
          console.log(token)
          wx.setStorageSync('token', token)
          this.readToken()
          this.getUserInfo()
          this.globalData.hasLoggedIn = true
          console.log("1")
        })
      }
      // Valid
      else if (response.data.data.status === 200) {
        this.getUserInfo()
        this.globalData.hasLoggedIn = true
        console.log("2")
      }
    })
  },

  onLaunch: function () { this.refreshLogin() },

  readToken() {
    this.globalData.token = wx.getStorageSync('token')
    console.log(this.globalData.token)
  },

  getUserInfo: function () {
    var wordPressUserInfo = wxRequest.getRequestWithToken(Api.getWordPressUserInfo(), this.globalData.token)
    wordPressUserInfo.then(
      response => {
        this.globalData.userInfo = response.data
        console.log(this.globalData.userInfo)
      })
      .catch(function (response) {
      }).finally(function (response) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  }
})