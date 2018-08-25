// pages/login/login.js
const app = getApp()
const api = require('../../api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gushi: [],
    keyword:'',
    shoucang: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },
  keywords:function(e){
    console.log(e.detail.value);
    this.setData({
      keyword: e.detail.value
    });
  },
  gosearch:function(e){
    let keyword=this.data.keyword;
    let that=this;
    that.get_shoucangid()
    app.request({
      url: api.story.gethotgushi,
      data:{
        keyword:keyword
      },
      success: (ret) => {
        console.log(ret);
        console.log(ret.img);
        let shouangid = this.data.shoucang;
        if (ret.status == 1) {
          let getgushilist = ret.data
          getgushilist.forEach((value, index, array) => {
            value.checked = false//如果checked属性没有就创建一个
            if (index == getgushilist.length - 1) {
              this.setData({
                gushi: getgushilist,
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
          that.setData({
            gushi: ret.data
          });
        }
      }
    })
  },
  detail:function(e){
    let getid = e.currentTarget.dataset.id;
    let shoucangstatus = e.currentTarget.dataset.checked;
    wx.redirectTo({
      url: '/pages/story-detail/story-detail?id=' + getid + '&shoucangstatus=' + shoucangstatus,
    })
  },
  //收藏故事的id
  get_shoucangid: function () {
    let uid = wx.getStorageSync('u_id');
    app.request({
      url: api.index.getshoucang,
      data: {
        uid: uid
      },
      success: (ret) => {
        //先加载了收藏id再进行加载故事列表
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_shoucangid()
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