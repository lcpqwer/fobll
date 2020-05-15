// pages/active/active.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: app.globalData.rootUrl,
        // ======================================
        activeList: [],
        previousMargin: '60px', //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
        nextMargin: '60px', //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
        circular: true, //是否采用衔接滑动
        currentSwiperIndex: 0, //swiper当前索引
        sginup: true,
        load: false
    },
    showImg(e) {

    },

    swiperBindchange(e) {
        // console.log(e.detail.current)
        this.setData({
            currentSwiperIndex: e.detail.current,
            // sginup: this.data.activeList[e.detail.current].sginup
        })
    },
    sginUp() {
        console.log(this.data.activeList[this.data.currentSwiperIndex], 111)
        // let json = JSON.stringify(this.data.activeList[this.data.currentSwiperIndex])
        wx.setStorage({
            data: this.data.activeList[this.data.currentSwiperIndex],
            key: 'sginUpMsg',
            success: function() {
                wx.navigateTo({
                    url: "/pages/sgin-up/sgin-up",
                })
            }
        })


    },
    toActive(e) {
        let self = this
        // console.log(e)
        // let index = e.currentTarget.dataset.id;
        // console.log(index)
        // if (index === self.data.currentSwiperIndex) {
        // let json = JSON.stringify(self.data.activeList[index])
        wx.navigateTo({
            url: "/pages/activity-detail/activity-detail?Id=" + e.currentTarget.dataset.id,
        })
        // } else {
        //     self.setData({
        //         currentSwiperIndex: index
        //     })
        // }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        let userIdent = getApp().globalData.userIdent
        if (userIdent != 1 || this.data.load) {
            return
        }
        var _this = this
        // console.log(options,this.data.info[0].time.split(' '))
        let data = {
            // page: '1',
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.getPartyShow(), data, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    activeList: res.data,
                    load: true
                })
            } else {
                if (res.msg) {
                    let marked = {
                        mode: 'error',
                        msg: res.msg
                    }
                    // _this.marked.show(marked)
                } else {
                    // _this.marked.show()
                }

            }
        }).catch(res => {
            // _this.load.hide()
            // _this.marked.show()
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let _this = this
        _this.userTop = _this.selectComponent('#userTop')
        _this.onLoad()
        _this.userTop.init()
        // if (app.globalData.userIdent == -1) {
        app.wxAuthCallback = () => {
            _this.userTop.init()
        }
        // }
        let userIdent = getApp().globalData.userIdent
        if (userIdent == -1) {
            wx.showModal({
                title: '提示',
                content: '您还没有登录，请先登录',
                success: function(res) {
                    console.log(res)
                    if (res.confirm){
                        wx.switchTab({
                            url: '/pages/user/user',
                        })
                    }else {
                        wx.switchTab({
                            url: getApp().globalData.page,
                        })
                    }
                },
                fail: function(res) {},
                complete: function(res) {},
            })
        }
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