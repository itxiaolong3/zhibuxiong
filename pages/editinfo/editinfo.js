const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        load: 0,
        headerimg: '',
        nickname: '',
        bsday: '',
        wechat: '',
        sex: '',
        school: '',
        sex_data: ['保密','男宝宝','女宝宝'],
        sex_state: 99,
        ishow: 0
    },

    onLoad: function (options) {
        this.get_info()
    },

    onShareAppMessage: function () {
    
    },

    tap_avatar: function (event) {
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
                        let img = JSON.parse(res.data).data.imgpath
                        this.setData({
                            headerimg: `${api.root.substr(0, api.root.indexOf('app'))}attachment/${img}`
                        })
                        wx.hideLoading()
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                })
            }
        })
    },

    tap_show: function (event) {
        let ishow = this.data.ishow
        ishow == 0 ? ishow = 1 : ishow = 0
        this.setData({
            ishow: ishow 
        })
    },

    tap_submit: function (event) {
        if (!this.data.nickname) {
            wx.showToast({
                title: '昵称不能为空',
                icon: 'none'
            })
        } else {
            wx.showLoading({
                title: '正在修改',
                mask: true
            })
            wx.setStorageSync("nickname", this.data.nickname)
            wx.setStorageSync("userheaderimg", this.data.headerimg)
            app.request({
                url: api.user.updateuserinfo,
                data: {
                    u_id: wx.getStorageSync('u_id'),
                    nickname: this.data.nickname,
                    headerimg: this.data.headerimg,
                    bsday: this.data.bsday,
                    wechat: this.data.wechat,
                    sex: this.data.sex_data[this.data.sex_state] ? this.data.sex_data[this.data.sex_state] : this.data.sex,
                    school: this.data.school,
                    ishow: this.data.ishow
                },
                success: (res) => {
                    wx.showToast({
                        title: '修改成功',
                        mask: true
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1000)
                }
            })
        }
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
                        headerimg: res.result.headerimg,
                        nickname: res.result.nickname,
                        bsday: res.result.bsday,
                        wechat: res.result.wechat,
                        sex: res.result.sex,
                        school: res.result.school,
                        ishow: res.result.ishow,
                        load: 1
                    })
                    wx.hideNavigationBarLoading()
                }
            }
        })
    },

    change_picker: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'bsday'
                break
            case 1:
                name = 'sex_state'
                break
        }
        this.setData({
            [name]: event.detail.value
        })
    },

    input_value: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'nickname'
                break
            case 1:
                name = 'wechat'
                break
            case 2:
                name = 'school'
                break
        }
        this.setData({
            [name]: event.detail.value.replace(/\s+/g, '')
        })
    }
    
})