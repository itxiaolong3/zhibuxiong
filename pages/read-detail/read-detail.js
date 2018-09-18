// pages/read-detail/read-detail.js
const app = getApp()
const api = require('../../api.js')
const bgplay = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    nav: 0,
    gushi: '',
    contents: '',
    items: [],
    allplay: false,
    playindex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
     this.setData({
       id: options.id 
     })
    //this.getad(1)
    this.get_detail()
   //  this.getmusic()

     this.on_allplay()
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
    onHide:function(){
      //退出停止
      bgplay.stop()
      let items = this.data.items
      let allplay = this.data.allplay
      items.forEach((value, index, array) => {
          value.played = false
      })
      this.setData({
        items: items,
        allplay: false,
        playindex: 0
      })
    },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //退出停止
    bgplay.stop()
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

  get_detail: function () {
    let that = this;
    app.request({
      url: api.read.getstoryone,
      data: {
        p_id: this.data.id
      },
      success: (ret) => {
        console.log(ret)
        if (ret.status == 1) {
          let contents = that.escape2Html(ret.result.p_content)
          that.setData({
            gushi: ret.result,
            contents: contents
          });

          let list = ret.allmusic
          list.forEach((value, index, array) => {
              value.played = false
              if (index == list.length - 1) {
                that.setData({
                  items:list
                })
              }
          })
          
          wx.setNavigationBarTitle({
            title: ret.result.p_title
          })
          wx.hideNavigationBarLoading()
        }

      }
    })

  },

  tap_nav: function (event) {
     this.setData({
       nav: Number(event.currentTarget.dataset.id) 
     })
  },

  tap_item: function (event) {
      wx.navigateTo({
        url: `/pages/read-voice/read-voice?id=${event.currentTarget.dataset.id}`
      })
  },

  togospeak: function () {
    if (wx.getStorageSync('u_id')) {
      wx.navigateTo({
        url: `/pages/read-record/read-record?id=${this.data.id}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
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
          wx.setNavigationBarTitle({
            title: ret.data.title
          })
          this.setData({
            title: ret.data.title,
            author: 'XXX',
            contents: that.escape2Html(ret.data.contents)
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },

    getmusic:function(){
      let that=this;
      app.request({
        url: api.music.getbgmusic,
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            let list = ret.data
            list.forEach((value, index, array) => {
                value.played = false
                if (index == list.length - 1) {
                  that.setData({
                    items:list
                  })
                }
            })
          }
        }
      })
    },

    tap_play: function (event) {
        let items = this.data.items
        let allplay = this.data.allplay
        let item = items[event.currentTarget.dataset.index]
        if (allplay) {
          this.setData({
            allplay: false,
            playindex: 0
          })
        }
        if (item.played){ 
          if (allplay) {
              bgplay.stop()
          } else {
              bgplay.pause()
          }
        }else{
          //停止其他
          items.forEach((value, index, array) => {
            if (value.id != item.id) {
              value.played = false
            }
          })
          bgplay.src = item.r_yuyinurl
          bgplay.play()
        }
        item.played = !item.played
        this.setData({
            items: items  
        })
    },

    tap_allplay: function (event) {
        let items = this.data.items
        let allplay = this.data.allplay
        this.setData({
          allplay: !allplay,
          playindex: 0
        })
        if (!allplay) {
          console.log('全部播放')
          //停止其他
          items.forEach((value, index, array) => {
              if (index == 0) {
                  value.played = true
              } else {
                  value.played = false
              }
          })
          this.setData({
              items: items  
          })
          bgplay.stop()
          bgplay.src = items[0].r_yuyinurl
          bgplay.play()
        } else {
          console.log('全部暂停')
          items.forEach((value, index, array) => {
              value.played = false
          })
          this.setData({
              items: items  
          })
          bgplay.stop()
        }
    },

    on_allplay: function (event) {
        bgplay.onEnded(() => {
          let items = this.data.items
          let allplay = this.data.allplay
          let playindex = this.data.playindex 
          if (allplay) {
              playindex += 1
              if (items[playindex].r_yuyinurl) {
                //停止其他
                items.forEach((value, index, array) => {
                    if (index == playindex) {
                        value.played = true
                    } else {
                        value.played = false
                    }
                })
                bgplay.stop()
                bgplay.src = items[playindex].url
                bgplay.play()
                this.setData({
                  items: items,
                  playindex: playindex
                })
                console.log('下一首')
              }
          }
        }) 
    }

})