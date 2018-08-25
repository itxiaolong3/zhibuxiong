const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        load: 0,
        nav_data: [],
        nav_state: 0,
        list_data: [],
        list_state: 1,
        choos_data:[]
    },

    onLoad: function () {
        wx.showNavigationBarLoading()
        this.get_nav()
    },

    onShareAppMessage: function () {
    
    },

    tap_nav: function (event) {
        let index = event.currentTarget.dataset.index
        let name = event.currentTarget.dataset.name
        if (this.data.nav_state != index) {
            this.setData({
                nav_state: index
            })
            this.get_list(name)
        }

    },

    get_nav: function (event) {
        app.request({
            url: api.gallery.getfenlei,
            success: (res) => {
                if (res.status == 1) {
                    this.setData({
                        nav_data: res.data
                    })
                    this.get_list(this.data.nav_data[0].typename)
                    // setTimeout(function(){
                    //   let list = this.data.list_data;
                    // },500);
                }
            }
        })
    },

    get_list: function (name) {
        this.setData({
            list_state: 0 
        })
        app.request({
            url: `${api.gallery.gettuku}&keyword=${name}`,
            success: (res) => {
              var that=this;
                if (res.status == 1) {
                    let list = res.data
                    let choosedata = this.data.choos_data;
                    list.forEach((value, index, array) => {
                        value.checked = false//如果checked属性没有就创建一个
                        if (index == list.length - 1) {
                            this.setData({
                                list_data: list,
                                list_state: 1
                            })
                        }
                    })
                     setTimeout(function(){
                       for (var i in choosedata){
                         let  str1=choosedata[i];
                         for (var j in list){
                              let    str2=list[j].imgurl;
                                if(str1===str2){
                                  //console.log("相等的值为"+str1);
                                  list[j].checked=true;
                                }else{
                                 // console.log("不值为" + str1);
                                }
                            }
                        }
                       that.setData({
                         list_data: list,
                       })
                    },100);
                } else {
                    this.setData({
                        list_data: [],
                        list_state: -1
                    })
                }
                if (this.data.load == 0) {
                    this.setData({
                        load: 1
                    })
                    wx.hideNavigationBarLoading()
                }
            }
        })
    },

    tap_item: function (event) {
        let list = this.data.list_data
        let item = list[event.currentTarget.dataset.index]
        let imgurl=item.imgurl;
        let choosedata = this.data.choos_data;
        item.checked = !item.checked
        let getglobalimg = app.globalData.speak_data.imgs
        let globalsize=getglobalimg.length;
        let size=9-(choosedata.length+globalsize)
        if (item.checked){
          if (size <=0) {
            wx.showToast({
              title: '最多上传9张图片哦',
              icon: 'none'
            })
            item.checked = !item.checked
          }else{
            choosedata.push(imgurl);
          }  
         
        }else{
          if (choosedata.length > 0) {
            for (var i = 0; i < choosedata.length; i++) {
              if (choosedata[i] == imgurl) {
                choosedata.splice(i, 1);
                break;
              }
            } 
          }
        
        }
        //console.log(choosedata);
        this.setData({
            list_data: list, 
        })
    },
    next:function(){
      var getchoosedata=this.data.choos_data;
      var golbalimg = app.globalData.speak_data.imgs
     // var golbaloldimg = app.globalData.speak_data.imgs_old
      //完整路径
      var newgolbalimg=golbalimg.concat(getchoosedata);
      app.globalData.speak_data.imgs = newgolbalimg;
      //处理路径切割数据
      // var getdealroot = this.dealrooturl();
      // console.log(getdealroot.length + 12);
      // for (var i in getchoosedata){
      //   let str2 = getchoosedata[i];
      //   console.log(str2);
      //   getchoosedata[i] = str2.substring(getdealroot.length + 12, getchoosedata[i].length)
      // }
      //半截路径
      // var newarray=golbaloldimg.concat(getchoosedata);
      // app.globalData.speak_data.imgs_old = newarray

      wx.navigateBack();
  
    },
    //路径切割处理方法
    dealrooturl:function(str){
      var root = app.globalData.rooturl;
      var subroot = root.substring(0, root.indexOf("/app/index.php"));
      return subroot;
    }
})
