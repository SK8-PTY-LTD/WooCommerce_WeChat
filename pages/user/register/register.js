var Api = require('../../../utils/api.js');
var wxRequest = require('../../../utils/wxRequest.js');

var base = getApp();

Page({

  data: {
    btnStatus: true,
    sec: 0,
    phone: "",
    phoneOk: false,
    code: "",
    codeOk: false,
    username: "",
    pwd: "",
    emailValidated: false,
    email: "",
    activeNav: 'register',
    navs: [{
      text: '注册',
      alias: 'register'
    }, {
      text: '登录',
      alias: 'login'
    }],
  },

  key: "",
  onLoad: function () {
    var _this = this;
  },

  changeList(e) {
    const that = this;
    const alias = e.target.dataset.alias;

    if (alias !== this.data.activeNav)
      this.setData({ activeNav: e.target.dataset.alias });
  },

  checkEmail: function (e) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setData({
      email: e.detail.value,
      emailValidated: re.test(String(e.detail.value).toLowerCase())
    });
  },

  checkPhone: function (e) {
    var v = e.detail.value;
    if (v && v.length == 11) {
      this.setData({
        phone: v,
        phoneOk: true
      });
    } else
      this.setData({
        phone: "",
        phoneOk: false
      });
  },

  checkCode: function (e) {
    var v = e.detail.value;
    if (v && v.length > 2) {
      this.setData({
        code: v,
        codeOk: true
      });
    } else {
      this.setData({
        code: "",
        codeOk: false
      });
    }
  },

  sendCode: function () {
    var _this = this;

    if (this.data.phoneOk) {
      this.setData({
        sec: 90,
        btnStatus: false
      });
      var tm = setInterval(function () {
        if (_this.data.sec > 0) {
          _this.setData({ sec: _this.data.sec - 1 });
          if (_this.data.sec == 0) {
            _this.setData({ btnStatus: true });
            clearInterval(tm);
          }
        }
      }, 1000);
      base.get({ m: "SendPhoneCode", c: "User", phone: this.data.phone, ImageCode: this.key }, function (res) {
        var data = res.data;
        if (data.Status == "ok") {
          base.toast({ tilte: "已发送", icon: "success", duration: 2000 });
        }
      })
    }
  },

  changeTab: function (e) {
    var d = e.currentTarget.dataset.index;
    this.setData({ tab: d });
  },

  changepwd: function (e) { this.setData({ pwd: e.detail.value }); },

  changeUsername: function (e) { this.setData({ username: e.detail.value }) },

  login: function (e) {

    var getToken = wxRequest.getToken(Api.getToken(), e.detail.value.username, e.detail.value.password)
    getToken.then(response => {
      console.log(response.data)
      console.log(response.data.data)
      if (response.data.data != undefined && response.data.data.status === 403) {
        wx.showToast({
          title: '用户名密码错误',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        wx.showToast({
          title: '登录成功，正在跳往首页...',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        wx.setStorageSync('username', e.detail.value.username)
        wx.setStorageSync('password', e.detail.value.password)
        getApp().refreshLoginAndGoToUser()
      }
    })
  },

  register: function (e) {

    if (!this.data.emailValidated) {
      wx.showToast({
        title: '邮箱格式有误',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    var submit = wxRequest.postRequest(Api.register(), e.detail.value)
    submit.then(
      response => {
        wx.showToast({
          title: '注册成功，正在跳往首页...',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        wx.setStorageSync('username', e.detail.value.username)
        wx.setStorageSync('password', e.detail.value.password)
        getApp().refreshLoginAndGoToUser()
      })
  }
});