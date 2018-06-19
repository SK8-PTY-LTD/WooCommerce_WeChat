var Api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js');

const app = getApp();

Page({
  data: {
    loading: false,
    orderList: [],
    productPool: [],
  },

  statusOf(status) {
    switch (status) {
      case 'pending':
        return '待付款'
        break
      case 'processing':
        return '处理中'
        break
      case 'cancelled':
        return '已取消'
        break
      case 'on-hold':
        return '暂停'
        break
      case 'completed':
        return '已完成'
        break
      case 'cancelled':
        return '已取消'
        break
      case 'refunded':
        return '已退款'
        break
      case 'failed':
        return '失败'
        break
    }
  },

  imageOf(id) {
    for (let product of this.data.productPool)
      if (product.id === id)
        return product.images[0].src
    return null
  },

  getImagePool() {
    var reqList = []
    var productPool = []
    var that = this

    for (var i = 0; i < this.data.orderList.length; i++)
      for (var j = 0; j < this.data.orderList[i].line_items.length; j++)
        reqList.push(
          wxRequest.getRequestWithToken(Api.getProduct(this.data.orderList[i].line_items[j].product_id), getApp().globalData.token).
            then(response => { productPool.push(response.data) }))

    Promise.all(reqList).then(function (values) {
      that.setData({ productPool: productPool })
      var orderListCopy = that.data.orderList
      for (var i = 0; i < orderListCopy.length; i++)
        for (var j = 0; j < orderListCopy[i].line_items.length; j++)
          orderListCopy[i].line_items[j].image = that.imageOf(orderListCopy[i].line_items[j].product_id)
      that.setData({ orderList: orderListCopy })
    })
  },

  onLoad(options) {
    var orders = wxRequest.getRequestWithToken(Api.getOrders(getApp().globalData.userInfo.id), getApp().globalData.token)
    orders.then(response => {
      for (var i = 0; i < response.data.length; i++)
        response.data[i].statusChinese = this.statusOf(response.data[i].status)
      this.setData({ orderList: response.data })
      this.getImagePool()
    })

    const that = this;
    if (options.t)
      this.setData({ activeNav: options.t });

    this.getList().then((res) => {
      that.setOrderData(res.data);
      that.setData({
        orderList: res.data,
        loading: false
      });
    });
  },

  setOrderData(data) {
    data.forEach(itm =>
      itm.order = { orderStatus: itm.order_status, orderSn: itm.order_sn, subOrderSn: itm.sub_order_sn, isButtonHidden: itm.order_status == "待支付" ? true : false, }
    );
    return data;
  },

  getList() { },

  drawbackOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '亲，你是否确定退款',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0)
          return;
        resource.drawbackOrder(orderSn).then((res) => {
          if (res.statusCode === 200) {
            this.data.orderList.forEach((item, key) => {
              if (item.order_sn == orderSn)
                item.refund_status = "待审核";
            })
            resource.showTips(that, '退款操作成功');
            this.setData({ orderList: this.data.orderList });
          } else {
            resource.showTips(that, '退款操作失败');
          }
        });

      }
    });
  },

  cancelOrder(e) {
    wx.showModal({
      content: '确认取消？',
      showCancel: true,
      success: (res) => {
        var submit = wxRequest.putRequestWithToken(Api.updateOrder(e.currentTarget.dataset.orderid), { status: "cancelled" }, getApp().globalData.token)
        submit.then(
          response => {
            wx.showToast({
              title: '已取消！',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          })
      }
    });
  },

  confirmOrder(e) {
    wx.showModal({
      content: '确认已收到？',
      showCancel: true,
      success: (res) => {
        var submit = wxRequest.putRequestWithToken(Api.updateOrder(e.currentTarget.dataset.orderid), { status: "completed" }, getApp().globalData.token)
        submit.then(
          response => {
            wx.showToast({
              title: '已确认！',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          })
      }
    });
  },

  pay(e) {
    wx.navigateTo({
      url: '../payment/payment'
    })
  },

  payOrder(e) {
    wx.requestPayment(
      {
        'timeStamp': '',
        'nonceStr': '',
        'package': '',
        'signType': 'MD5',
        'paySign': '',
        'success': function (res) {
          var submit = wxRequest.putRequestWithToken(Api.updateOrder(e.currentTarget.dataset.orderid), { status: "processing" }, getApp().globalData.token)
          submit.then(
            response => {
              wx.showToast({
                title: '支付成功！',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败！',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      })
  }
});
