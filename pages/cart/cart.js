const app = getApp();

Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: { name: "hello" },
    weight: 0
  },

  getWeight() {
    var cart = app.globalData.cart
    var weight = 0
    for (var i = 0; i < cart.length; i++)
      weight += app.globalData.cart[i].weight * app.globalData.cart[i].num
    return weight
  },

  onLoad() {
  },

  refresh() {
    this.setData({
      hasList: true,
      carts: app.globalData.cart,
      weight: this.getWeight()
    });
  },

  onShow() {
    this.setData({
      hasList: true,
      carts: app.globalData.cart,
      weight: this.getWeight()
    });
    this.getTotalPrice();
  },
  
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({ carts: carts });
    this.getTotalPrice();
  },

  deleteList(e) {
    app.cartDelete(e.currentTarget.dataset.id)
    this.refresh()
    this.getTotalPrice();
  },

  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++)
      carts[i].selected = selectAllStatus;

    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });

    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    app.cartAddOne(e.currentTarget.dataset.id)
    this.refresh()
    this.getTotalPrice()
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    app.cartMinusOne(e.currentTarget.dataset.id)
    this.refresh()
    this.getTotalPrice();
  },

  calculateShippingFee() {
    var tempWeight = 0;

    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++)
      tempWeight += carts[i].num * carts[i].weight

    return Math.ceil(tempWeight) * 30.00
  },

  /**
   * 计算总价
   */
  getTotalPrice() {

    let carts = this.data.carts;
    let total = 0;
    for (let i = 0; i < carts.length; i++)
      if (carts[i].selected)
        total += carts[i].num * carts[i].price

    total += this.calculateShippingFee()
    this.setData({ carts: carts, totalPrice: total.toFixed(2) });
  }
})