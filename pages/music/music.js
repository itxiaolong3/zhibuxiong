const app = getApp()
const api = require('../../api.js')
let urldata = ''
let title = ''
const bgplay = wx.getBackgroundAudioManager()
Page({

    data: {
        items: [
            // {
            //     id: 0,
            //     name: 'A Little Stroy',
            //     author: 'Valentin - My View'
            // },
            // {
            //     id: 1,
            //     name: '梦中的婚礼',
            //     author: 'Richard Clayderman - Richard Clayderman'
            // },
            // {
            //     id: 2,
            //     name: 'Summer',
            //     author: '久石让'
            // },
            // {
            //     id: 3,
            //     name: 'Canon(Over a Basso Ostinato)',
            //     author: 'Peerless 2x2'
            // },
            // {
            //     id: 4,
            //     name: '风住的街道',
            //     author: '饭碗的彼岸'
            // },
            // {
            //     id: 5,
            //     name: '安静的午后',
            //     author: 'Pianoboy高至豪'
            // },
            // {
            //     id: 6,
            //     name: '瞬间的永恒 夜色钢琴曲',
            //     author: '赵海洋'
            // },
            // {
            //     id: 7,
            //     name: '天空之城-钢琴版',
            //     author: '郭燕'
            // },
            // {
            //     id: 8,
            //     name: '月光奏鸣曲',
            //     author: '贝多芬'
            // }
        ]
    },

    onLoad: function (options) {
      this.getmusic();
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
    onShareAppMessage: function () {
    
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
    onHide:function(){
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