var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');

Page({
  data: {
    isScroll: false,

    billing: [],
    shipping: [],
    activeNav: 'billing',
    navs: [{
      text: '账单地址',
      alias: 'billing'
    }, {
      text: '运输地址',
      alias: 'shipping'
    }],
    items: [
      { name: 'paypal', value: 'paypal', checked: 'true' },
      { name: 'stripe', value: 'stripe' }
    ]
  },

  getData() {
    var customer = wxRequest.getRequestWithToken(Api.getCustomer(getApp().globalData.userInfo.id), getApp().globalData.token)
    customer.then(response => { this.setData({ billing: response.data.billing, shipping: response.data.shipping }) })
  },

  onLoad() { this.getData() },

  changeList(e) {
    const that = this;
    const alias = e.target.dataset.alias;

    if (alias !== this.data.activeNav)
      this.setData({ activeNav: e.target.dataset.alias });
  },

  // Update billing address & shipping address
  formSubmit(e) {
    var submit = wxRequest.putRequestWithToken(Api.getCustomer(getApp().globalData.userInfo.id), { [this.data.activeNav]: e.detail.value }, getApp().globalData.token)
    submit.then(
      response => {
        this.getData()
        wx.showToast({
          title: '已保存信息',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      })
  }
})