// pages/listen/listen.js
const app = getApp()
const api = require('../../api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nav_state: 0,
    // sort: false,
    // sort_state: 0,
    gushilist: [],
    shoucang: [],
    page: 0,
    state: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.get_shoucangid()
  },

  onShareAppMessage: function () {
  
  },

  tap_item: function (event) {
    wx.navigateTo({
      url: `/pages/read-type/read-type?id=${event.currentTarget.dataset.id}`
    })
  },

  tap_swiper: function (event) {
    wx.navigateTo({
      url: '/pages/activity/activity'
    })
  },

  // tap_nav: function (event) {
  //     let id = event.currentTarget.dataset.id
  //     console.log(id);
  //     if (this.data.nav_state != id) {
  //         this.setData({
  //             nav_state: id
  //         })
  //     }
  //     this.get_shoucangid(id, 3)
  // },

  // tap_sort: function (event) {
  //   this.setData({
  //     sort: !this.data.sort 
  //   })
  // },

  // tap_sortitem: function (event) {
  //   let id = event.currentTarget.dataset.id
  //   let gstype = this.data.nav_state
  //   this.get_shoucangid(gstype, id)
  //   console.log('故事类型' + this.data.nav_state+'排序状态：'+ id);
  //   this.setData({
  //     sort_state: id
  //   }) 
  //   this.tap_sort()
  // },
  
  get_hotgushi: function () {
    wx.showNavigationBarLoading()
    this.setData({
      state: 1 
    })
      let that = this
      app.request({
        url: api.read.getallreadlist,
        data: {
          page: this.data.page
        },
        success: (ret) => {
          console.log(ret)
          if (ret.status == 1) {
            
            let list = ret.result
            
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
                  gushilist: this.data.gushilist.concat(list),
                  page: this.data.page + 1,
                  state: list.length == 4 ? 0 : 2
                })

               wx.hideNavigationBarLoading()
          } else {
              that.setData({
                state: 2
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

    onReachBottom: function() {
        if (this.data.state == 0 && this.data.gushilist.length != 0) {
            this.get_hotgushi()
        }
    },
})