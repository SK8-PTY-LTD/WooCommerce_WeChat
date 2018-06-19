var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');

const app = getApp();

Page({
  data: {

    hasLoggedIn: false,

    userInfo: {},
    order: {
      icon: 'images/order.png',
      text: '我的订单',
      tip: '',
      url: '../orders/orders?t=all'
    },
    // 收货数量
    orderBadge: {
      unpaid: 0,
      undelivered: 0,
      unreceived: 0
    },
    list: [
      {
        icon: 'images/address.png',
        text: '地址管理',
        whatFor: 'address',
        cut: true,
        url: '../address/address'
      }, {
        icon: 'images/tel.png',
        text: '联系客服',
        whatFor: 'customer_service',
      }, {
        icon: 'images/about.png',
        text: '关于商城',
        wahtFor: 'about',
        url: '../about/about'
      }
    ]
  },
  countOrder(orderList) {
    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    this.orderBadge = { unpaid: 0, undelivered: 0, unreceived: 0 };

    for (let i = orderList.length - 1; i >= 0; i--) {
      switch (orderList[i].order_status) {
        case '待支付': this.orderBadge.unpaid += 1; break;
        case '待发货': this.orderBadge.undelivered += 1; break;
        case '待收货': this.orderBadge.unreceived += 1; break;
        default: break;
      }
    }

    this.data.orderCell[0].count = this.orderBadge.unpaid;
    this.data.orderCell[1].count = this.orderBadge.undelivered;
    this.data.orderCell[2].count = this.orderBadge.unreceived;
    this.setData({
      orderBadge: this.orderBadge,
      orderCell: this.data.orderCell
    });
  },
  
  onShow() {
    this.setData({ hasLoggedIn: getApp().globalData.hasLoggedIn })

    if (this.data.hasLoggedIn)
      this.setData({ userInfo: getApp().globalData.userInfo })
  },

  getOpenid: function (code) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + code + '&grant_type=authorization_code',
      data: {},
      method: 'GET',
      success: function (res) {
        var obj = {};
        obj.openid = res.data.openid;
        obj.expires_in = Date.now() + res.data.expires_in;
        obj.session_key = res.data.session_key;
        wx.setStorageSync('openid', obj.openid);// 存储openid  
      }
    });
  },

  onLoad() {
    this.setData({ hasLoggedIn: getApp().globalData.hasLoggedIn })

    if (this.data.hasLoggedIn)
      this.setData({ userInfo: getApp().globalData.userInfo })
  },

  register() { wx.navigateTo({ url: 'register/register' }); },

  navigateTo(e) {

    if (!this.data.hasLoggedIn)
      wx.navigateTo({ url: 'register/register', })
    else {
      var userInfo = this.data.userInfo
      const url = e.currentTarget.dataset.url
      if (e.currentTarget.dataset.urlType) {
        wx.navigateTo({
          url: 'user-info/user-info?name=' + userInfo.name
          + '&email=' + userInfo.email
          + '&avatar_urls=' + userInfo.avatar_urls[24]
        });
      } else { wx.navigateTo({ url }); }
    }
  }
});
