const app = getApp()
const api = require('../../api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_state: 0,
      all: 0,
      items: [
          // {
          //     name: '狮子坐火车',
          //     image: '/images/other/sstory_1.jpg', 
          //     earphone: 142,
          //     flower: 6789,
          //     comment: [
          //       {
          //         time: '2017.02.23',
          //         content: '你 评论了周小明：讲得很棒！鼓掌鼓掌鼓掌鼓掌鼓掌'
          //       }
          //     ]
          // },
          // {
          //     name: '沙滩上的我们',
          //     image: '/images/other/sstory_2.jpg', 
          //     earphone: 142,
          //     flower: 6789,
          //     comment: [
          //       {
          //         time: '2017.02.23.12.45',
          //         content: '你 评论了周小明：讲得很棒！鼓掌鼓掌鼓掌鼓掌鼓掌'
          //       }
          //     ]
          // },
          // {
          //     name: '荷花上的蜻蜓',
          //     image: '/images/other/sstory_3.jpg', 
          //     earphone: 142,
          //     flower: 6789,
          //     comment: [
          //       {
          //         time: '2017.02.23.12.45',
          //         content: '你 评论了周小明：讲得很棒！鼓掌鼓掌鼓掌鼓掌鼓掌'
          //       },
          //       {
          //         time: '2017.02.23.12.45',
          //         content: '周小明回复了 你：谢谢!'
          //       }
          //     ]
          // }
      ],
      deletetype:3,
      comment:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    this.getpersonstory(0)
  },

    onShareAppMessage: function () {
    
    },

  tap_nav: function (event) {
      let id = event.currentTarget.dataset.id
      console.log('点击条目'+id);
     
      if (this.data.nav_state != id) {
          this.setData({
              nav_state: id,
              deletetype:4
          })
         
          // this.get_list()
      }else{
        this.setData({
          deletetype: 3
        })
      }
      this.getpersonstory(id)
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
            value.open = false//如果open属性没有就创建一个
            if (index == list.length - 1) {
                this.setData({
                    items: list
                })
            }
        })
    },
    //点击展开
    tap_open: function (event) {
        let items = this.data.items
        let item = items[event.currentTarget.dataset.id]
        let gsid = event.currentTarget.dataset.gsid;
        if(!item.open){
          console.log('打开');
          console.log('故事id' + gsid);
          let list = this.data.items
          list.forEach((value, index, array) => {
            if (value.gsid != gsid) {
              value.open = false
            }
            if (index == list.length - 1) {
              //console.log('关闭完成');
              this.setData({
                comment:''
              })
              this.gethuifu(gsid);
            }
          })
        }
        item.open = !item.open
        this.setData({
            items: items  
        })
    },
    getpersonstory: function (id) {
      let uid = wx.getStorageSync('u_id');
      let that = this;
      let type=id;
      console.log('type前=' + type);
      if (type==1){
         type = 4;
      }else{
         type = 3;
      }
      console.log('type后='+type);
      app.request({
        url: api.story.getpersonstory,
        data: {
          uid: uid,
          type: type
        },
        success: (ret) => {
          wx.hideLoading();
          console.log(ret);
          if (ret.status == 1) {
            this.setData({
              items: ret.data,
              all: 0
            });
            setTimeout(function () {
              that.get_data()
            }, 500);
            wx.hideNavigationBarLoading()
          } else {
            this.setData({
              items: '',
              all: 1
            });
          }

        }
      })
    },
    gethuifu:function(gsid){
      let that=this;
      let onegsid=gsid;
      let uid = wx.getStorageSync('u_id');
      app.request({
        url: api.story.getpersonstory,
        data: {
          uid: uid,
          type: 5,
          onegsid: onegsid
        },
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            that.setData({
              comment:ret.data
            })
          } else {
            
          }

        }
      })
    },
    tap_delete: function () {
      let arr = []
      let list = this.data.items
      let deletetype=this.data.deletetype;
      console.log('deletetype' + deletetype);
      list.forEach((value, index, array) => {
        if (value.checked) {
          arr.push(value.pl_id)
        }
        if (index == list.length - 1) {
          console.log(arr)
          //变量到最后一个后就执行删除操作
          let uid = wx.getStorageSync('u_id');
          app.request({
            url: api.story.dodelete,
            data: {
              uid: uid,
              type: deletetype,
              gsid: arr
            },
            success: (ret) => {
              // console.log(ret);
              if (ret.status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
                if (deletetype==3){
                  this.getpersonstory(0)
                }else{
                  this.getpersonstory(1)
                }
                
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

})