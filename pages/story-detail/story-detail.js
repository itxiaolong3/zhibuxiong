// pages/story-detail/story-detail.js
const app = getApp()
const api = require('../../api.js')
const bgAudioManager = wx.getBackgroundAudioManager()
//const bgAudioManager =wx.createInnerAudioContext()

//let interval
Page({

  /**
   * 页面的初始数据,当前进度，点进来能有对于的进度条和时间。但其他故事进来时得判断。这些只是在播放状态进来的。
   */
  data: {
    //基础内容
    mask: false,
    comment: '',
    gushi: [],
    imgs: [],
    gsid: '',
    shoucangstatus: '',
    gushicount: '',
    isgood: false, //是否点过赞
    list_state: false,
    list_data: [],
    persongushilist: [], //个人故事列表
    swiper:[],//顶部轮播图
    //评论内容
    gsuid:0,
    nickname:'',
    headerimg:'',
    pinlunlist:[],
    pluid:0,//被评论的用户id,0表示故事
    //播放内容
    thisplaystatus:false,//当前播放状态
    curmin: 0,//当前显示的分
    cursecond: 0,//当前显示的秒
    initmin:0,//初始化显示的分
    initsecond:0,//初始化显示的秒
    duration: 0, //音频的总时长
    changeduration: 0, //已播放的时长
    //isfristplay: 0, //是否第一次播放
    play_state: 2 //当前播放状态 0播放 1暂停 2停止
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    //基本
    console.log(options);
    // console.log(options.scene);
    let isgood = wx.getStorageSync('good' + options.id);
    if(isgood==''){
      isgood=false;
    }
    console.log('当前点赞值'+isgood);
    if (options.scene>0) {
      console.log('收藏标志为空,扫码进入单一小程序');
      var scene = decodeURIComponent(options.scene);
      //判断返回值是否是图文故事的id
      console.log('扫进了的参数'+scene);
      this.setData({
        gsid: scene,
        shoucangstatus: 'false'
      })
    } else {
      this.setData({
        gsid: options.id,
        shoucangstatus: options.shoucangstatus,
        isgood:isgood?isgood:false
      })
      console.log('得到的故事id='+options.id)
    }
    this.get_swiper(); 
    this.getgushi();
    //音频
    console.log('当前是否有故事在播放='+app.globalData.playstatus)
    console.log('当前播放故事的id=' + app.globalData.curplaygsid)
    console.log('点击进来的故事id=' + options.id)
    if (app.globalData.curplaygsid == options.id){
      console.log('同个故事');
      console.log('当前播放故事的总长度=' + app.globalData.duration);
      console.log('当前故事已播放时长=：' + app.globalData.changeduration);
      if (app.globalData.playstatus){
        console.log('边播放边进来')
        this.setData({
          thisplaystatus: true,
          curmin: app.globalData.min,
          cursecond: app.globalData.second,
          duration: app.globalData.duration,
          changeduration: app.globalData.changeduration
        })
        clearInterval(app.globalData.interval)
        clearInterval(app.globalData.interval2)
        app.globalData.interval2 = setInterval(function () {
          app.globalData.changeduration = app.globalData.changeduration + 1
          if (app.globalData.min != 0) {
            if (app.globalData.second <= 0) {
              app.globalData.second = 59;
              app.globalData.min = app.globalData.min - 1;
            } else {
              app.globalData.second = app.globalData.second - 1
            }
          } else {
            if (app.globalData.second <= 1) {
              app.globalData.second = app.globalData.second - 1
              clearInterval(app.globalData.interval)
            } else {
              if (app.globalData.second != 0) {
                app.globalData.second = app.globalData.second - 1
              }
            }
          }
          that.setData({
            curmin: app.globalData.min,
            cursecond: app.globalData.second,
            changeduration: app.globalData.changeduration,
            play_state: 0
          })
        }, 1000)
      } else {
        console.log('边暂停边进来')        
        this.setData({
          curmin: app.globalData.min,
          cursecond: app.globalData.second,
          duration: app.globalData.duration,
          changeduration: app.globalData.changeduration,
          play_state: 1
        })
      }
    } else {
      
    }
    //音频监听
    let that = this;
    this.wxzxSlider6 = this.selectComponent("#wxzxSlider6");
     //手机上不支持这些方法
    // wx.onBackgroundAudioPlay(function(){
    //   console.log('音频播放事件');
    // })
    // wx.onBackgroundAudioPause(function(){
    //   console.log('音频暂停事件');
    //   bgAudioManager.pause();
    //   clearInterval(app.globalData.interval)
    //   clearInterval(app.globalData.interval2)
    //   app.globalData.playstatus = false
    //   that.setData({
    //     thisplaystatus: false
    //   })
    // });
    // wx.onBackgroundAudioStop(function(){
    //   console.log('音频停止事件');
    //   clearInterval(app.globalData.interval)
    //   clearInterval(app.globalData.interval2)
    //   //初始化所有参数
    //   app.initdata();
    //   that.setData({
    //     thisplaystatus: app.globalData.playstatus,
    //     changeduration: 0
    //   })
    // });
    //播放
    bgAudioManager.onPlay(() => {
      console.log('播放');
      this.setData({
        play_state: 0
      })
    })
    //暂停
    bgAudioManager.onPause(() => {
      console.log('暂停');
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      app.globalData.playstatus = false
      that.setData({
        thisplaystatus: false,
        play_state: 1        
      })    
    })
    //停止
    bgAudioManager.onStop(() => {
      console.log('停止');
      this.audio_stop()
    })
    //结束
    bgAudioManager.onEnded(() => {
      console.log('结束');
      this.audio_stop()
    })
  },

  audio_stop: function (event) {
      //结束播放
      bgAudioManager.stop()
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      //初始化所有参数
      app.initdata();
      this.setData({
        thisplaystatus: false,
        changeduration: 0,
        curmin: 0,
        cursecond: 0,
        duration: 0,
        play_state: 2
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onUnload:function(){
    // var that = this;
    // clearInterval(that.data.interval)
    // if (!app.globalData.playstatus) {
    //   console.log('onUnload看不到你了');
    //   bgAudioManager.stop();
    //   app.initdata();
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let getimg=this.data.imgs[0];
    console.log(getimg);
    return {
      title: this.data.gushi.title,
      path: '',
      imageUrl: getimg,
      success(e) {
        console.log('分享成功');
      }, fail(e) {
        console.log('分享失败');
      }
    }
  },

  //获取轮播图
   get_swiper: function () {
    app.request({
      url: api.index.getbanner,
      data: {
        position: 0
      },
      success: (ret) => {
        if (ret.status == 1) {
          this.setData({
            swiper: ret.data,
            load: 1
          })
        }
      }
    })
  },
  //点击评论
  tap_maskbtn: function(event) {
    var that=this;
    console.log(that.data.pluid);
    let uid=wx.getStorageSync('u_id');
    let nickname = wx.getStorageSync('nickname');
    let headerimg = wx.getStorageSync('userheaderimg');
    let f_uid = 0;
    let ptype =0;
    if (that.data.pluid>0){
      //被评论的是用户
      console.log('评论的是用户');
      f_uid = that.data.pluid;
      ptype=1
     
    }else{
      //被评论的是故事
      console.log('评论的是故事');
      f_uid = that.data.gsuid;
      ptype = 0;
    }
  
    if (this.data.comment) {
      this.set_mask()
      console.log(this.data.comment);
      wx.showLoading({
        title: '提交中...',
      })
        app.request({
          url: api.story.postpinlun,
          data: {
            gsid: that.data.gsid,
            uid: uid,
            nickname: nickname,
            headerimg: headerimg,
            f_uid: f_uid,
            ptype:ptype,
            comment: that.data.comment
          },
          success: (ret) => {
            console.log(ret);
            if (ret.status) {
              that.getpinlun();
              wx.hideLoading();
              if(ptype){
                wx.showToast({
                  title: '评论用户成功',
                })
              }else{
                //评论的是故事
                wx.showToast({
                  title: '评论成功',
                })
              }
            
              that.setData({
                comment: ''
              });
            } else {
              wx.showToast({
                title: '评论失败',
                icon: 'none'
              })
            }
          }
        })
    } else {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      })
    }

  },
  //获取评论
  getpinlun:function(){
    let that=this
    app.request({
      url: api.story.getgushipinlun,
      data: {
        g_id: that.data.gsid,
        ptype:0
      },
      success: (ret) => {
        console.log(ret);
        that.setData({
         pinlunlist:ret.data 
        });
      }
    })
  },

  set_mask: function(e) {
    var that=this
    if (!wx.getStorageSync('u_id')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else{
      this.setData({
        mask: !this.data.mask
      })
      setTimeout(function () {

        if (that.data.mask) {

          if (e.currentTarget.dataset.type == 'pinlun') {
            console.log(e.currentTarget.dataset.uid);
            that.setData({
              pluid: e.currentTarget.dataset.uid
            });
          } else {
            that.setData({
              pluid: 0
            });
          }
        }
      }, 500)
     } 
  },

  input_value: function(event) {
    let name = ''
    switch (Number(event.currentTarget.dataset.id)) {
      case 0:
        name = 'comment'
        break
    }
    this.setData({
      [name]: event.detail.value.replace(/\s+/g, '')
    })
  },
  //个人故事列表展开
  tap_arrow: function(event) {
    var that = this;
    this.setData({
      list_state: !this.data.list_state
    })
    let gid = this.data.gsid;
    app.request({
      url: api.story.getpersonstory,
      data: {
        gsid: gid
      },
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
          this.setData({
            persongushilist: ret.data,
          });
          wx.hideNavigationBarLoading()
        }

      }
    })
  },
  //获取故事详情
  getgushi: function() {
    let gid = this.data.gsid;
    let that = this;
    app.request({
      url: api.story.getstoryone,
      data: {
        gushiid: gid
      },
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
          that.setData({
            gushi: ret.result,
            gsuid:ret.result.b_id,
            nickname:ret.result.nickname,
            headerimg:ret.result.headerimg,
            imgs: ret.imgs,
            gushicount: ret.count,
          });
          that.getpinlun();
          wx.setNavigationBarTitle({
            title: ret.result.title
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  //收藏
  shoucang: function() {
    let gid = this.data.gsid;
    let uid = wx.getStorageSync('u_id');
    let that = this;
    if (!wx.getStorageSync('u_id')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else{
      if (this.data.shoucangstatus == 'true') {
        console.log("已经收藏");
        //取消收藏
        app.request({
          url: api.story.changeshoucang,
          data: {
            gsid: gid,
            uid: uid,
            changtype: 0
          },
          success: (ret) => {
            console.log(ret);
            if (ret.status == 1) {
              wx.showToast({
                title: '已取消收藏',
              })
              that.setData({
                shoucangstatus: 'false',
              });
            }
          }
        })

      } else {
        console.log("未收藏");
        //添加收藏
        app.request({
          url: api.story.changeshoucang,
          data: {
            gsid: gid,
            uid: uid,
            changtype: 1
          },
          success: (ret) => {
            console.log(ret);
            if (ret.status == 1) {
              wx.showToast({
                title: '收藏成功',
              })
              that.setData({
                shoucangstatus: 'true',
              });
            } else {
              wx.showToast({
                title: '已经收藏过',
              })
              that.setData({
                shoucangstatus: 'true',
              });
            }
          }
        })

      }
    }
   
  },
  //点赞
  good: function() {
    console.log(this.data.gushi.goodnum);
    let gid = this.data.gsid;
    let goodstatus = wx.getStorageSync('good' + gid);
    if (goodstatus) {
        wx.showToast({
          title: '已取赞',
          icon: 'none',
          mask: !0,
          duration: 2000
        })
      //取赞
      app.request({
        url: api.story.dogood,
        data: {
          gsid: gid,
          goodnum: Number(this.data.gushi.goodnum) != 0 ? Number(this.data.gushi.goodnum) - 1 : 0
        },
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            wx.setStorageSync('good' + gid, false)
            this.setData({
              isgood: false,
            });
            this.getgushi();
          }
        }
      })
    } else {
      wx.showToast({
        title: '已点赞',
        icon: 'none',
        mask: !0,
        duration: 2000
      })
      //点赞
      app.request({
        url: api.story.dogood,
        data: {
          gsid: gid,
          goodnum: Number(this.data.gushi.goodnum) + 1
        },
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            wx.setStorageSync('good' + gid, true)
            this.setData({
              isgood: true,
            });
            this.getgushi();
          }
        }
      })
    }

  },
  //跳转
  godetail: function(e) {
    console.log(e.currentTarget.dataset.id);
    let gid = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/story-detail/story-detail?id=' + gid + '&shoucangstatus=false'
    })
  },

  goother: function (e) {
    let getaid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '/pages/bannerimg/bannerimg?id=' + getaid,
    })
  },

  gospeak: function () {
    console.log('点击了');
    if (wx.getStorageSync('u_id')) {
      wx.redirectTo({
        url: '/pages/speak/speak',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  //保存收听历史
  savalistenhistory:function(){
    let gid = this.data.gsid;
    let uid=wx.getStorageSync('u_id');
    app.request({
      url: api.story.postshouting,
      data: {
        gsid: gid,
        uid: uid,
        listennum: Number(this.data.gushi.listennum)+1
      },
      success: (ret) => {
        // console.log(ret);
        if (ret.status == 1) {
         console.log('已经保存收听')
        }
      }
    })
  },
  //点击播放按钮
  tap_play: function () {
    // console.log(bgAudioManager)
    let that = this;
    // console.log(app.globalData.playstatus + '全局--当前' + that.data.thisplaystatus);
    if (app.globalData.curplaygsid && app.globalData.curplaygsid != that.data.gsid) {
      console.log('正在播放其他故事时点击播放按钮');
      wx.showToast({
        title: '停止当前播放故事，点击播放新的故事',
        icon: 'none'
      })
      this.audio_stop()
      return
      // wx.showLoading({
      //     title: '开始播放新故事',
      //     mask: true
      // })
      // setTimeout(() => {
      //   this.tap_play()
      //   wx.hideLoading()
      // }, 1500)
      
      // that.setData({
      //   duration:0,
      //   thisplaystatus:false
      // }),
      // app.globalData.duration=0
      // app.globalData.playstatus=false
      // app.initdata()
      // bgAudioManager.pause();
      // clearInterval(app.globalData.interval)
      // clearInterval(app.globalData.interval2)
      // let curmin = app.globalData.min;
      // let cursecond = app.globalData.second;
      // app.globalData.playstatus = false;
      // that.setData({
      //   curmin: curmin,
      //   cursecond: cursecond,
      //   thisplaystatus: app.globalData.playstatus
      // })
      // wx.showToast({
      //   title: '已停止当前正在播放的故事，请重新点击播放新的故事',
      //   icon: 'none'
      // })
    }
    // console.log(app.globalData.playstatus + '全局后--当前' + that.data.thisplaystatus);
    if (app.globalData.playstatus) {
      //暂停播放
      console.log('点击暂停图标')
      bgAudioManager.pause();
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      let curmin = app.globalData.min;
      let cursecond = app.globalData.second;
      app.globalData.playstatus=false;
      that.setData({
        curmin: curmin,
        cursecond: cursecond,
        thisplaystatus: app.globalData.playstatus,
      })
    } else {
      console.log('点击播放图标')
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      if (this.data.play_state == 1) {
        console.log('继续播放')
        bgAudioManager.play()
      } else {
        console.log('从头播放')
        bgAudioManager.title = that.data.gushi.title
        bgAudioManager.epname = '童话故事'
        bgAudioManager.singer = that.data.gushi.nickname
        bgAudioManager.coverImgUrl = that.data.imgs[0]
        bgAudioManager.src = that.data.gushi.yuyinurl
      }
      // if (that.data.gushi.yuyinurl) {
        // bgAudioManager.title = that.data.gushi.title
        // bgAudioManager.epname = '童话故事'
        // bgAudioManager.singer = that.data.gushi.nickname
        // bgAudioManager.coverImgUrl = that.data.imgs[0]
        // bgAudioManager.src = that.data.gushi.yuyinurl
        // bgAudioManager.onCanplay(() => {
        //   console.log("可以播放");
        // })
        // bgAudioManager.onError((err) => {
        //   console.log(err)
        // })
      // } 
    
      if (app.globalData.isfristplay == 1) {
        //非第一次播放
        // clearInterval(app.globalData.interval)
        // let time = that.data.duration;
        // let initmin = Math.floor(time / 60);
        // let initsecond = Math.floor(time % 60);
        // app.globalData.min=initmin;
        // app.globalData.second=initsecond;
        // app.globalData.changeduration=0;
        app.globalData.interval2 = setInterval(function () {
          app.globalData.changeduration = app.globalData.changeduration + 1
          if (app.globalData.min != 0) {
            if (app.globalData.second <= 0) {
              app.globalData.second = 59;
              app.globalData.min = app.globalData.min - 1;
            } else {
              app.globalData.second = app.globalData.second - 1
            }
          } else {
            if (app.globalData.second <= 1) {
              app.globalData.second = app.globalData.second - 1
              if (app.globalData.second==0){
                clearInterval(app.globalData.interval2)
              }
            } else {
              if (app.globalData.second != 0) {
                app.globalData.second = app.globalData.second - 1
              }
            }
          }
          that.setData({
            curmin: app.globalData.min,
            cursecond: app.globalData.second,
            changeduration: app.globalData.changeduration
          })
          // console.log('非第一次播放正常计时时长的分='+app.globalData.min+'跟秒='+app.globalData.second)
          // wx.onBackgroundAudioStop(function () {
          //   console.log('音频停止事件22');
          //   //结束播放
          //   bgAudioManager.stop();
          //   app.globalData.second=0
          //   clearInterval(app.globalData.interval)
          //   clearInterval(app.globalData.interval2)
          //   //初始化所有参数
          //   app.initdata();
          //   that.setData({
          //     thisplaystatus: app.globalData.playstatus,
          //     changeduration: 0,
          //     cursecond: 0
          //   })
          // });
        }, 1000)
       // if (app.globalData.min != 0 && app.globalData.second != 0) {
       /* if (app.globalData.second != 0) {
          // let min = app.globalData.min;
          // let second = app.globalData.second;
          console.log("第二次播放中" + app.globalData.min + '==' + app.globalData.second);
          console.log("第二次播放中要跳到" + (that.data.initmin - app.globalData.second) + '==' + (that.data.initsecond - app.globalData.second));
          bgAudioManager.seek((that.data.initmin - app.globalData.second) * 60 + (that.data.initsecond - app.globalData.second));
        }*/
        // if (!app.globalData.playstatus){
          app.globalData.playstatus = true;
          that.setData({
            thisplaystatus: true
          })
        // }
      } else {
        //第一次播放
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        app.globalData.isfristplay=1
        // console.log('全局分='+app.globalData.min)
        // console.log('全局秒='+app.globalData.second)
        if (app.globalData.second == 0 && app.globalData.min == 0) {
          that.setData({
            curmin: 0,
            cursecond: 0,
            changeduration: 0
            // changeduration: app.globalData.changeduration
          })
        }
        setTimeout(function () {
          let dur = bgAudioManager.duration
          if (!dur) {
              console.log('第一次未获取到时长')
              dur = 0
          } 
          app.globalData.duration = dur
          app.globalData.curplaygsid = that.data.gsid
          that.setData({
            duration: dur
          })
          //let time = Math.floor(that.data.duration);
          // let time = app.globalData.duration;
          let initmin = Math.floor(dur / 60);
          let initsecond = Math.floor(dur % 60);
          console.log("开始播放获取到的音频时长=" + dur)
          console.log('取整后的分=' + initmin + '跟秒=' + initsecond);
          that.setData({
            initmin: initmin,
            initsecond: initsecond
          });
          app.globalData.min=initmin;
          app.globalData.second=initsecond;
          that.savalistenhistory();//保存收听历史
          //执行计时器
          clearInterval(app.globalData.interval2)
          app.globalData.interval = setInterval(function () {
              app.globalData.changeduration = app.globalData.changeduration + 1
              //二次判断
              if (app.globalData.second == 0 && app.globalData.min==0) {
                  let time = bgAudioManager.duration;
                  app.globalData.min = Math.floor(time / 60)
                  app.globalData.second = Math.floor(time % 60)
                  that.setData({
                    initmin: app.globalData.min,
                    initsecond: app.globalData.second,
                    duration: time
                  });
                  console.log('重新获取时长的分='+app.globalData.min+'跟秒='+app.globalData.second)
                  // setTimeout(function(){
                  //     wx.hideLoading()
                  // },1500)
                  // console.log('此时的分为' + app.globalData.min + '秒' + app.globalData.second);
              }else{
                if (app.globalData.min != 0) {
                  if (app.globalData.second <= 0) {
                    app.globalData.second = 59;
                    app.globalData.min = app.globalData.min - 1;
                  } else {
                    app.globalData.second = app.globalData.second - 1
                  }
                } else {
                  if (app.globalData.second <= 1) {
                    app.globalData.second = app.globalData.second - 1
                    if (app.globalData.second==0){
                      clearInterval(app.globalData.interval)
                    }
                   
                  } else {
                    if (app.globalData.second != 0) {
                      app.globalData.second = app.globalData.second - 1
                    }
                  }
                }
                that.setData({
                  curmin: app.globalData.min,
                  cursecond: app.globalData.second,
                  changeduration: app.globalData.changeduration
                })
                // console.log('第一次播放正常计时时长的分='+app.globalData.min+'跟秒='+app.globalData.second)
                //  wx.onBackgroundAudioStop(function(){
                //     console.log('音频停止事件1111');
                //     //结束播放
                //     bgAudioManager.stop();
                //     clearInterval(app.globalData.interval)
                //     clearInterval(app.globalData.interval2)
                //     //初始化所有参数
                //     app.initdata();
                //     that.setData({
                //       thisplaystatus: app.globalData.playstatus,
                //       changeduration: 0,
                //       cursecond:0
                //     })
                //   });
              }
            }, 1000)
            //个别手机首次出现null问题
        //   if (that.data.initmin == 'null' || that.data.initsecond=='null'){
        //     let time = that.data.duration;
        //     let initmin = Math.floor(time / 60);
        //     let initsecond = Math.floor(time % 60);
        //     that.setData({
        //       curmin: initmin,
        //       cursecond: initsecond,
        //     })
        //  }else{
        //     that.setData({
        //       curmin: that.data.initmin,
        //       cursecond: that.data.initsecond,
        //     })
        //  }
          app.globalData.playstatus = true;
          that.setData({
            thisplaystatus: true
          })
          setTimeout(() => {
            if (that.initmin != 0 || that.initsecond != 0) {
                console.log('加载完毕')
                wx.hideLoading()
            }
          }, 1500)
        }, 500)
        //添加首次收听出现null的代码
        // if (that.data.curmin == 'null' || that.data.cursecond=='null'){
        //   wx.showLoading({
        //     title: '首次播放请稍等',
        //   })
        //   setTimeout(function () {
        //     let time = that.data.duration;
        //     let initmin = Math.floor(time / 60);
        //     let initsecond = Math.floor(time % 60);
        //     that.setData({
        //       curmin: initmin,
        //       cursecond: initsecond,
        //     })
        //     wx.hideLoading()
        //   }, 1000)
        // }
        // console.log('点击播放时最终设置playstatus是为true吗？=' + app.globalData.playstatus)
        // console.log('点击播放时最终设置当前播放状态是为true吗？=' + that.data.thisplaystatus)
      }
    }

  },
  // 点击进度条
  sliderTap: function(e) {
    // console.log(e)
    // console.log("点击进度条2");
    // console.log('app的playstatus是为true吗？=' + app.globalData.playstatus)
    let getvalue = this.consoleValue(e)
    // console.log("当前的状态" + app.globalData.playstatus + 'id又是=' + app.globalData.curplaygsid);
    // console.log("当前局部的状态" + this.data.thisplaystatus + 'id是=' + this.data.gsid);
    // if (!app.globalData.playstatus) {
    //   wx.showToast({
    //     title: '播放故事的时候才能点哦~',
    //     icon: 'none'
    //   })
    // } else if (app.globalData.curplaygsid != this.data.gsid) {
    //   wx.showToast({
    //     title: '当前播放的不是这个故事',
    //     icon: 'none'
    //   })
    // } else {
      this.sldeplay(getvalue);
    // } 
    console.log('点击得到的值' + Math.floor(getvalue));
  },
  // 开始滑动时
  sliderStart: function(e) {
    console.log('开始滑动')
    let getvalue = this.consoleValue(e)
    console.log('滑动得到的值' + Math.floor(getvalue));
  },
  // 正在滑动
  sliderChange: function(e) {
    console.log(e)
    console.log('正在滑动')
    let getvalue = this.consoleValue(e)
    console.log('正在滑动得到的值' + Math.floor(getvalue));
  },
  // 滑动结束
  sliderEnd: function(e) {
    console.log(e)
    this.consoleValue(e)
    console.log('滑动结束')
    let getvalue = this.consoleValue(e)
    //播放方法
    this.sldeplay(getvalue);
    console.log('结束滑动得到的值' + Math.floor(getvalue));

  },
  // 滑动取消 （左滑时滑到上一页面或电话等情况）
  sliderCancel: function(e) {
    console.log(e)
    this.consoleValue(e)
    console.log('滑动取消')
    let getvalue = this.consoleValue(e)
    console.log('取消得到的值' + Math.floor(getvalue));
  },
  //进度条取值
  consoleValue: function(e) {
    if (e.currentTarget.id == 'wxzxSlider6') {
      return this.wxzxSlider6.properties.value;
    }
  },
  //控制进度条播放
  sldeplay: function(getvalue) {
    let that=this;
    if (app.globalData.playstatus) {
      let oldmin = that.data.initmin;
      let oldsecond = that.data.initsecond;
      console.log("快进前的分=" + oldmin + "跟秒=" + oldsecond);
      console.log('传过来的值=' + getvalue);
      console.log('音频总时长=' + that.data.duration);
      console.log('传过来的值除于60的分=' + Math.abs(Math.floor((this.data.duration - getvalue) / 60)));
      console.log('传过来的值除于60的秒=' + Math.abs(Math.floor((this.data.duration - getvalue) % 60)));
      let chamin = Math.abs(Math.floor((this.data.duration - getvalue) / 60));
      let chasecond = Math.abs(Math.floor((this.data.duration - getvalue) % 60));
      console.log("快进后的分=" + chamin + "跟秒=" + chasecond);
      let duration = this.data.duration;
      app.globalData.min = chamin;
      app.globalData.second = chasecond;
      app.globalData.changeduration = getvalue;
      bgAudioManager.seek(getvalue);
      // console.log("最新的分秒" + app.globalData.min + "==秒" + app.globalData.second);
    }
  }

})