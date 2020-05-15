// components/user-top/user-top.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        color: {
            type: String,
            value: '#484848'
        },
        center: {
            type: String,
            value: ''
        },
        flag: {
            type: Boolean,
            value: true
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        userIdent: getApp().globalData.userIdent,
        company: getApp().globalData.company,
        hasUserInfo: getApp().globalData.hasUserInfo,
        rootUrl: getApp().globalData.rootUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        detail() {
            if (this.data.flag) {
                wx.navigateTo({
                    url: "/pages/fee-detail/fee-detail"
                })
            }
        },
        init(){
            console.log(getApp().globalData.userIdent)
            this.setData({
                userIdent: getApp().globalData.userIdent,
                company: getApp().globalData.company,
                hasUserInfo: getApp().globalData.hasUserInfo
            })
        },
        toUser(){
            wx.switchTab({
                url: '/pages/user/user',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
        }
    }
})