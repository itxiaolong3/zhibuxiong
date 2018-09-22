// pages/story-detail/story-detail.js
const app = getApp()
const api = require('../../api.js')
const bgAudioManager = wx.getBackgroundAudioManager()
//const bgAudioManager =wx.createInnerAudioContext()
const bgplay = wx.createInnerAudioContext()
//let interval
Page({

  /**
   * 页面的初始数据,当前进度，点进来能有对于的进度条和时间。但其他故事进来时得判断。这些只是在播放状态进来的。
   */
  data: {
    
    mask: false,
    comment: '',
    gushi: [],
    imgs: [],
    gsid: '',
    shoucangstatus: '',
    gushicount: '',
    //播放内容
    thisplaystatus:false,
    curmin: 0,
    cursecond: 0,
    initmin:0,//初始化分钟
    initsecond:0,//初始化秒种
    //isfristplay: 0, //是否第一次播放
    duration: 0, //音频的总时长
    changeduration: 0, //即时改变的时长

    isgood: false, //是否点过赞
    list_state: false,
    list_data: [],
    persongushilist: [], //个人故事列表
    //评论所需内容
    gsuid:0,
    nickname:'',
    headerimg:'',
    pinlunlist:[],
    pluid:0,//被评论的用户id,0表示故事
    pianstatus:'',
    swiper:[],

    rid: 0,
    pid: 0,
    gushi: '',
    contents: '',
    music: '',
    played: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that=this;
    wx.showNavigationBarLoading()
    var scene = decodeURIComponent(options.scene);
    if (scene == '' || scene == 'undefined') {
      console.log('还没获得分享参数' + options.rid);
      that.setData({
        rid: options.rid,
        pid: options.pid,
      })
    } else {
      var arr = scene.split(',');
      that.setData({
        rid: arr[0],
        pid: arr[1],
      })
      console.log(arr);
      console.log(arr[0]);
      console.log('获得分享参数' +scene);
    }
   
    that.get_swiper()
    that.get_detail()
    let isgood = wx.getStorageSync('good' + options.rid);
    if(isgood==''){
      isgood=false;
    }
    this.setData({
      isgood:isgood?isgood:false
    })
      //结束
      bgplay.onEnded(function () {
        console.log('自动播放完毕了');
        //结束播放
        bgplay.stop();
        that.setData({
          played: false
        })
      })
  
   
   /* console.log('当前的app的curplaygsid' + app.globalData.curplaygsid);
    console.log('当前的gsid' + options.id);
    this.getshen();
    if (app.globalData.curplaygsid == options.id){
      console.log('相等');
      console.log('进来的总长度' + app.globalData.duration);
      console.log('进来的当前总' + this.data.duration);
      console.log('当前的进度条长度：' + app.globalData.changeduration);
      // this.setData({
      //   duration: app.globalData.duration,
      // })
      if (app.globalData.playstatus){
        this.setData({
          curmin: app.globalData.min,
          cursecond: app.globalData.second,
          thisplaystatus: true,
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
            changeduration: app.globalData.changeduration
          })
         
        }, 1000)
      }
      
    }else{
      console.log('不相等');
    }
    wx.showNavigationBarLoading()
    console.log(options);
    console.log(options.scene);
    let isgood = wx.getStorageSync('good' + options.id);
    if(isgood==''){
      isgood=false;
    }
    console.log('当前点赞值'+isgood);
    if (options.scene>0) {
      console.log('收藏标志为空,扫码进入单一小程序');
      var scene = decodeURIComponent(options.scene);
      this.setData({
        gsid: scene,
        shoucangstatus: 'false'
      })
    } else {
      console.log('s')
      this.setData({
        gsid: options.id,
        shoucangstatus: options.shoucangstatus,
        isgood:isgood?isgood:false
      })
      console.log('得到的故事id='+options.id)
    }

    this.getgushi();
    let that = this;
    this.wxzxSlider6 = this.selectComponent("#wxzxSlider6");
     //手机上不支持这些方法
    // wx.onBackgroundAudioPlay(function(){
    //   console.log('音频播放事件');
    // })
   
    wx.onBackgroundAudioPause(function(){
      console.log('音频暂停事件');
      bgAudioManager.pause();
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      app.globalData.playstatus = false
      that.setData({
        thisplaystatus: false
      })
    });
    wx.onBackgroundAudioStop(function(){
      console.log('音频停止事件');
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      //初始化所有参数
      app.initdata();
      that.setData({
        thisplaystatus: app.globalData.playstatus,
        changeduration: 0
      })
    });
    //为了兼容手机上的方法
    bgAudioManager.onPlay(function(){
      console.log('手机上的播放事件');
      console.log('当前的进度长度' + app.globalData.changeduration);
    })
    //暂停
    // bgAudioManager.pause(function(){
     
    // })
    bgAudioManager.onStop(function(){
      app.initdata();
    })
   */

  },

  escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
  // getad:function(id){
  //   let that=this;
  //   app.request({
  //     url: api.index.getad,
  //     data:{
  //       id:id
  //     },
  //     success: (ret) => {
  //       console.log(ret);
  //       if (ret.status == 1) {
  //         this.setData({
  //           title: ret.data.title,
  //           author: 'XXX',
  //           contents: that.escape2Html(ret.data.contents)
  //         })
  //       wx.setNavigationBarTitle({
  //         title: ret.data.title
  //       })
  //         wx.hideNavigationBarLoading()
  //       }
  //     }
  //   })
  // },
  get_detail: function () {
    let that = this;
    app.request({
      url: api.read.getaudioone,
      data: {
        r_id: this.data.rid,
        p_id: this.data.pid
      },
      success: (ret) => {
        console.log(ret)
        
        if (ret.status == 1) {
          let contents = that.escape2Html(ret.result.p_content)
          that.setData({
            gushi: ret.result,
            contents: contents,
            music: ret.thisreadgushi,
            gsuid: this.data.rid
          });

          //自动播放
          bgplay.src = this.data.music.r_yuyinurl
          bgplay.play()
          //获取评论
          that.getpinlun();
          that.savalistenhistory();//保存收听历史
          wx.setNavigationBarTitle({
            title: ret.result.p_title
          })

          wx.hideNavigationBarLoading()
        }

      }
    })

  },

    tap_play: function (event) {
        let played = this.data.played
        if (played){ 
            bgplay.pause()
        }else{
          bgplay.src = this.data.music.r_yuyinurl
          bgplay.play()
        }
       this.setData({
          played: !played
        })
    },
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
  play: function () {
    let that = this;
    console.log(app.globalData.playstatus + '全局--当前' + that.data.thisplaystatus);
    if (app.globalData.curplaygsid != that.data.gsid && app.globalData.playstatus) {
      that.setData({
        duration:0,
        thisplaystatus:false
      }),
      app.globalData.duration=0
      app.globalData.playstatus=false
      console.log('当前播放的不是同一故事,已全部清除');
      app.initdata()
      bgAudioManager.pause();
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      let curmin = app.globalData.min;
      let cursecond = app.globalData.second;
      console.log('暂时当前的值==' + app.globalData.min + '--' + app.globalData.second);
      app.globalData.playstatus = false;
      that.setData({
        curmin: curmin,
        cursecond: cursecond,
        thisplaystatus: app.globalData.playstatus
      })
      console.log('已经暂停');
      wx.showToast({
        title: '已停止当前正在播放的故事，请重新点击播放新的故事',
        icon: 'none'
      })
      return
    }
    console.log(app.globalData.playstatus + '全局后--当前' + that.data.thisplaystatus);
    if (app.globalData.playstatus) {
     
      //暂停
      bgAudioManager.pause();
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      let curmin = app.globalData.min;
      let cursecond = app.globalData.second;
      console.log('暂时当前的值==' + app.globalData.min + '--' + app.globalData.second);
      app.globalData.playstatus=false;
      that.setData({
        curmin: curmin,
        cursecond: cursecond,
        thisplaystatus: app.globalData.playstatus
      })
      console.log('点击暂停');
    } else {
      //开始播放
      clearInterval(app.globalData.interval)
      clearInterval(app.globalData.interval2)
      //给背景音乐设置必要的属性值
      bgAudioManager.title = that.data.gushi.title
      bgAudioManager.epname = '童话故事'
      bgAudioManager.singer = that.data.gushi.nickname
      bgAudioManager.coverImgUrl = that.data.imgs[0]
      if (that.data.gushi.yuyinurl) {
        bgAudioManager.src = that.data.gushi.yuyinurl
        setTimeout(function () {
          console.log('这个值没有吗' + bgAudioManager.duration)
          app.globalData.duration = bgAudioManager.duration;
          that.setData({
            duration: bgAudioManager.duration
          })
          console.log('onplay中的长度：' + app.globalData.duration);
        }, 800);
        bgAudioManager.onCanplay(() => {
          console.log("可以播放");
           
        })
        bgAudioManager.onError((err) => {
          console.log(err)
        })
      } else {
        wx.showLoading({
          title: '正在准备播放',
        })
      }
    
      if (app.globalData.isfristplay == 1) {
        clearInterval(app.globalData.interval)
        let time = that.data.duration;
        let initmin = Math.floor(time / 60);
        let initsecond = Math.floor(time % 60);
        app.globalData.min=initmin;
        app.globalData.second=initsecond;
        app.globalData.changeduration=0;
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
              if (app.globalData.second==0){
                clearInterval(app.globalData.interval2)
              }
              app.globalData.second = app.globalData.second - 1
             
            } else {
              if (app.globalData.second != 0) {
                app.globalData.second = app.globalData.second - 1
              }

            }
          }
          console.log('initmin='+that.data.initmin+'----initsecond='+that.data.initsecond);
          that.setData({
            curmin: app.globalData.min,
            cursecond: app.globalData.second,
            changeduration: app.globalData.changeduration
          })
          
          wx.onBackgroundAudioStop(function () {
            console.log('音频停止事件22');
            //结束播放
            bgAudioManager.stop();
            app.globalData.second=0
            clearInterval(app.globalData.interval)
            clearInterval(app.globalData.interval2)
            //初始化所有参数
            app.initdata();
            that.setData({
              thisplaystatus: app.globalData.playstatus,
              changeduration: 0,
              cursecond: 0
            })
          });
         
        }, 1000)
        //第二次播放
       // if (app.globalData.min != 0 && app.globalData.second != 0) {
        if (app.globalData.second != 0) {
          // let min = app.globalData.min;
          // let second = app.globalData.second;
          console.log("第二次播放中" + app.globalData.min + '==' + app.globalData.second);
          console.log("第二次播放中要跳到" + (that.data.initmin - app.globalData.second) + '==' + (that.data.initsecond - app.globalData.second));
          bgAudioManager.seek((that.data.initmin - app.globalData.second) * 60 + (that.data.initsecond - app.globalData.second));
           }
        if (!app.globalData.playstatus){
          app.globalData.playstatus = true;
          that.setData({
            thisplaystatus: app.globalData.playstatus
          })
        }

      } else {
        
        //第一次播放
        app.globalData.isfristplay=1
        if (app.globalData.second == 0 && app.globalData.min == 0) {
          that.setData({
            curmin: 0,
            cursecond: 0,
            changeduration: app.globalData.changeduration
          })
          wx.showLoading({
            title: '正在加载...',
          })
        }
        setTimeout(function () {
          app.globalData.curplaygsid = that.data.gsid;
          console.log("that.data.duration获取音频的长度：" + app.globalData.duration);
          //let time = Math.floor(that.data.duration);
          let time = app.globalData.duration;
          let initmin = Math.floor(time / 60);
          let initsecond = Math.floor(time % 60);
          console.log('取整后的 -分数' + initmin + '秒==' + initsecond);
          if (initmin != 0 || initsecond != 0) {
            wx.hideLoading()
          }
          that.setData({
            initmin: initmin,
            initsecond: initsecond
          });
          that.savalistenhistory();//保存收听历史
          console.log("第一次播放中" + initmin + '==' + initsecond);
        
          //这里1秒之后才赋值，有待研究
          app.globalData.min=initmin;
          app.globalData.second=initsecond;
          //执行计时器
          clearInterval(app.globalData.interval2)
            app.globalData.interval = setInterval(function () {
              app.globalData.changeduration = app.globalData.changeduration + 1
              //手机上需要加上这个
              if (app.globalData.second == 0 && app.globalData.min==0) {
                wx.showLoading({
                  title: '正在初始化',
                })
                   let time = bgAudioManager.duration;
                  app.globalData.min = Math.floor(time / 60)
                  app.globalData.second = Math.floor(time % 60)
                  that.setData({
                    initmin: app.globalData.min,
                    initsecond: app.globalData.second,
                    duration: time
                  });
                  setTimeout(function(){
                      wx.hideLoading()
                  },1500)
                  console.log('此时的分为' + app.globalData.min + '秒' + app.globalData.second);
              }else{
                wx.hideLoading();
                //////////
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
                ////////////
                that.setData({
                  curmin: app.globalData.min,
                  cursecond: app.globalData.second,
                  changeduration: app.globalData.changeduration
                })
                 wx.onBackgroundAudioStop(function(){
                    console.log('音频停止事件1111');
                    //结束播放
                    bgAudioManager.stop();
                    clearInterval(app.globalData.interval)
                    clearInterval(app.globalData.interval2)
                    //初始化所有参数
                    app.initdata();
                    that.setData({
                      thisplaystatus: app.globalData.playstatus,
                      changeduration: 0,
                      cursecond:0
                    })
                  });
               
              }
              
            }, 1000)
            //个别手机首次出现null问题
          if (that.data.initmin == 'null' || that.data.initsecond=='null'){
            let time = that.data.duration;
            let initmin = Math.floor(time / 60);
            let initsecond = Math.floor(time % 60);
            that.setData({
              curmin: initmin,
              cursecond: initsecond,
            })
         }else{
            that.setData({
              curmin: that.data.initmin,
              cursecond: that.data.initsecond,
            })
         }
          
        }, 800)
        //添加首次收听出现null的代码
        if (that.data.curmin == 'null' || that.data.cursecond=='null'){
          wx.showLoading({
            title: '首次播放请稍等',
          })
          setTimeout(function () {
            let time = that.data.duration;
            let initmin = Math.floor(time / 60);
            let initsecond = Math.floor(time % 60);
            that.setData({
              curmin: initmin,
              cursecond: initsecond,
            })
            wx.hideLoading()
          }, 1000)
        }
        app.globalData.playstatus = true;
        that.setData({
          thisplaystatus: true
        })
        console.log('点击播放时最终设置playstatus是为true吗？=' + app.globalData.playstatus)
        console.log('点击播放时最终设置当前播放状态是为true吗？=' + that.data.thisplaystatus)
      }
    }

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

  //评论
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
            gsid: that.data.rid,
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
  //Getgushipinlun
  getpinlun:function(){
    let that=this
    app.request({
      url: api.story.getgushipinlun,
      data: {
        g_id: that.data.rid,
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

  tap_arrow: function(event) {
    //个人故事列表展开
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
    console.log(this.data.music.r_goodnum);
    let gid = this.data.rid;
    let goodstatus = wx.getStorageSync('good' + gid);
    if (goodstatus) {
      //取消点赞
      app.request({
        url: api.read.dogood,
        data: {
          gsid: gid,
          goodnum: Number(this.data.music.r_goodnum) - 1
        },
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            wx.setStorageSync('good' + gid, false)
            wx.showToast({
              title: '已取赞',
              icon: 'none'
            })
            this.setData({
              isgood: false,
            });

     let that = this;
    app.request({
      url: api.read.getaudioone,
      data: {
        r_id: this.data.rid,
        p_id: this.data.pid
      },
      success: (ret) => {
        if (ret.status == 1) {
          that.setData({
            music: ret.thisreadgushi
          });
        }
      }
    })

          }
        }
      })
    } else {
      app.request({
        url: api.read.dogood,
        data: {
          gsid: gid,
          goodnum: Number(this.data.music.r_goodnum) + 1
        },
        success: (ret) => {
          console.log(ret);
          if (ret.status == 1) {
            wx.showToast({
              title: '已点赞',
              icon: 'none'
            })
            wx.setStorageSync('good' + gid, true)
            this.setData({
              isgood: true,
            });

     let that = this;
    app.request({
      url: api.read.getaudioone,
      data: {
        r_id: this.data.rid,
        p_id: this.data.pid
      },
      success: (ret) => {
        if (ret.status == 1) {
          that.setData({
            music: ret.thisreadgushi
          });
        }
      }
    })

          }
        }
      })
    }

  },
  
  //播放进度条部分
  // 点击slider时调用
  sliderTap: function(e) {
    console.log(e)
    console.log("点击进度条2");
    console.log('app的playstatus是为true吗？=' + app.globalData.playstatus)
    let getvalue = this.consoleValue(e)
    console.log("当前的状态" + app.globalData.playstatus + 'id又是=' + app.globalData.curplaygsid);
    console.log("当前局部的状态" + this.data.thisplaystatus + 'id是=' + this.data.gsid);
    if (!app.globalData.playstatus) {
      wx.showToast({
        title: '播放故事的时候才能点哦~',
        icon: 'none'
      })
    } else if (app.globalData.curplaygsid != this.data.gsid) {
      wx.showToast({
        title: '当前播放的不是这个故事',
        icon: 'none'
      })
    } else {
      this.sldeplay(getvalue);
    } 
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

  consoleValue: function(e) {
    if (e.currentTarget.id == 'wxzxSlider6') {
      return this.wxzxSlider6.properties.value;
    }
  },
  //播放方法
  sldeplay: function(getvalue) {
    let that=this;
    if (app.globalData.playstatus) {
      let oldmin = that.data.initmin;
      let oldsecond = that.data.initsecond;
      console.log("快进前的数分钟" + oldmin + "==秒" + oldsecond);
      console.log('传过来的值' + getvalue);
      console.log('总长' + that.data.duration);
      console.log('传过来的值除于60的分数' + Math.abs(Math.floor((this.data.duration - getvalue) / 60)));
      console.log('传过来的值除于60的秒数' + Math.abs(Math.floor((this.data.duration - getvalue) % 60)));
      let chamin = Math.abs(Math.floor((this.data.duration - getvalue) / 60));
      let chasecond = Math.abs(Math.floor((this.data.duration - getvalue) % 60));
      console.log("快进后的数分钟" + chamin + "==秒" + chasecond);
     
      let duration = this.data.duration;

      app.globalData.min = chamin;
      app.globalData.second = chasecond;
      app.globalData.changeduration = getvalue;
      console.log("最新的分秒" + this.data.min + "==秒" + this.data.second);
      bgAudioManager.seek(getvalue);
    }
  },

  //在故事列表中进入详细故事
  detail: function(e) {
    console.log(e.currentTarget.dataset.id);
    let gid = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/story-detail/story-detail?id=' + gid + '&shoucangstatus=false'
    })
  },
  //收听
  savalistenhistory:function(){
    //Postshouting
    let gid = this.data.rid;
    let uid=wx.getStorageSync('u_id');
    app.request({
      url: api.read.postshouting,
      data: {
        gsid: gid,
        uid: uid,
        listennum: Number(this.data.music.r_listennum)+1
      },
      success: (ret) => {
        console.log(ret);
        if (ret.status == 1) {
         console.log('已经保存收听')
        }
      }
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
  goother: function (e) {
    let getaid = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '/pages/bannerimg/bannerimg?id=' + getaid,
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
   /* this.get_swiper();
   bgAudioManager.onTimeUpdate(function(){
     //console.log('时长发生改变，总时长为'+bgAudioManager.duration)
   })*/
  },
  // onUnload:function(){
  //   var that = this;
  //   //清除计时器  即清除setInter
  //   clearInterval(that.data.interval)
  // },

  togospeak: function () {
    if (wx.getStorageSync('u_id')) {
      wx.navigateTo({
        url: `/pages/read-record/read-record?id=${this.data.pid}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
     //退出停止
    bgplay.stop()
       this.setData({
          played: false
        })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    /*let that=this;
    if (!app.globalData.playstatus) {
      console.log('onUnload看不到你了');
      bgAudioManager.stop();
      app.initdata();
    
    }*/
        //退出停止
    bgplay.stop()
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
    /*let getimg=this.data.imgs[0];
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
    }*/
  }
})