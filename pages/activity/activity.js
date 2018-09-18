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
    contents:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showNavigationBarLoading();
    //  let getid=options.id;
    this.getad(4);
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
  },

  escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
  getad:function(id){
    let that=this;
    app.request({
      url: api.index.getad,
      data:{
        id:id
      },
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
          this.setData({
            contents: that.escape2Html(ret.data.contents)
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },

  tap_join: function (event) {
    if (wx.getStorageSync('u_id')) {
        wx.navigateTo({
            url: '/pages/select/select'
        })
    } else {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    }
  }
})