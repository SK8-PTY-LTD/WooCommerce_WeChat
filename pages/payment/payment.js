var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');


Page({
  data: {
    cardNumber: null,
    date: "01/01",
    CVC: null,
    cardNumberAvailable: false,
    dateAvailable: false,
    CVCAvailable: false,

    billing: [],
    shipping: [],
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

  checkCardNumber(e) {
    var cardNumber = e.detail.value

    if (cardNumber.length > 19) {
      this.setData({ cardNumber: this.data.cardNumber })
      return
    }

    // Trim the spaces
    cardNumber = cardNumber.replace(/ +/g, "");

    // Add spaces again
    if (cardNumber.length > 4 && cardNumber.length <= 8) {
      cardNumber = cardNumber.substr(0, 4) + " " + cardNumber.substr(4, 4)
    } else if (cardNumber.length > 8 && cardNumber.length <= 12) {
      cardNumber = cardNumber.substr(0, 4) + " " + cardNumber.substr(4, 4) + " " + cardNumber.substr(8, 4)
    } else if (cardNumber.length > 12 && cardNumber.length <= 16) {
      cardNumber = cardNumber.substr(0, 4) + " " + cardNumber.substr(4, 4) + " " + cardNumber.substr(8, 4) + " " + cardNumber.substr(12, 4)
    }

    var regex = /^((4\d{3})|(5[1-5]\d{2})|(6011)|(34\d{1})|(37\d{ 1}))-?\s?\d{4}-?\s?\d{4}-?\s?\d{4}|3[4,7][\d\s-]{15}$/
    this.setData({
      cardNumber: cardNumber,
      cardNumberAvailable: regex.test(String(cardNumber).toLowerCase())
    });
  },

  checkDate(e) {

    var date = e.detail.value

    if (date.length > 5) {
      this.setData({ date: this.data.date })
      return
    }

    console.log("date=" + date)
    console.log("this.data.date=" + this.data.date)

    if (date.length === 2 && this.data.date.length === 1)
      date = date + "/"
    else if (this.data.date.length === 4 && date.length === 3)
      date = date.substr(0, 2)
    else if (this.data.date.length === 2 && date.length === 3) {
      date = date.substr(0, 2) + "/" + date.substr(2, 1)
    }

    var regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/
    this.setData({
      date: date,
      dateAvailable: regex.test(String(date).toLowerCase())
    });
  },

  checkCVC(e) {

    var CVC = e.detail.value

    if (CVC.length > 3) {
      this.setData({ CVC: this.data.CVC })
      return
    }

    var regex = /^[0-9]{3,4}$/
    this.setData({
      CVC: CVC,
      CVCAvailable: regex.test(String(CVC).toLowerCase())
    });
  },

  // Update billing address & shipping address
  formSubmit(e) {

    if (!this.data.cardNumberAvailable) {
      wx.showToast({
        title: '卡号格式有误！',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      return
    }
    if (!this.data.dateAvailable) {
      wx.showToast({
        title: '日期格式有误！',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      return
    }
    if (!this.data.CVCAvailable) {
      wx.showToast({
        title: 'CVC格式有误！',
        icon: 'success',
        duration: 1000,
        mask: true
      })
      return
    }

    //支付方法写在这里，所有变量都在data内

  }
})