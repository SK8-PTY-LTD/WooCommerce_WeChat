import config from 'config.js'

var domain = config.getDomain;
var pageCount = config.getPageCount;
var indexListType = config.getIndexListType;
var HOST_URI = 'https://' + domain + '/wp-json/wp/v2/';
var HOST_URI_WATCH_LIFE_JSON = 'https://' + domain + '/wp-json/watch-life-net/v1/';
var HOST_URI_PRODUCTS = 'https://' + domain + '/wp-json/wc/v2/products';
var HOST_URI_USER = 'https://' + domain + '/wp-json/wp/v2/users/me?context=edit';
var HOST_URI_TOKEN = 'https://' + domain + '/wp-json/jwt-auth/v1/token/'
var HOST_URI_ORDERS = 'https://' + domain + '/wp-json/wc/v2/orders'
var HOST_URI_CUSTOMER = 'https://' + domain + '/wp-json/wc/v2/customers'
var HOST_URI_VALIDATE = 'https://' + domain + '/wp-json/jwt-auth/v1/token/validate'
var HOST_URI_REGISTER = 'https://' + domain + '/wp-json/wp/v2/users/register'
var HOST_URI_PAYMENT = 'https://' + domain + '/wp-json/wc/v2/payment'

module.exports = {
  getPosts: function (obj) {
    var url = HOST_URI + 'posts?per_page=' + pageCount + '&orderby=date&order=desc&page=' + obj.page;
    if (obj.categories != 0)
      url += '&categories=' + obj.categories;
    else if (obj.search != '')
      url += '&search=' + encodeURIComponent(obj.search);
    else if (indexListType != 'all')
      url += '&categories=' + indexListType;
    return url;
  },

  payment() { return HOST_URI_PAYMENT },

  register: function () { return HOST_URI_REGISTER },

  createOrder: function () { return HOST_URI_ORDERS },

  updateOrder: function (id) { return HOST_URI_ORDERS + "/" + id },

  getFeaturedProducts: function () { return HOST_URI_PRODUCTS + "?featured=true" },

  getValidate: function () { return HOST_URI_VALIDATE },

  getCustomer: function (id) { return HOST_URI_CUSTOMER + "/" + id },

  getOrders: function (id) { return HOST_URI_ORDERS + '?customer=' + id },

  getProduct: function (id) { return HOST_URI_PRODUCTS + "/" + id },

  getProducts: function (category, page, per_page = 9) { return HOST_URI_PRODUCTS + '?category=' + category + "&per_page=" + per_page + "&page=" + page; },

  getToken: function () { return HOST_URI_TOKEN },

  getWordPressUserInfo: function () { return HOST_URI_USER; },

  getPostsByCategories: function (categories) { return HOST_URI + 'posts?per_page=20&orderby=date&order=desc&page=1&categories=' + categories; },

  getStickyPosts: function () { return HOST_URI + 'posts?sticky=true&per_page=5&page=1'; },

  getSwiperPosts: function () {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += 'post/swipe';
    return url;
  },

  getEnableComment: function () {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += 'options/enableComment';
    return url;
  },

  getPostsByTags: function (id, tags) { return HOST_URI + 'posts?per_page=5&&page=1&exclude=' + id + "&tags=" + tags },

  getPostsByIDs: function (obj) { return HOST_URI + 'posts?include=' + obj },

  getPostBySlug: function (obj) { return HOST_URI + 'posts?slug=' + obj },

  getPostByID: function (id) { return HOST_URI + 'posts/' + id },

  getPages: function () { return HOST_URI + 'pages' },

  getPageByID: function (id, obj) { return HOST_URI + 'pages/' + id },

  getCategories: function () { return HOST_URI_PRODUCTS + "/categories/" },

  getCategoryByID: function (id) { return HOST_URI + 'categories/' + id },

  getComments: function (obj) { return HOST_URI + 'comments?per_page=100&orderby=date&order=asc&post=' + obj.postID + '&page=' + obj.page },

  getNewComments: function () { return HOST_URI + 'comments?parent=0&per_page=20&orderby=date&order=desc' },

  getChildrenComments: function (obj) { return HOST_URI + 'comments?parent_exclude=0&per_page=100&orderby=date&order=desc&post=' + obj.postID },

  getRecentfiftyComments: function () { return HOST_URI + 'comments?per_page=30&orderby=date&order=desc' },

  postComment: function () { return HOST_URI + 'comments' },

  postWeixinComment: function () {
    var url = HOST_URI_WATCH_LIFE_JSON;
    return url + 'comment/add'
  },

  getWeixinComment: function (openid) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    return url + 'comment/get?openid=' + openid;
  },

  //获取文章的第一个图片地址,如果没有给出默认图片
  getContentFirstImage: function (content) {
    var regex = /<img.*?src=[\'"](.*?)[\'"].*?>/i;
    var arrReg = regex.exec(content);
    var src = "../../images/logo700.png";
    if (arrReg)
      src = arrReg[1];

    return src;
  },

  //获取热点文章
  getTopHotPosts(flag) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    if (flag == 1)
      url += "post/hotpostthisyear"
    else if (flag == 2)
      url += "post/pageviewsthisyear"
    else if (flag == 3)
      url += "post/likethisyear"
    else if (flag == 4)
      url += "post/praisethisyear"

    return url;
  },

  //更新文章浏览数
  updatePageviews(id) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/addpageview/" + id;
    return url;
  },
  //获取用户openid
  getOpenidUrl(id) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "weixin/getopenid";
    return url;
  },

  //点赞
  postLikeUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/like";
    return url;
  },

  //判断当前用户是否点赞
  postIsLikeUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/islike";
    return url;
  },

  //获取我的点赞
  getMyLikeUrl(openid) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/mylike?openid=" + openid;
    return url;
  },

  //赞赏,获取支付密钥
  postPraiseUrl() {
    var url = 'https://' + domain + "/wp-wxpay/pay/app.php";
    return url;
  },

  //更新赞赏数据
  updatePraiseUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/praise";
    return url;
  },

  //获取我的赞赏数据
  getMyPraiseUrl(openid) {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/mypraise?openid=" + openid;
    return url;
  },

  //获取所有的赞赏数据
  getAllPraiseUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "post/allpraise";
    return url;
  },

  //发送模版消息
  sendMessagesUrl() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "weixin/sendmessage";
    return url;
  },
  //获取订阅的分类
  getSubscription() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "category/getsubscription";
    return url;
  },

  //订阅的分类
  postSubscription() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "category/postsubscription";
    return url;
  },

  //删除订阅的分类
  delSubscription() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "category/delSubscription";
    return url;
  },

  //生成海报
  creatPoster() {
    var url = HOST_URI_WATCH_LIFE_JSON;
    url += "weixin/qrcodeimg";
    return url;
  },
  //获取海报
  getPosterUrl() {
    var url = 'https://' + domain + "/wp-content/plugins/wp-rest-api-for-app/poster/";
    return url;
  },
  //获取二维码
  getPosterQrcodeUrl() {
    var url = 'https://' + domain + "/wp-content/plugins/wp-rest-api-for-app/qrcode/";
    return url;
  }
};