// pages/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: 0,
    zjid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let zjid=options.zjid;
   if (zjid) {
    this.setData({
      zjid:zjid
    });
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

  },

  tap_select: function (event) {
    this.setData({
      select: event.currentTarget.dataset.index
    }) 
  },

  tap_btn: function (event) {
    let select = this.data.select
    let url = ''
    let zjid=this.data.zjid;
    if (select != 0) {
      if (select == 1) {
          url = '/pages/read/read?zjid='+zjid
      } else {
          url = '/pages/speak/speak?zjid='+zjid
      }
      wx.redirectTo({
          url: url
      })
    }
  }
})