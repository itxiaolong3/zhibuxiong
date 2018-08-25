const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        load: 0,
        userinfo: []
    },

    onLoad: function (options) {
        
    },

    onShow: function () {
        this.get_info()
    },

    onShareAppMessage: function () {
    
    },

    get_info: function (event) {
        wx.showNavigationBarLoading()
        app.request({
            url: api.user.getuserinfo,
            data: {
                u_id: wx.getStorageSync('u_id')
            },
            success: (res) => {
                if (res.status == 1) {
                    this.setData({
                        userinfo: res.result,
                        load: 1
                    })
                    wx.hideNavigationBarLoading()
                }
            }
        })
    }

})