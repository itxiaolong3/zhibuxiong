// pages/activity/activity.js
const app = getApp()
const api = require('../../api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: 0,
    sort: false,
    sort_state: 0,
    contents:'',
    topimg:'',
    desc:'',
    zjid:'',
    gushi:[],
    gushiread:[],
    aid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showNavigationBarLoading();
     let getid=options.id;
     console.log('得到的zjid='+getid);
     this.setData({
       aid:getid
     })
    this.getactivit(getid,0);
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
    let getimg = this.data.topimg;
    console.log('图片'+getimg);
    return {
      title: this.data.desc,
      path: '',
      imageUrl: getimg,
      success(e) {
        console.log('分享成功');
      }, fail(e) {
        console.log('分享失败');
      }
    }
  },

  tap_nav: function (event) {
     this.setData({
       nav: Number(event.currentTarget.dataset.id) 
     })
  },

  tap_sort: function (event) {
    this.setData({
      sort: !this.data.sort 
    })
  },

  tap_sortitem: function (event) {
    let id = event.currentTarget.dataset.id
    this.setData({
      sort_state: id
    }) 
    this.tap_sort()
    console.log('活动故事里的排序id='+id);
    this.getactivit(this.data.aid, id);
  },

  escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
  getactivit:function(id,typenum){
    let that=this;
    app.request({
      url: api.read.getactivitdetail,
      data:{
        id:id,
        ordertype:typenum
      },
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
          this.setData({
            contents: that.escape2Html(ret.data.zj_content),
            topimg:ret.data.zj_img,
            desc: ret.data.zj_desc,
            zjid:ret.data.zj_id,
            gushi:ret.zjgushi,
            gushiread:ret.zjgushiread
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },

  tap_join: function (event) {
    let zjid = event.currentTarget.dataset.zjid;
    if (wx.getStorageSync('u_id')) {
      wx.navigateTo({
        url: '/pages/select/select?zjid=' + zjid
      })
      // wx.redirectTo({
      //   url: '/pages/speak/speak?zjid='+zjid
       
      // })
    } else {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    }
  },
  detailgushiread: function (e) {
    let getgid = e.currentTarget.dataset.id;
    let getpid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: `/pages/read-voice/read-voice?pid=${getpid}&rid=${getgid}`
    })
  },
  detailgushi: function (e) {
    let getid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/story-detail/story-detail?id=' + getid + '&shoucangstatus=false',
    })
  },
  gotoshare:function(e){
    console.log('点击了分享' );
    let getid = e.currentTarget.dataset.gid;
    wx.redirectTo({
      url: '../speak-success/speak-success?gsid=' + getid+'&iszj=1'
    })
    console.log('点击了分享，id='+getid);
  },
  gotoshareread: function (e) {
    console.log('点击了分享，专辑' + getzjid);
    let getid = e.currentTarget.dataset.gid;
    let getpid = e.currentTarget.dataset.pid;
    let getzjid = e.currentTarget.dataset.zjid;
    wx.redirectTo({
      url: '../speak-success/speak-success?gsid=' + getid + '&pid=' + getpid+'&iszj='+getzjid
    })
    console.log('点击了分享，id=' + getid);
  }
})