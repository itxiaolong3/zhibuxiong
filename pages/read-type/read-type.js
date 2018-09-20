// pages/read/read.js
const app = getApp()
const api = require('../../api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '',
    sort: false,
    sort_state: 0,
    gushilist: [],
    shoucang: []
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
      id: options.id,
      title: title
    })
    wx.setNavigationBarTitle({
      title: title
    })
    this.get_shoucangid()
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

    // this.get_shoucangid(gstype, id)
    // console.log('故事类型' + this.data.nav_state+'排序状态：'+ id);
    // this.setData({
    //   sort_state: id
    // }) 
    // this.tap_sort()
  },

 get_hotgushi: function () {
    wx.showNavigationBarLoading()
      let that = this
      app.request({
        url: api.read.gettypereadlist,
        data: {
          gstype: this.data.id,
          ordertype: 0
        },
        success: (ret) => {
          if (ret.status == 1) {
            
            let list = ret.data
            
            let shouangid = this.data.shoucang
            list.forEach((value, index, array) => {
                value.p_count = Number(value.p_count)
                value.checked = false
            })

             for (var i in shouangid) {
              let str1 = shouangid[i];
              for (var j in list) {
                let str2 = list[j].p_id;
                if (str1 === str2) {
                  //console.log("相等的值为"+str1);
                  list[j].checked = true;
                } 
              }
            }

                that.setData({
                  gushilist: list
                })

               wx.hideNavigationBarLoading()
          }
        }
      })
  },
  //收藏故事的id
  get_shoucangid: function () {
    let uid = wx.getStorageSync('u_id');
    app.request({
      url: api.index.getreadshoucang,
      data: {
        uid: uid
      },
      success: (ret) => {
        //先加载了收藏id再进行加载故事列表
        this.get_hotgushi()
        if (ret.status == 1) {
          let getshoucangdata = ret.data;
          let getnewshoucanid = []
          for (var i in getshoucangdata) {
            getnewshoucanid.push(getshoucangdata[i].g_id)
          }
          this.setData({
            shoucang: getnewshoucanid
          })
        }
      }
    })
  },

    tap_hotread: function (event) {
      wx.navigateTo({
        url: `/pages/read-detail/read-detail?id=${event.currentTarget.dataset.id}&shoucangstatus=${event.currentTarget.dataset.checked}`
      })
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