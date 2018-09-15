const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        load: 0,
        swiper: [],
        mask: false,
        gushilist:[],
        shoucang:[],
        hotuser:[],
        pianstatus:'',
        shareimg:[]
    },

    onLoad: function () {
      
        this.getshen();
        wx.showNavigationBarLoading()
        this.get_swiper()
        this.get_shoucangid()
        this.get_hotuser();
        
    },
    onShow:function(){
      this.get_shoucangid()
      this.get_hotuser();
      this.get_shareimg();
      
    },

    onShareAppMessage: function () {
      return{
        title:'织布熊故事',
        path:'/pages/indexx/indexx',
        imageUrl: this.data.shareimg.img,
        success(e){
           console.log('分享成功'); 
        },fail(e){
        console.log('分享失败');
        }
      }
    },
    
    set_mask: function () {
        this.setData({
            mask: !this.data.mask
        })
    },

    get_swiper: function () {
        app.request({
          url: api.index.getbanner,
          data:{
            position:1
          },
          success: (ret) => {
            if (ret.status == 1) {
                this.setData({
                    swiper: ret.data,
                    load: 1                    
                })
                wx.hideNavigationBarLoading()
            }
          }
        })
    },
    //获取首页分享封面
  get_shareimg: function () {
    app.request({
      url: api.index.shareimg,
      success: (ret) => {
        if (ret.status == 1) {
          this.setData({
            shareimg: ret.result,
          })
        }
      }
    })
  },
    //热门故事
    get_hotgushi: function () {
      app.request({
        url: api.index.gethotgushi,
        success: (ret) => {
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
    //热门主播
    get_hotuser:function(){
      app.request({
        url: api.index.gethotuser,
        success: (ret) => {
         console.log(ret);
          if (ret.status == 1) {
            this.setData({
              hotuser:ret.result
            });
          }
        }
      })
    },
    //收藏故事的id
    get_shoucangid: function () {
      let uid = wx.getStorageSync('u_id');
      app.request({
        url: api.index.getshoucang,
        data:{
          uid: uid
        },
        success: (ret) => {
          //先加载了收藏id再进行加载故事列表
          this.get_hotgushi()
          if (ret.status == 1) {
            let getshoucangdata = ret.data;
            let getnewshoucanid=[]
            for (var i in getshoucangdata){
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
    tap_speak: function (event) {
        if (wx.getStorageSync('u_id')) {
            if (!wx.getStorageSync('frist_speak')) {
                this.set_mask()
            } else {
                wx.navigateTo({
                    url: '/pages/select/select'
                })
            }
        } else {
            wx.navigateTo({
                url: '/pages/login/login'
            })
        }
    },

    tap_maskbtn: function (event) {
        this.set_mask()
        wx.setStorageSync('frist_speak', 'no')
        wx.navigateTo({
            url: '../select/select'
        })
    },
    detailgushi:function(e){
      let getid = e.currentTarget.dataset.id;
      let shoucangstatus=e.currentTarget.dataset.checked;
      wx.navigateTo({
        url: '/pages/story-detail/story-detail?id='+getid+'&shoucangstatus='+shoucangstatus,
      })
    },
  //审核
  getshen: function () {
    //Postshouting
    let that=this;
    app.request({
      url: api.index.pian,
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
          console.log(ret.data.status);
          app.globalData.shenstatus = ret.data.shenstatus;
          let getstatus = ret.data.status;
          that.setData({
            pianstatus: getstatus
          })
         
        
        }
      }
    })
  },
  goother:function(e){
    let getappid = e.currentTarget.dataset.appid;
    let getaid = e.currentTarget.dataset.aid;
    if(getappid=="#"){
        wx.navigateTo({
          url: '/pages/bannerimg/bannerimg?id='+getaid,
        })
    }else {
      wx.navigateToMiniProgram({
        appId: getappid,
        path: '',
        extraData: {
          foo: 'release'
        },
        envVersion: 'release',
        success(res) {
          console.log('跳转成功');
        }
      })
    }
  },

  godingzhi: function (event) {
      wx.navigateToMiniProgram({
        appId: 'wx3d5c463c7d74066c',
        path: '',
        extraData: {
          foo: 'release'
        },
        envVersion: 'release',
        success(res) {
          console.log('跳转成功');
        }
      })
  }
    
})