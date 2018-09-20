const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        name: '',
        avatar: ''
    },

    onLoad: function (options) {

    },

    onShow: function (event) {
        if (wx.getStorageSync('u_id')) {
            this.setData({
                name: wx.getStorageSync('nickname'),
                avatar: wx.getStorageSync('userheaderimg')
            })
        }  
    },

    onShareAppMessage: function () {
    
    },

    tap_item: function (event) {
        if (!wx.getStorageSync('u_id')) {
            wx.navigateTo({
                url: '/pages/login/login'
            })
        } else {
            let page = ''
            switch (Number(event.currentTarget.dataset.id)) {
                case 1:
                    page = 'my-story'
                    break
                case 2:
                    page = 'my-history'
                    break
                case 3:
                    page = 'my-collect'
                    break
                case 4:
                    page = 'my-message'
                    break
                case 5:
                    page = 'my-info'
                    break
                case 6:
                    page = 'feedback'
                    break 
                case 7:
                    page = 'my-read'
                    break 
            }
            wx.navigateTo({
                url: `/pages/${page}/${page}`,
            })
        }
    }

})