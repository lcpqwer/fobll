// pages/my-active.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        activeList: null,
        userIdent: getApp().globalData.userIdent,
        page: 1,
        state: "More"
    },
    toDetail(e) {
        // let self = this
        // let index = e.currentTarget.dataset.index
        // let json = JSON.stringify(self.data.activeList[index])
        wx.navigateTo({
            url: "/pages/activity-detail/activity-detail?Id=" + e.currentTarget.dataset.id,
        })
    },
    /**
     * 获取我的活动
     * @method getActive
     */
    getActive() {
        var _this = this
        // console.log(options,this.data.info[0].time.split(' '))
        let page = _this.data.page
        let data = {
            page: page,
            openid: getApp().globalData.openid
        }
        _this.setData({
            state: 'Loading'
        })
        Request.Ajax(Url.myActive(), data, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                if (res.data.length>0){
                    let state = 'More'
                    if (res.data.length < 15){
                        state = 'noMore'
                    }
                    if (page == 1){
                        _this.setData({
                            activeList: res.data,
                            page: page + 1,
                            state: state
                        })
                    }else {
                        _this.setData({
                            activeList: _this.data.activeList.concat(res.data),
                            page: page +1,
                            state: state
                        })
                    }
                    
                }else {
                    _this.setData({
                        state: 'noMore'
                    })
                }
            } else if (res.code == 400 && res.msg == '用户不存在') {
                _this.setData({
                    activeList: [],
                    state: 'noMore'
                })
            }else {
                _this.setData({
                    state: 'Error'
                })
            }
        }).catch(res => {
            _this.setData({
                state: 'Error'
            })
            // _this.load.hide()
            // _this.marked.show()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        let _this = this
        if (_this.data.state!= 'Loading' || _this.data.state != 'noMore'){
            this.getActive()
        }
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
        let _this = this
        if (_this.data.state != 'Loading' || _this.data.state != 'noMore') {
            this.getActive()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})