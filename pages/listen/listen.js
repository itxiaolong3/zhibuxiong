// pages/listen/listen.js
const app = getApp()
const api = require('../../api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_state: 0,
    sort: false,
    sort_state: 0,
     gushilist: [],
    shoucang: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_shoucangid(0,3)
  },

  onShareAppMessage: function () {
  
  },

  tap_nav: function (event) {
      let id = event.currentTarget.dataset.id
      console.log(id);
      if (this.data.nav_state != id) {
          this.setData({
              nav_state: id
          })
      }
      this.get_shoucangid(id, 3)
  },

  tap_sort: function (event) {
    this.setData({
      sort: !this.data.sort 
    })
  },

  tap_sortitem: function (event) {
    let id = event.currentTarget.dataset.id
    let gstype = this.data.nav_state
    this.get_shoucangid(gstype, id)
    console.log('故事类型' + this.data.nav_state+'排序状态：'+ id);
    this.setData({
      sort_state: id
    }) 
    this.tap_sort()
  },
  
  //故事列表
  get_hotgushi: function (gstype,ordertype) {
    app.request({
      url: api.story.gethotgushi,
      data:{
        gstype: gstype,
        ordertype: ordertype,
      },
      success: (ret) => {
        console.log(ret);
        let shouangid = this.data.shoucang;
        if (ret.status == 1) {
          // console.log(ret.data[0]['img'][0]);
          let getgushilist = ret.data
          getgushilist.forEach((value, index, array) => {
            value.checked = false//如果checked属性没有就创建一个
            if (index == getgushilist.length - 1) {
              this.setData({
                gushilist: getgushilist,
              })
            }
          })
          //判断是否有相同的值
          for (var i in shouangid) {
            let str1 = shouangid[i];
            for (var j in getgushilist) {
              let str2 = getgushilist[j].id;
              if (str1 === str2) {
                //console.log("相等的值为"+str1);
                getgushilist[j].checked = true;
              }
            }
          }
          this.setData({
            gushilist: ret.data,
            load: 1
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  //收藏故事的id
  get_shoucangid: function (gstype, ordertype) {
    let uid = wx.getStorageSync('u_id');
    let gtype = gstype;
    let otype = ordertype
    app.request({
      url: api.index.getshoucang,
      data: {
        uid: uid
      },
      success: (ret) => {
        //先加载了收藏id再进行加载故事列表
        this.get_hotgushi(gtype, otype)
        if (ret.status == 1) {
          let getshoucangdata = ret.data;
          let getnewshoucanid = []
          for (var i in getshoucangdata) {
            getnewshoucanid.push(getshoucangdata[i].g_id)
          }
          this.setData({
            shoucang: getnewshoucanid,
            load: 1
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  detailgushi: function (e) {
    let getid = e.currentTarget.dataset.id;
    let shoucangstatus = e.currentTarget.dataset.checked;
    wx.navigateTo({
      url: '/pages/story-detail/story-detail?id=' + getid + '&shoucangstatus=' + shoucangstatus,
    })
  },
  onShow: function () {
    this.setData({
      nav_state: 0
    })
    this.get_shoucangid(0,3)
  },
})