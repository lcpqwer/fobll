// pages/logistics/logistics.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        info: [],
        comChina: '',
        num: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        var _this = this
        // console.log(options,this.data.info[0].time.split(' '))
        let data = {
            com: options.com,
            num: options.num,
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.checkDeliveryDetail(), data, 'POST').then(res => {
            console.log(res)
            if (res.status == 200) {
                _this.setData({
                    info: res.data,
                    comChina: options.comChina,
                    num: options.num
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