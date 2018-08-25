const app = getApp()
const api = require('../../api.js')

Page({

    data: {
        title: '',
        phone: '',
        content: '' ,
        gid:0
    },

    onLoad: function (options) {
        console.log(options);
        this.setData({
          gid:options.gid
        })
    },

    onShareAppMessage: function () {
    
    },

    input_value: function (event) {
        let name = ''
        switch (Number(event.currentTarget.dataset.id)) {
            case 0:
                name = 'title'
                break
            case 1:
                name = 'phone'
                break
            case 2:
                name = 'content'
                break
        }
        this.setData({
            [name]: event.detail.value.replace(/\s+/g, '')
        })
    },

    tap_btn: function (event) {
        let u_id = wx.getStorageSync('u_id')
        let title = this.data.title
        let phone = this.data.phone
       let content = this.data.content
        let gid = this.data.gid
        if (!title || !phone || !content) {
            wx.showToast({
                title: '请把信息填写完整',
                icon: 'none'
            })
        } else {
            wx.showLoading({
                title: '正在提交',
                mask: true
            })
            app.request({
                url: api.feedback.feedback,
                data: {
                    u_id: u_id,
                    title: title,
                    phone: phone,
                    content: content,
                    gid:gid
                },
                success: (res) => {
                    if (res.status == 1) {
                        wx.showToast({
                            title: '提交成功',
                            mask: true
                        })
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 1000)
                    }
                }
            })
        }
    }

})