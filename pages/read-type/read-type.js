// pages/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    sort: false,
    sort_state: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = ''
    switch (Number(options.id)) {
      case 0:
        title = '寓言故事'
        break;
      case 1:
        title = '成语故事'
        break;
      case 2:
        title = '科学故事'
        break;
      case 3:
        title = '经典名著'
        break;
      case 4:
        title = '精选故事'
        break;
      default:
        break;
    } 
    this.setData({
      title: title
    })
    wx.setNavigationBarTitle({
      title: title
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