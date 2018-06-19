import cart from '../cart/cart.js';
const app = getApp();

// pages/product/product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    count: 0,

    id: 0,
    description: "",
    images: [],
    name: "",
    price: 0,
    weight: 0,
    regular_price: 0
  },

  add: function () {
    app.addToCart(this.data.id, this.data.name, this.data.images[0], 1, this.data.price, this.data.weight, true)
    this.setData({ count: app.askCount(this.data.id) })
  },

  navigateToCart: function (e) {
    wx.switchTab({ url: '../cart/cart' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      //后端返回的JSON中的属性description前后有<p></p>，故去之
      description: e.description.substring(3, e.description.length - 5),
      images: JSON.parse(e.images),
      name: e.name,
      price: e.price,
      id: e.id,
      regular_price: e.regular_price,
      weight: e.weight
    })
    //console.log("app.askCount(this.data.id)=" + app.askCount(this.data.id))
    this.setData({ count: app.askCount(this.data.id) })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})