const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        mask: false,
        mask2: false,
        mask3: false,
        radio: 0,
        radio2: 0,
        name: '',
        language: '',
        imgs: [],
        bjurl: '',
        bjtitle:'',
       // imgs_old: []
    },

    onLoad: function (e) {
      //console.log(e.bgurl);
    },

    onShareAppMessage: function () {
    
    },
    set_mask: function () {
        this.setData({
            mask: !this.data.mask
        })
    },

    set_mask2: function () {
        this.setData({
            mask2: !this.data.mask2
        })
    },
    set_mask3: function () {
      this.setData({
        mask3: !this.data.mask3
      })
    },
    tap_upload: function (event) {
        if (!wx.getStorageSync('frist_upload')) {
            this.set_mask()
        } else {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    wx.showLoading({
                        title: '正在上传',
                        mask: true
                    })
                    wx.uploadFile({
                        url: api.speak.uploadimg,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        success: (res) => {
                          console.log(res);
                            let img = JSON.parse(res.data).data.imgpath
                            let status = JSON.parse(res.data).data.status
                            if (status==1){
                              console.log('图片正常');
                              let imgs = this.data.imgs
                              //let imgs_old = this.data.imgs_old
                              imgs.push(`${api.root.substr(0, api.root.indexOf('app'))}attachment/${img}`)
                              // imgs_old.push(img)
                              this.setData({
                                imgs: imgs,
                                // imgs_old: imgs_old
                              })
                              app.globalData.speak_data.imgs = this.data.imgs
                            } else if (status == -1){
                              console.log('发生未知错误');
                              wx.showToast({
                                title: '发生未知错误',
                                icon: 'none'
                              }) 
                            }else{
                              wx.showToast({
                                title: '小孩子不能上传黄色图片哦',
                                icon: 'none'
                              }) 
                              console.log('涉黄');
                            }
                           
                            // app.globalData.speak_data.imgs_old=this.data.imgs_old
                            wx.hideLoading()
                        },
                        fail: (err) => {
                            console.log(err)
                        }
                    })
                }
            })
        }
    },

    delete: function (e) {
        let imgsArray = this.data.imgs
       // let imgs_oldArray = this.data.imgs_old
        var t = this;
        Array.prototype.indexOf = function (e) {
        for (var t = 0; t < this.length; t++) if (this[t] == e) return t;
        return -1
        }, Array.prototype.remove = function (e) {
        var t = this.indexOf(e);
        t > -1 && this.splice(t, 1)
        };
        var a = e.currentTarget.dataset.inde;
        imgsArray.remove(imgsArray[a]), t.setData({
        imgs: imgsArray
        })
        
        app.globalData.speak_data.imgs = this.data.imgs
        // imgs_oldArray.remove(imgs_oldArray[a]), t.setData({
        // imgs_old: imgs_oldArray
        // })
        // app.globalData.speak_data.imgs_old = this.data.imgs_old
    },

    tap_radio: function (event) {
        let id = Number(event.currentTarget.dataset.id)
        if (id == 2) {
            this.set_mask2()
        } else {
            this.setData({
                radio: id 
            })
        }
    },

    tap_radio2: function (event) {
        let id = Number(event.currentTarget.dataset.id)
        this.setData({
            radio2: id 
        })
    },

    tap_btn: function (event) {
        let name = this.data.name
        let imgs = this.data.imgs
        let bjurl = this.data.bjurl
        //let imgs_old = this.data.imgs_old
        let radio = this.data.radio
        let language = this.data.language
        if (name.length == 0 || name.length > 8) {
            wx.showToast({
                title: '名字控制在1到8个字符哦',
                icon: 'none'
            })
        } else if (imgs.length == 0) {
            wx.showToast({
                title: '至少要上传一张图片哦',
                icon: 'none'
            })
        } else {
            radio == 0 ? language = '中文' : radio == 1 ? language = '英文' : ''
            app.globalData.speak_data.name = name
            app.globalData.speak_data.imgs = imgs
            app.globalData.speak_data.bjurl = bjurl
            console.log("得到的链接"+app.globalData.speak_data.bjurl);
            // app.globalData.speak_data.imgs_old = imgs_old
            app.globalData.speak_data.language = language
            wx.redirectTo({
                url: '../speak-record/speak-record'
            })
        }
    },

    tap_maskbtn: function (event) {
        this.set_mask()
        wx.setStorageSync('frist_upload', 'no')
        this.tap_upload()
    },
    //检查标题是否合法
    checktitle:function(content){
      
    },

    tap_mask2btn: function (event) {
        let radio = 0
        if (this.data.language != '') {
            radio = 2
        }
        this.setData({
            radio: radio
        })
        this.set_mask2()
    },
    tap_mask3btn: function (event) {
      this.set_mask3()
      wx.navigateTo({
        url: '/pages/music/music',
      })
    },
    input_value: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'name'
                break
            case 1:
                name = 'language'
                break
        }
        this.setData({
            [name]: event.detail.value.replace(/\s+/g, '')
        })
    },
    onShow:function(){
      var getglobaldata = app.globalData.speak_data.imgs
      if (getglobaldata.length>0){
        this.setData({
          imgs: app.globalData.speak_data.imgs,
          // imgs_old: app.globalData.speak_data.imgs_old
        })
      }
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      console.log(currPage.data.bgmusicurl);
      console.log(currPage.data.title);
      if (currPage.data.title){
        this.setData({
          bjtitle: currPage.data.title,
          bjurl: currPage.data.bgmusicurl
        })
      }
     

    },
    gotuku:function(){
      let imgs = this.data.imgs
      if (imgs.length >= 9) {
        wx.showToast({
          title: '最多上传9张图片哦',
          icon: 'none'
        })
      }else{
        wx.navigateTo({
          url: '/pages/gallery/gallery',
        })
      } 
     
    },
    gomusic:function(){
      this.set_mask3();
    }

})
