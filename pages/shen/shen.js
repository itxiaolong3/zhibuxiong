const app = getApp()
const api = require('../../api.js')

// pages/shen/shen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getshen();
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
  //
  getshen: function () {
    //Postshouting
    let that=this;
    app.request({
      url: api.index.pian,
      success: (ret) => {
        if (ret.status == 1) {
          app.globalData.shenstatus = ret.data.shenstatus;
          let getstatus = ret.data.status;
          if (getstatus == 1) {
            wx.reLaunch({
              url: '../index/index'
            })
          } else {
            wx.reLaunch({
              url: '../indexx/indexx'
            })
          }
        }
      }
    })
  }
})