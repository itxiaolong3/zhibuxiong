const app = getApp()
const api = require('../../api.js')
Page({

    data: {
        all: 0,
        items: [
            
        ]
    },

    onLoad: function (options) {
      wx.showLoading({
        title: '拼命加载中...',
      })
      this.getpersonstory()
    },

    onShareAppMessage: function () {
    
    },

    tap_item: function (event) {
        let all = this.data.all
        let items = this.data.items
        let item = items[event.currentTarget.dataset.id]
        item.checked = !item.checked
        if (item.checked) {
            all += 1
        } else {
            all -= 1
        }
        this.setData({
            all: all,
            items: items  
        })
    },

    tap_all: function (event) {
        let all = 0
        let checked = false
        let items = this.data.items
        if (this.data.all != items.length) {
            all = items.length
            checked = true
        }
        for (let key in items) {
            items[key].checked = checked
        }
        this.setData({
            all: all,
            items: items
        })
    },

    get_data: function (event) {
        let list = this.data.items
        list.forEach((value, index, array) => {
            value.checked = false//如果checked属性没有就创建一个
            if (index == list.length - 1) {
                this.setData({
                    items: list
                })
            }
        })
    },
    getpersonstory:function(){
      let uid = wx.getStorageSync('u_id');
      let that=this;
      app.request({
        url: api.story.getpersonstory,
        data: {
          uid: uid,
          type:1
        },
        success: (ret) => {
          wx.hideLoading();
          console.log(ret);
          if (ret.status == 1) {
            this.setData({
              items: ret.data,
              all: 0
            });
            setTimeout(function(){
              that.get_data()
            },500);
            wx.hideNavigationBarLoading()
          }else{
            this.setData({
              items: '',
              all:1
            });
          }

        }
      })
    },
    tap_delete: function () {
      let arr = []
      let list = this.data.items
      list.forEach((value, index, array) => {
        if (value.checked) {
          arr.push(value.g_id)
        }
        if (index == list.length - 1) {
          console.log(arr)
          //变量到最后一个后就执行删除操作
          let uid = wx.getStorageSync('u_id');
          app.request({
            url: api.story.dodelete,
            data: {
              uid: uid,
              type: 1,
              gsid: arr
            },
            success: (ret) => {
              // console.log(ret);
              if (ret.status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                this.getpersonstory()
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            }
          })

        }
      })
    },
    //进入故事
    detail: function (e) {
      console.log(e.currentTarget.dataset.gsid);
      let gsid = e.currentTarget.dataset.gsid;
      wx.navigateTo({
        url: '/pages/story-detail/story-detail?id=' + gsid + '&shoucangstatus=fasle',
      })
    },
})