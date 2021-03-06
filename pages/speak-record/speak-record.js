const app = getApp()
const api = require('../../api.js')
const recorderManager = wx.getRecorderManager()
const bgplay = wx.getBackgroundAudioManager()
const innerAudioContext = wx.createInnerAudioContext()
let interval

Page({

    data: {
        u_id: '',
        name: '',
        avatar: '',
        speak_data: {},
        record_state: false,
        record_path: '',
        minute: 0,
        second: 0,
        zjid:0,
        
    },

    onLoad: function (e) {
        let u_id = wx.getStorageSync('u_id')
        let name = wx.getStorageSync('nickname')
        let avatar = wx.getStorageSync('userheaderimg')
        let zjid=0;
        if (e.zjid == '' || e.zjid =='undefined'){
           zjid = 0;
        }else{
           zjid = e.zjid;
        }
        
        this.setData({
            u_id: u_id,
            name: name,
            avatar: avatar,
            speak_data: app.globalData.speak_data,
            zjid:zjid
        })
      console.log('录音里的zjid'+this.data.zjid);
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

    },

    onShareAppMessage: function () {
    
    },

    tap_record: function (event) {
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
                if (app.globalData.speak_data.bjurl){
                  innerAudioContext.play();
                 // innerAudioContext.src = app.globalData.speak_data.bjurl
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
            interval = setInterval(timer,1000)
        } else {
            clearInterval(interval)
            recorderManager.pause()
            innerAudioContext.pause();
        }
        this.setData({
            record_state: !this.data.record_state
        }) 
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
                                        url: api.speak.uploadgushi,
                                        data: {
                                            b_id: this.data.u_id,
                                            title: this.data.speak_data.name,
                                            storyimg: this.data.speak_data.imgs,
                                            languages: this.data.speak_data.language,
                                            isprivate: this.data.speak_data.isprivate,
                                            yuyinurl: record_url,
                                            playlong: record_time,
                                            zjid:this.data.zjid
                                        },
                                        success: function (res) {
                                          //清空当次发布故事的图片
                                          app.globalData.speak_data.imgs=[]
                                          app.globalData.speak_data.bjurl=''
                                            wx.hideLoading()
                                            if (res.status == 1) {
                                                wx.redirectTo({
                                                  url: '../speak-success/speak-success?gsid=' + res.newid + '&iszj='+that.data.zjid
                                                })
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
        if (app.globalData.speak_data.bjurl){
          //开始播放背景音乐
          innerAudioContext.autoplay = true
          innerAudioContext.src = app.globalData.speak_data.bjurl
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
    }
    
})
