// pages/speak-result/speak-result.js
const app = getApp()
const api = require('../../api.js')
const ctx = wx.createCanvasContext('shareCanvas');
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    save: true,
    src: 'https://pj.dede1.com/attachment/tonghuagushi/share_bg.png',
    qrcode: '',
    shareafterqrcode:'',
    gsid:0,
    gushipic:'',//故事图片
    headerimg:'',
    pwidth:0,
    pheight:0,
    shareimg: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.gsid);
    this.setData({
      gsid: options.gsid
    });
    this.afterqrcode();
    let that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          pheight: res.windowHeight,
          pwidth: res.windowWidth
        })
        }
        
       
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    let getgid = that.data.gsid;
    return {
      title: '我在织布熊故事讲了个故事',
      path: '/pages/story-detail/story-detail?id=' + getgid + '&shoucangstatus=' + false,
      imageUrl: this.data.shareimg,
      success(e) {
        console.log('分享成功=' + getgid);
      }, fail(e) {
        console.log('分享失败');
      }
    }
  },

  set_mask: function () {
      let save = false
      this.setData({
          mask: !this.data.mask,
          save: false
      })
  },

  //分享到朋友圈
  tap_btn2: function (event) {
    console.log('点击了分享朋友圈');
      this.set_mask() 
      wx.showLoading({
        title: '正在生成画报...',
        //mask:true//屏蔽其他点击事件
      })
      this.getqrcode();
  },

  tap_maskbtn: function (event) {
    var that=this;
    //保存图片
    wx.canvasToTempFilePath({
      x: (that.data.pwidth - 215) / 2,
      y: 0,
      width: 214,
      height: 400,
      canvasId: 'shareCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(e) {
            console.log(e);
            that.setData({
              save: true
            })
          }
        })
      }
    })
     
       
  },
  //获取故事和用户信息
  getuserinfo: function () {
    var that = this;
    app.request({
      url: api.story.getstoryone,
      data: {
        u_id: wx.getStorageSync('u_id'),
        gushiid:that.data.gsid   
      },
      success: (e) => {
        console.log(e);
        if (e.status == 1) {
          that.setData({
            gushipic: e.imgs[0],
            headerimg: e.result.headerimg
          })
           //第一步 底图
          wx.getImageInfo({
            src: that.data.src,
            success: function (res) {
              console.log('第一步画底图开始');
              console.log(res);
              ctx.beginPath()
              ctx.drawImage(res.path, (that.data.pwidth-215)/2, 0, 215, 400)
               //第二步绘制故事图片
              that.setgushipic();
              // 作者名称
              ctx.setTextAlign('center')
              ctx.setFillStyle('#FCF0DB')
              ctx.setFontSize(14)
              ctx.fillText(e.result.nickname, (that.data.pwidth - 215) /2+100, 50)
              //分割线
              //线条的端点样式:butt
              ctx.setLineCap('butt');
              ctx.setLineWidth(1);
              ctx.moveTo((that.data.pwidth - 215) /2+8, 80);
              ctx.lineTo(that.data.pwidth/2+100, 80);
              ctx.setStrokeStyle("#FBD89C")//画笔颜色
              ctx.stroke();
              //描述
              ctx.setTextAlign('center')
              ctx.setFillStyle('#FBD89C')
              ctx.setFontSize(10)
              ctx.fillText('刚刚我的宝贝根据自己的画创作了一个童', (that.data.pwidth - 215) /2+100, 100)
              ctx.fillText('话故事，快来听听宝贝绘声绘色的演播吧！', (that.data.pwidth - 215) /2+102, 120)
              // 故事名称
              ctx.setTextAlign('center')
              ctx.setFillStyle('#FFF9E4')
              ctx.setFontSize(13)
              ctx.fillText(e.result.title, (that.data.pwidth - 215) /2+60, 265)
              // 日期
              ctx.setTextAlign('center')
              ctx.setFillStyle('#FFF9E4')
              ctx.setFontSize(11)
              ctx.fillText(e.addtime, (that.data.pwidth - 215) /2+170, 265)
              // 扫码收听我的故事
              ctx.setTextAlign('center')
              ctx.setFillStyle('#FFF9E4')
              ctx.setFontSize(13)
              ctx.fillText("扫码收听我的故事", (that.data.pwidth - 215) /2+110, 375)
            },
            fail: function (fae) {
              console.log('第一步画底图的错误信息' + fae);
            }
          })
          console.log('头像地址：' + e.result.headerimg);
          console.log(e.result.headerimg)
        }
      }
    })
  },
  setgushipic:function(){
    let that =this;
    wx.getImageInfo({
      src: that.data.gushipic,
      success: function (res) {
        console.log('第二步开始画故事图片');        
        console.log(res.path);
        console.log('背景位置：' + ((that.data.pwidth - 215) / 2 + 10));
        ctx.drawImage(res.path, (that.data.pwidth - 215) /2+10, 128, 195, 120)
        ctx.save();
        ctx.restore();
        ctx.stroke();
        //第三步，画头像
        that.setheaderimg();

      },
      fail:function(fae){
        console.log('第二步开始故事图片的错误信息'+fae);
      }
    })
  },
  //头像
  setheaderimg: function () {
    let that=this;
    wx.getImageInfo({
      src: that.data.headerimg,
      success: function (res) {
        console.log('第三步开始画头像');   
        console.log(res.path);
        ctx.drawImage(res.path, (that.data.pwidth - 215) /2+10, 15, 60, 60)
        ctx.save();
        ctx.restore();
        ctx.stroke();
        //第四部画二维码
        that.drawgushiqrcode();
      },
       fail: function (fae) {
         console.log('第三步画头像的错误信息' + fae);
      }
    })
  },

  //绘制二维码，最后一步
  drawgushiqrcode:function(){
    let that = this;
    //二维码图片
    wx.getImageInfo({
      src: that.data.qrcode,
      success: function (res) {
        console.log('画图最后一步');
        console.log(res.path);
        //console.log('小程序二维码位置：' + ((that.data.pwidth - 215) / 2 + 65));
        ctx.drawImage(res.path, (that.data.pwidth - 215) / 2 + 65, 280, 80, 80)
        ctx.save();
        ctx.restore();
        ctx.stroke();
        ctx.draw(false,function(e){
          console.log('绘制完毕'+e);
          wx.hideLoading();
          wx.hideNavigationBarLoading()
        })
      },
      fail: function (fae) {
        console.log('画图最后一步二维码错误信息' + fae);
      }
    })
  },

  //获取二维码
  getqrcode: function () {
    var that=this;
    app.request({
      url: api.story.getqrcode,
      data: {
        u_id: wx.getStorageSync('u_id'),
        gsid: that.data.gsid
      
      },
      success: (res) => {
        console.log('二维码信息');
        console.log(res);
        if (res.img !='') {
          that.setData({
            qrcode: res.img
          });
          that.getuserinfo()
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  //获取分享后的二维码
  afterqrcode:function(){
    var that=this;
    app.request({
      url: api.story.getafterqrcode,
      success: (res) => {
        console.log('分享后的二维码信息');
        console.log(res);
        if (res.status==1) {
          that.setData({
            shareafterqrcode: res.data[0].qrcode
          });
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  onShow:function(){
    var that = this;
    app.request({
      url: api.story.getstoryone,
      data: {
        u_id: wx.getStorageSync('u_id'),
        gushiid: that.data.gsid
      },
      success: (res) => {
        if (res.status == 1) {
          that.setData({
            shareimg: res.imgs[0]
          });
        }
      }
    })
  }

})