var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');
var cart = require('../cart/cart.js');

Page({
  data: {
    address: {},
    total: 0,
    orders: []
  },

  onReady() { this.getTotalPrice() },

  onShow: function () {
    this.setData({ orders: getApp().globalData.cart, });
    console.log(this.data.orders)
  },

  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) { total += orders[i].num * orders[i].price; }
    this.setData({ total: total })
  },

  toPay() {

    var data = {
      customer_id: getApp().globalData.userInfo.id,
      payment_method: 'bacs',
      payment_method_title: 'WeChat Transfer',
      set_paid: true,
      billing: {},
      shipping: {},
      line_items: [],
      shipping_lines: []
    };

    var customer = wxRequest.getRequestWithToken(Api.getCustomer(getApp().globalData.userInfo.id), getApp().globalData.token)
    customer.then(response => {
      data.billing = response.data.billing
      data.shipping = response.data.shipping

      var line_items = []
      for (let i = 0; i < this.data.orders.length; i++) {
        line_items.push({
          product_id: this.data.orders[i].id,
          quantity: this.data.orders[i].num
        })
      }
      data.line_items = line_items
      var shipping = getApp().calculateShippingFee()
      data.shipping_lines = [{
        method_id: 'flat_rate',
        method_title: 'Flat Rate',
        total: shipping + ""
      }]

      var order = wxRequest.postRequestWithToken(Api.createOrder(), getApp().globalData.token, data)
      order.then(response => { console.log(response.data) })

      getApp().cleanCart()

      wx.navigateTo({ url: '../orders/orders', })
    })
  }
})