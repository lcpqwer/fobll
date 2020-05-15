// pages/user/user.js
var app = getApp()
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: app.globalData.rootUrl,
        hasUserInfo: app.globalData.hasUserInfo,
        userInfo: null,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userIdent: app.globalData.userIdent
    },
    jump(e) {
        if (getApp().globalData.userIdent == -1){
            this.marked.show({mode: 'error', msg: "您还没有登录，请先登录"})
            return
        }
        console.log(e)
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    getOpenid(code) {
        let _this = this
        let data = {
            wx_code: code
        }
        Request.Ajax(Url.getOpenid(), data, 'POST').then(res => {
            console.log(res)
            if (res.code === 200) {
                wx.setStorage({
                    key: 'OpenId',
                    data: res.data.openid,
                })
                app.globalData.openid = res.data.openid
                let data = {
                    'open_id': app.globalData.openid,
                    'nickName': app.globalData.userInfo.nickName,
                    'avatarUrl': app.globalData.userInfo.avatarUrl
                }
                _this.auth(data)
            }

        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
            app.globalData.userInfo = null
        })
    },
    getUserInfo(e) {
        let _this = this
        _this.load.show()
        app.globalData.userInfo = e.detail.userInfo;
        if (app.globalData.openid) {
            let data = {
                'open_id': app.globalData.openid,
                'nickName': app.globalData.userInfo.nickName,
                'avatarUrl': app.globalData.userInfo.avatarUrl
            }
            _this.auth(data)

        } else {
            wx.login({
                success: res => {
                    console.log(res)
                    _this.getOpenid(res.code)
                }
            })
        }

    },
    auth(data) {
        let _this = this
        console.log(data)
        Request.Ajax(Url.auth(), data, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200) {
                app.globalData.hasUserInfo = true
                _this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: app.globalData.hasUserInfo,
                })
                if (res.msg != '个人用户') {
                    app.globalData.company = {
                        name: res.data[0]['b.name'],
                        fee: res.data[0].fee,
                        id: res.data[0]['b.id']
                    };
                    app.globalData.jwt = 'JWT ' + res.data[0].hash_auth;
                    app.globalData.userIdent = res.data[0].type
                } else {
                    app.globalData.userIdent = 0
                }
                this.userTop = this.selectComponent('#userTop')
                this.userTop.init()
                this.setData({
                    userIdent: app.globalData.userIdent
                })
            } else {
                _this.marked.show()
                app.globalData.userInfo = null
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
            app.globalData.userInfo = null
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.userTop = this.selectComponent('#userTop')
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: app.globalData.hasUserInfo,
            userIdent: getApp().globalData.userIdent
        })
        app.userInfoReadyCallback = res => {
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: getApp().globalData.hasUserInfo,
                userIdent: getApp().globalData.userIdent
            })
            this.userTop.init()
        }
        app.wxAuthCallback = () => {
            this.userTop.init()
            this.setData({
                userIdent: app.globalData.userIdent
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.marked = this.selectComponent('#marked')
        this.load = this.selectComponent('#load')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.userTop = this.selectComponent('#userTop')
        this.userTop.init()
        getApp().globalData.page = '/pages/user/user'
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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

    }
})