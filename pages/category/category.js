var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');

Page({
  data: {
    categories: [],
    detail: [],
    isScroll: false,
    currCategory: 0,
    toView: null
  },

  onShow() {
    var app = getApp()
    var hasPreset = app.globalData.currCategory != 0 && app.globalData.toView != null
    var e = { currentTarget: { dataset: {} } }
    e.currentTarget.dataset.id = hasPreset ? app.globalData.currCategory : response.data[0].id
    e.currentTarget.dataset.name = hasPreset ? app.globalData.toView : response.data[0].slug
    this.changeType(e)
  },

  onLoad() {
    var categories = wxRequest.getRequestWithToken(Api.getCategories(), getApp().globalData.token)
    categories.then(
      response => {
        var app = getApp()
        var hasPreset = app.globalData.currCategory != 0 && app.globalData.toView != null
        this.setData({
          detail: response.data,
          categories: response.data,
          currCategory: response.data[0].id,
          toView: response.data[0].slug
        })

        var e = { currentTarget: { dataset: {} } }
        e.currentTarget.dataset.id = hasPreset ? app.globalData.currCategory : response.data[0].id
        e.currentTarget.dataset.name = hasPreset ? app.globalData.toView : response.data[0].slug
        this.changeType(e)
      })
  },

  calculateMaxPage: function () {
    var temp = this.data.detail
    for (var i = 0; i < temp.length; i++)
      if (temp[i].id === this.data.currCategory) {
        var maxPage = Math.ceil(temp[i].count / 9)
        temp[i].maxPage = maxPage
      }
    this.setData({ detail: temp })
  },

  changeType: function (e) {
    const self = this;
    this.setData({ isScroll: true })
    self.setData({ currCategory: e.currentTarget.dataset.id, toView: e.currentTarget.dataset.name })
    self.loadProduct(this.findCategoryPage(this.data.currCategory) === undefined ? 1 : this.findCategoryPage(this.data.currCategory))
    setTimeout(function () { self.setData({ isScroll: false }) }, 1)
  },

  addProductToDetail: function (data, page) {
    var temp = this.data.detail
    for (var i = 0; i < temp.length; i++)
      if (temp[i].id === this.data.currCategory) {
        temp[i].detail = data
        temp[i].page = page
        break
      }
    this.setData({ detail: temp })
  },

  loadProduct: function (page) {
    var products = wxRequest.getRequestWithToken(Api.getProducts(this.data.currCategory, page), getApp().globalData.token)
    products.then(response => {
      this.addProductToDetail(response.data, page)
      this.calculateMaxPage()
    })
  },

  findCategoryPage: function (id) {
    var temp = this.data.detail
    for (var i = 0; i < temp.length; i++)
      if (temp[i].id === id)
        return temp[i].page
  },

  findMaxPage: function (id) {
    var temp = this.data.detail
    for (var i = 0; i < temp.length; i++)
      if (temp[i].id === id)
        return temp[i].maxPage
  },

  prev: function (e) {
    var page = this.findCategoryPage(this.data.currCategory)
    if (page === 1)
      return
    this.loadProduct(page - 1)
  },

  next: function (e) {
    var page = this.findCategoryPage(this.data.currCategory)
    if (page === this.findMaxPage(this.data.currCategory))
      return
    this.loadProduct(page + 1)
  },

  goDetail: function (e) {
    var product = e.currentTarget.dataset.information
    var images = []

    for (var i = 0; i < product.images.length; i++)
      images.push(product.images[i].src)

    wx.navigateTo({
      url: '../product/product?'
      + 'id=' + product.id
      + '&name=' + product.name
      + '&price=' + product.price
      + '&regular_price=' + product.regular_price
      + '&description=' + product.description
      + '&weight=' + product.weight
      + '&images=' + JSON.stringify(images)
    })
  }
})