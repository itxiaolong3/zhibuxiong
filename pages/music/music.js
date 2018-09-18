const app = getApp()
const api = require('../../api.js')
let urldata = ''
let title = ''
const bgplay = wx.getBackgroundAudioManager()
Page({

    data: {
        items: []
    },

    onLoad: function (options) {
      this.getmusic();
    },
    onShareAppMessage: function () {
    
    },
    //获取音乐信息
    getmusic:function(){
      let that=this;
      app.request({
        url: api.music.getbgmusic,
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            that.setData({
              items:ret.data
            });
          }
        }
      })
    },
    tap_btn: function (event) {
      bgplay.stop();
        if(urldata){
         // console.log('可以跳转');
        }else{
          wx.showToast({
            title: '请选择背景音乐',
            icon:'none'
          })
        }
        // wx.redirectTo({
        //   url: '/pages/speak/speak?bgurl=' + urldata,
        // })
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({//直接给上移页面赋值
          bgmusicurl: urldata,
          title:title
        });
        wx.navigateBack({//返回
          delta: 1
        })
        urldata=''
        title=''
       // wx.navigateBack()
    },

    tap_check: function (event) {
        let items = this.data.items
        let item = items[event.currentTarget.dataset.index]
        let id = event.currentTarget.dataset.id;
        let url = event.currentTarget.dataset.url;
        let name = event.currentTarget.dataset.title;
        if(!item.checked){
          items.forEach((value, index, array) => {
            if (value.id != id) {
              value.checked = false
            }
          })
        }
        item.checked = !item.checked
        this.setData({
          items: items
        })
        if (item.checked){
          urldata=url;
          title=name
        }else{
          urldata=''
          title=''
        }
        console.log(urldata);
        
    },

    tap_play: function (event) {
        let items = this.data.items
        let item = items[event.currentTarget.dataset.index]
        let id = event.currentTarget.dataset.id;
        let url = event.currentTarget.dataset.url;
        console.log(url)
        if(!item.played){
          items.forEach((value, index, array) => {
            if (value.id != id) {
              value.played = false
            }
          })
        }
        item.played = !item.played
        this.setData({
            items: items  
        })
        if (item.played){
          console.log('播放');
          bgplay.title = '背景试听'
          bgplay.epname = '童话故事'
          bgplay.src = url
        }else{
          console.log('暂停');
          bgplay.stop();
        }
    },

    get_data: function (event) {
        let list = this.data.items
        list.forEach((value, index, array) => {
            value.checked = false//如果checked属性没有就创建一个
            value.played = false//如果played属性没有就创建一个
            if (index == list.length - 1) {
                this.setData({
                    items: list
                })
            }
        })
    },
    onUnload:function(){
      bgplay.stop();
      let items = this.data.items
      items.forEach((value, index, array) => {
        if (value.id != id) {
          value.checked = false
        }
      })
      this.setData({
        items: items
      })
    }

})