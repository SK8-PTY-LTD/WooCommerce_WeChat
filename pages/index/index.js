var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var wxApi = require('../../utils/wxApi.js')
var wxRequest = require('../../utils/wxRequest.js')

import config from '../../utils/config.js'

var pageCount = config.getPageCount;

Page({
  data: {
    postsList: [],
    postsShowSwiperList: [],
    isLastPage: false,
    page: 1,
    search: '',
    categories: 0,
    showerror: "none",
    showCategoryName: "",
    categoryName: "",
    showallDisplay: "block",
    displayHeader: "none",
    displaySwiper: "none",
    floatDisplay: "none",
    displayfirstSwiper: "none",
    topNav: [],

    images: ["https://likegou.sk8tech.io/wp-content/uploads/2018/05/slider1.jpg",
      "https://likegou.sk8tech.io/wp-content/uploads/2018/05/slider2.jpg",
      "https://likegou.sk8tech.io/wp-content/uploads/2018/05/slider3.jpg"],

    datas: ["https://gitee.com/index/ent_poster/banner_5_1_a.png",
      "https://gitee.com/index/ent_poster/banner_5_1_a.png",
      "https://gitee.com/index/ent_poster/banner_5_1_a.png",
      "https://gitee.com/index/ent_poster/banner_5_1_a.png"],

    featuredProducts: [],
    categories: []
  },

  formSubmit: function (e) {
    var url = '../list/list'
    var key = '';
    if (e.currentTarget.id == "search-input")
      key = e.detail.value;
    else
      key = e.detail.value.input;

    if (key != '') {
      url = url + '?search=' + key;
      wx.navigateTo({ url: url })
    }
    else
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false,
      });
  },

  onShareAppMessage: function () {
    return {
      title: '“' + config.getWebsiteName + '”网站微信小程序,基于WordPress版小程序构建.技术支持：www.watch-life.net',
      path: 'pages/index/index',
      success: function (res) { },
      fail: function (res) { }
    }
  },

  onLoad: function (options) {
    var self = this;
    this.fetchTopFivePosts();
    self.setData({ topNav: config.getIndexNav });

    var categories = wxRequest.getRequestWithToken(Api.getCategories(), getApp().globalData.token)
    categories.then(response => { self.setData({ categories: response.data, }) })
  },

  onShow: function (options) { wx.setStorageSync('openLinkCount', 0); },

  fetchTopFivePosts: function () {
    var self = this;
    var getPostsRequest = wxRequest.getRequest(Api.getSwiperPosts());
    getPostsRequest.then(response => {
      if (response.data.status == '200' && response.data.posts.length > 0) {
        self.setData({
          postsShowSwiperList: response.data.posts,
          postsShowSwiperList: self.data.postsShowSwiperList.concat(response.data.posts.map(function (item) {
            if (item.post_medium_image_300 == null || item.post_medium_image_300 == '')
              if (item.content_first_image != null && item.content_first_image != '')
                item.post_medium_image_300 = item.content_first_image;
              else
                item.post_medium_image_300 = "../../images/logo700.png";
            return item;
          })),
          showallDisplay: "block",
          displaySwiper: "block"
        });

      }
      else
        self.setData({
          displaySwiper: "none",
          displayHeader: "block",
          showallDisplay: "block",
        });
    })
      .then(response => { self.fetchPostsData(self.data); })
      .catch(function (response) {
        console.log(response);
        self.setData({
          showerror: "block",
          floatDisplay: "none"
        });
      })
      .finally(function () {
      });
  },

  //获取文章列表数据
  fetchPostsData: function (data) {
    var self = this
    if (!data) data = {}
    if (!data.page) data.page = 1
    if (!data.categories) data.categories = 0;
    if (!data.search) data.search = ''
    if (data.page === 1)
      self.setData({ postsList: [] })

    var getPostsRequest = wxRequest.getRequest(Api.getPosts(data));
    getPostsRequest.then(response => {
      if (response.statusCode === 200) {
        if (response.data.length < pageCount)
          self.setData({ isLastPage: true });
        self.setData({
          floatDisplay: "block",
          postsList: [self.data.postsList.concat(response.data.map(function (item) {
            var strdate = item.date
            if (item.category_name != null)
              item.categoryImage = "../../images/category.png";
            else
              item.categoryImage = "";
            if (item.post_thumbnail_image == null || item.post_thumbnail_image == '')
              item.post_thumbnail_image = "../../images/logo.jpg";
            item.date = util.cutstr(strdate, 10, 1);
            return item;
          }))[0]],
        });
        setTimeout(function () { wx.hideLoading(); }, 900);
      }
      else
        if (response.data.code == "rest_post_invalid_page_number") {
          self.setData({ isLastPage: true });
          wx.showToast({
            title: '没有更多内容',
            mask: false,
            duration: 1500
          });
        }
        else
          wx.showToast({ title: response.data.message, duration: 1500 })
    })
      .catch(function (response) {
        if (data.page == 1)
          self.setData({
            showerror: "block",
            floatDisplay: "none"
          });
        else {
          wx.showModal({
            title: '加载失败',
            content: '加载数据失败,请重试.',
            showCancel: false,
          });
          self.setData({ page: data.page - 1 });
        }
      })
      .finally(function (response) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      });

    var featuredProducts = wxRequest.getRequestWithToken(Api.getFeaturedProducts(), getApp().globalData.token);
    featuredProducts.then(response => {
      this.setData({ featuredProducts: response.data })
      console.log(this.data.featuredProducts)
    })
  },

  //加载分页
  loadMore: function (e) {

    var self = this;
    if (!self.data.isLastPage) {
      self.setData({ page: self.data.page + 1 });
      this.fetchPostsData(self.data);
    }
    else
      wx.showToast({
        title: '没有更多内容',
        mask: false,
        duration: 1000
      });
  },

  // 跳转至查看文章详情
  redictDetail: function (e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({ url: url })
  },

  //首页图标跳转
  onNavRedirect: function (e) {
    var redicttype = e.currentTarget.dataset.redicttype;
    var url = e.currentTarget.dataset.url == null ? '' : e.currentTarget.dataset.url;
    var appid = e.currentTarget.dataset.appid == null ? '' : e.currentTarget.dataset.appid;
    var extraData = e.currentTarget.dataset.extraData == null ? '' : e.currentTarget.dataset.extraData;
    if (redicttype == 'apppage') //跳转到小程序内部页面
      wx.navigateTo({ url: url })
    else if (redicttype == 'webpage')//跳转到web-view内嵌的页面
    {
      url = '../webpage/webpage?url=' + url;
      wx.navigateTo({ url: url })
    }
    else if (redicttype == 'miniapp')//跳转到其他app
      wx.navigateToMiniProgram({
        appId: appid,
        envVersion: 'release',
        path: url,
        extraData: extraData,
        success(res) { },
        fail: function (res) { console.log(res); }
      })
  },
  // 跳转至查看小程序列表页面或文章详情页
  redictAppDetail: function (e) {
    var id = e.currentTarget.id;
    var redicttype = e.currentTarget.dataset.redicttype;
    var url = e.currentTarget.dataset.url == null ? '' : e.currentTarget.dataset.url;
    var appid = e.currentTarget.dataset.appid == null ? '' : e.currentTarget.dataset.appid;

    if (redicttype == 'detailpage')//跳转到内容页
    {
      url = '../detail/detail?id=' + id;
      wx.navigateTo({ url: url })
    }
    if (redicttype == 'apppage') //跳转到小程序内部页面         
      wx.navigateTo({ url: url })
    else if (redicttype == 'webpage')//跳转到web-view内嵌的页面
    {
      url = '../webpage/webpage?url=' + url;
      wx.navigateTo({ url: url })
    }
    else if (redicttype == 'miniapp')//跳转到其他app
      wx.navigateToMiniProgram({
        appId: appid,
        envVersion: 'release',
        path: url,
        success(res) { },
        fail: function (res) { console.log(res); }
      })
  },
  //返回首页
  redictHome: function (e) {
    var id = e.currentTarget.dataset.id,
      url = '/pages/index/index';
    wx.switchTab({ url: url });
  },

  goCategory: function (e) {
    getApp().presetIndex(e.currentTarget.dataset.information.id, e.currentTarget.dataset.information.slug)
    wx.switchTab({ url: '../category/category', })
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