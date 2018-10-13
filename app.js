var api;
App({
    is_on_launch: true,
    onLaunch: function () {
        this.setApi();
        api = this.api;
    }, 
    globalData: { 
      shenstatus:0,
      rooturl: '',
        speak_data: {
          name: '',
          imgs: [],
          imgs_old: [],
          language: '',
          bjurl:'',
          isprivate: 0
        },
        interval: '',//分计时器
        interval2:'',//秒计时器
        curplaygsid:0,//当前播放故事id
        playstatus: false,//当前播放状态
        changeduration:0,//当前已播放时长
        min:0,//当前播放显示的分
        second:0,//当前播放显示的秒
        duration:0,//故事的总时长
        isfristplay: 0//是否第一次播放
    },
    request: function (object) {
        if (!object.data)
            object.data = {};
        object.data._uniacid = this.siteInfo.uniacid;
        object.data._acid = this.siteInfo.acid;
        wx.request({
            url: object.url,
            header: object.header || {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: object.data || {},
            method: object.method || "GET",
            dataType: object.dataType || "json",
            success: function (res) {
                if (res.data.code == -1) {
                   console.log("app.js中的请求成功返回code为-1");
                } else {
                    if (object.success)
                        object.success(res.data);
                }
            },
            fail: function (res) {
                var app = getApp();
                if (app.is_on_launch) {
                    app.is_on_launch = false;
                    wx.showModal({
                        title: "网络请求出错",
                        content: res.errMsg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                if (object.fail)
                                    object.fail(res);
                            }
                        }
                    });
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        image: "/images/icon-warning.png",
                    });
                    if (object.fail)
                        object.fail(res);
                }
            },
            complete: function (res) {
                if (object.complete)
                    object.complete(res);
            }
        });
    },
    api: require('api.js'),
    setApi: function () {
        var siteroot = this.siteInfo.siteroot;
        this.globalData.rooturl=siteroot;
        siteroot += '?i='+this.siteInfo.uniacid+'&c=entry&a=wxapp&m=tonghuagushi&do=';
        function getNewApiUri(api) {
            for (var i in api) {
                if (typeof api[i] === 'string') {
                    api[i] = api[i].replace('{$_api_root}', siteroot);
                } else {
                    api[i] = getNewApiUri(api[i]);
                }
            }
            return api;
        }

        this.api = getNewApiUri(this.api);
    },
    
    initdata:function(){
      this.globalData.min = 0;
      this.globalData.second = 0;
      this.globalData.playstatus = false;
      this.globalData.changeduration = 0;
      this.globalData.curplaygsid=0;
      this.globalData.duration=0;
      this.globalData.isfristplay= 0;
    },
    siteInfo: require('siteinfo.js')

})