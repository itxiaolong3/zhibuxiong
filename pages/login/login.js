var api = require('../../api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    username: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    //用户授权，这个需要用户点击才行，而登录可以是默认执行的
   if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          wx.navigateBack({
            delta: 1
          })
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
        wx.showLoading({
            title: '正在保存数据',
            mask: true
        })
      var that = this;
      var nickname = e.detail.userInfo.nickName;
      var headerimg = e.detail.userInfo.avatarUrl;
      wx.login({
        success(ee) {
          app.request({
            url: api.user.savauserinfo,
            data: {
              'code': ee.code,
              'nickname': nickname,
              'headerimg': headerimg,
            },
            success: function (res) {
              if (res.status == 1) {
                  wx.setStorageSync('u_id', res.getid)
              } else if (res.status == 2) {
                  wx.setStorageSync('u_id', res.result.u_id)
              }
              wx.setStorageSync("nickname", nickname)
              wx.setStorageSync("userheaderimg", headerimg)
              wx.hideLoading()
              wx.navigateBack()
            }
          });
        }
      })
    } else {
        wx.showToast({
            title: '请重新点击授权',
            icon: 'none'
        })
    }
  
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

  }
})