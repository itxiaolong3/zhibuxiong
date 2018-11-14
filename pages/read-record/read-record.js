const app = getApp()
const api = require('../../api.js')
const recorderManager = wx.getRecorderManager()
const bgplay = wx.getBackgroundAudioManager()
const innerAudioContext = wx.createInnerAudioContext()
let interval

Page({

    data: {
      load: false,
        id: 0,
        u_id: '',
        name: '',
        avatar: '',
        gushi: '',
        contents:'',
        record_path: '',
        record_state: false,
        minute: 0,
        second: 0,
        zjid:0,
        switched: false,
        // speak_data: {},
        nowopen:false//是否选择了直接播放
    },

    onLoad: function (options) {
        wx.showLoading({
          title: '正在拼命加载',
        })
        let u_id = wx.getStorageSync('u_id')
        let name = wx.getStorageSync('nickname')
        let avatar = wx.getStorageSync('userheaderimg')
        this.setData({
            u_id: u_id,
            name: name,
            avatar: avatar,
            zjid:options.zjid ? options.zjid : 0
            // speak_data: app.globalData.speak_data
        })
        /*
        console.log(app.globalData.speak_data.bjurl);
        // bgplay.onEnded(function(){
        //   console.log('背景播放完毕了');
        //   bgplay.title = '背景试听'
        //   bgplay.epname = '童话故事'
        //   bgplay.src = app.globalData.speak_data.bjurl
        // })
        innerAudioContext.onEnded(function(){
          console.log('背景播放完毕了');
          innerAudioContext.autoplay=true;
          innerAudioContext.src = app.globalData.speak_data.bjurl
        })
        innerAudioContext.onCanplay(function () {
          console.log('背景音乐的长度' + innerAudioContext.duration)
        })
        */
      innerAudioContext.onEnded(function () {
        console.log('背景播放完毕了');
        innerAudioContext.autoplay = true;
        innerAudioContext.src = this.data.bjurl
      })
    // wx.showNavigationBarLoading()
     this.setData({
       id: options.id 
     })
    //this.getad(1)
    this.get_detail()
    },

    onShareAppMessage: function () {
    
    },

  escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
//   getad:function(id){
//     let that=this;
//     app.request({
//       url: api.index.getad,
//       data:{
//         id:id
//       },
//       success: (ret) => {
//         console.log(ret);
//         if (ret.status == 1) {
//           this.setData({
//             title: ret.data.title,
//             author: 'XXX',
//             contents: that.escape2Html(ret.data.contents)
//           })
//           wx.hideNavigationBarLoading()
//         }
//       }
//     })
//   },

  get_detail: function (id) {
    let that = this;
    app.request({
      url: api.read.getstoryone,
      data: {
        p_id: this.data.id
      },
      success: (ret) => {
        console.log(ret)
        if (ret.status == 1) {
          setTimeout(() => {
          let contents = that.escape2Html(ret.result.p_content)
            that.setData({
              gushi: ret.result,
              contents: contents,
              load: true
            });
            wx.hideLoading()
          }, 500);
          // wx.hideNavigationBarLoading()
        }
      }
    })

  },

  tap_switchitem: function (event) {
      let id = event.currentTarget.dataset.id
      console.log(id)
      if(id==0){
        wx.showToast({
          title: '戴耳机讲故事是不会录入背景音乐的哦~',
          icon: 'none'
        }) 
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/music/music',
          })
        },1000)
      }else{
        this.startrecord();
        this.setData({
          switched: false,
          nowopen:true
        })
      } 
       
  },
  //开始录音的方法
  startrecord:function(){
    //开始录音
    if (this.data.minute == 10) {
         innerAudioContext.stop();
      this.setData({
        record_state: !this.data.record_state
      })
      wx.showToast({
        title: '录音不能超过10分钟',
        icon: 'none'
      })
      return
    }
    if (!this.data.record_state) {
      if (this.data.minute == 0 && this.data.second == 0) {
        this.record_start()
      } else {
        recorderManager.resume()
        if (this.data.bjurl){
          innerAudioContext.play();
        innerAudioContext.src = this.data.bjurl
        }

      }
      let timer = () => {
        if (this.data.minute != 10) {
          if (this.data.second == 59) {
            this.setData({
              second: 0,
              minute: this.data.minute + 1
            })
          } else {
            this.setData({
              second: this.data.second + 1
            })
          }
        } else {
          this.record_stop()
          innerAudioContext.stop();
          wx.showToast({
            title: '录音不能超过10分钟',
            icon: 'none'
          })
          this.setData({
            record_state: !this.data.record_state
          })
        }
      }
      interval = setInterval(timer, 1000)
    } else {
      clearInterval(interval)
      recorderManager.pause()
       innerAudioContext.pause();
    }
    this.setData({
      record_state: !this.data.record_state
    })
  },
    tap_record: function (event) {
      if (this.data.nowopen || this.data.bjurl){
          this.startrecord();
          this.setData({
            switched: false
          })
        }else{
          this.setData({
            switched: true
          })  
        }
    },

    tap_reset: function (event) {
        if (this.data.record_state) {
            wx.showToast({
                title: '请先暂停录音再进行重录',
                icon: 'none'
            })
            return
        } else if (this.data.minute == 0 && this.data.second == 0) {
            wx.showToast({
                title: '已清空录音',
                icon: 'none'
            })
            return
        } else {
            wx.showModal({
                title: '提示',
                content: '确定要重录吗？',
                success: (res) => {
                    if (res.confirm) {
                        clearInterval(interval)
                        recorderManager.stop()
                      innerAudioContext.stop();
                        this.setData({
                            second: 0,
                            minute: 0,
                            record_state: false,
                            record_path: ''
                        })
                    } 
                }
            })
        }
    },

    tap_submit: function (event) {
      let that=this;
        if (this.data.record_state) {
            wx.showToast({
                title: '请先暂停录音再进行发布',
                icon: 'none'
            })
            return
        } 
        else if (this.data.minute==0 && this.data.second <= 30) {
            wx.showToast({
                title: '录音时长不能小于30秒',
                icon: 'none'
            })
            return
        }
         else {
            wx.showModal({
                title: '提示',
                content: '确定要发布吗？',
                success: (res) => {
                    if (res.confirm) {
                        this.record_stop()
                        wx.showLoading({
                            title: '正在发布',
                            mask: true
                        })
                        setTimeout(() => {
                            wx.uploadFile({
                                url: api.speak.uploadaudio,
                                filePath: this.data.record_path,
                                name: 'file',
                                success: (res) => {
                                    let record_url = JSON.parse(res.data).luyinpath
                                    let minute = this.data.minute
                                    let second = this.data.second
                                    let record_time = `${minute < 10 ? '0' + minute : minute}.${second < 10 ? '0' + second : second}`
                                    
                                    app.request({
                                        url: api.read.uploadgushi,
                                        data: {
                                            b_id: this.data.u_id,
                                            gsid: this.data.id,
                                            r_yuyinurl: record_url,
                                            zjid:this.data.zjid
                                            // b_id: this.data.u_id,
                                            // title: this.data.speak_data.name,
                                            // storyimg: this.data.speak_data.imgs,
                                            // languages: this.data.speak_data.language,
                                            // isprivate: this.data.speak_data.isprivate,
                                            // yuyinurl: record_url,
                                            // playlong: record_time
                                        },
                                        success: function (res) {
                                          //清空当次发布故事的图片
                                        //   app.globalData.speak_data.imgs=[]
                                        //   app.globalData.speak_data.bjurl=''
                                            console.log(res)
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '发布成功',
                                                mask: true
                                            })
                                            // setTimeout(() => {
                                            //     wx.navigateBack()
                                            // }, 2000)
                                            
                                            if (res.status == 1) {
                                              let zjid=that.data.zjid;
                                              if(zjid>0){
                                                wx.redirectTo({
                                                  url: '../speak-success/speak-success?gsid=' + res.newid + '&pid=' + that.data.id
                                                })
                                              }else{
                                                wx.redirectTo({
                                                  url: '../speak-success/speak-success?gsid=' + res.newid + '&pid=' + that.data.id
                                                })
                                              }
                                               
                                            } else {
                                                wx.showToast({
                                                    title: '发布失败,请重新授权登录',
                                                    icon: 'none'
                                                })
                                                setTimeout(function(){
                                                  wx.clearStorageSync('u_id');
                                                  wx.clearStorageSync('nickname');
                                                  wx.clearStorageSync('userheaderimg');
                                                  wx.navigateTo({
                                                    url: '/pages/login/login'
                                                  })
                                                },1000)
                                            }
                                        }
                                    })

                                },
                                fail: (err) => {
                                    console.log(err)
                                }
                            })
                        }, 300)
                    } 
                }
            })
        }
    },

    record_start: function (event) {
        const options = {
            duration: 600000, 
            sampleRate: 16000, 
            numberOfChannels: 1, 
            encodeBitRate: 96000, 
            format: 'mp3', 
            frameSize: 50, 
        }
        recorderManager.start(options)
        if (this.data.bjurl){
          //开始播放背景音乐
          innerAudioContext.autoplay = true
          innerAudioContext.src = this.data.bjurl
        }else{
          console.log('背景音乐为空');
        }
        

    },

    record_stop: function (event) {
        clearInterval(interval)
        recorderManager.stop()
        //停止背景音乐
         innerAudioContext.stop();
        recorderManager.onStop((res) => {
            this.setData({
                record_path: res.tempFilePath
            })
        })
    },
  onShow: function () {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    console.log('阅读故事中的背景音乐链接'+currPage.data.bgmusicurl);
    console.log(currPage.data.title);
    if (currPage.data.title) {
      this.setData({
        bjtitle: currPage.data.title,
        bjurl: currPage.data.bgmusicurl,
        switched: false
      })
    }
  },        
    
})
