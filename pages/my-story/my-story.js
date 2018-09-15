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

    tap_switch: function (event) {
        let items = this.data.items
        let item = items[event.currentTarget.dataset.id]
        let state = item.switched
        items.forEach((value, index, array) => {
            value.switched = false
        })
        item.switched = !state
        this.setData({
            items: items
        })
    },

    tap_switchitem: function (event) {
        let items = this.data.items
        let item = items[event.currentTarget.dataset.id]
        let state = event.currentTarget.dataset.index
        items.forEach((value, index, array) => {
            value.switched = false
            if (index == items.length - 1) {
              setTimeout(()=>{
                this.setData({
                    items: items
                })
              },300)
            }
        })
        app.request({
          url: api.story.doisprivate,
          data: {
            id: item.id,
            isstatus: state
          },
          success: (ret) => {
           // console.log(ret);
              if (ret.status == 1) {
                wx.showToast({
                  title: '设置成功',
                  icon: 'none'
                })
                //this.getpersonstory()
              } else {
                wx.showToast({
                  title: '设置失败',
                  icon: 'none'
                })
              }
            }
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
            value.checked = false
            value.switched = false
            if (index == list.length - 1) {
                this.setData({
                    items: list
                })
            }
        })
    },
     getpersonstory: function () {
      let uid = wx.getStorageSync('u_id');
      let that = this;
      app.request({
        url: api.story.getpersonstory,
        data: {
          uid: uid,
          type: 0
        },
        success: (ret) => {
          wx.hideLoading();
          console.log(ret);
          if (ret.status == 1) {
            this.setData({
              items: ret.data,
            });
            setTimeout(function () {
              that.get_data()
            }, 500);
            wx.hideNavigationBarLoading()
          }else{
            this.setData({
              items: '',
            });
          }

        }
      })
    },
     tap_delete: function () {
       let arr = [];
       let noshenhe=[];
       let list = this.data.items
         list.forEach((value, index, array) => {
           if (value.checked) {//只删已经通过的故事
             if (value.status == 1){
               arr.push(value.id)
             }else{
               noshenhe.push(value.id);
             }
           }
           if (index == list.length - 1) {
             //console.log(arr)
             //变量到最后一个后就执行删除操作
             let uid = wx.getStorageSync('u_id');
             if (arr.length == 0 && noshenhe.length==0) {
               wx.showToast({
                 title: '请选择删除对象',
                 icon: 'none'
               })
             } else {
                app.request({
                  url: api.story.dodelete,
                  data: {
                    uid: uid,
                    type: 0,
                    gsid: arr,
                    noshenhe: noshenhe,
                    allarr: arr.concat(noshenhe)
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
             

           }
         })
     },
     //进入故事
     detail:function(e){
        console.log(e.currentTarget.dataset.gsid);
        let gsid = e.currentTarget.dataset.gsid;
        let status = e.currentTarget.dataset.status;
        wx.navigateTo({
          url: '/pages/story-detail/story-detail?id=' + gsid + '&shoucangstatus=fasle',
        })
        // if(status==1){
         
        // }else{
        //   wx.showToast({
        //     title: '亲，待审核中无法收听',
        //     icon: 'none'
        //   })
        // }
       
     },
    
})