// pages/pick-code/pick-code.js
var Request = require('../../utils/request.js')
var Url = require('../../utils/http.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        order: null,
        code: {
            text: '',
            img: ''
        },
        save: false,
        share: false
    },
    /**
     * 获取提货码
     * @method getPickCode
     */
    getPickCode() {
        let _this = this
        let params = {
            ordid: _this.data.order.ordid
        }
        _this.load.show()
        Request.Ajax(Url.getPickCode(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                _this.setData({
                    ['code.text']: res.pickup_number,
                    ['code.img']: res.pickup_img
                })
                let order = _this.data.order
                order.pickup_number = res.pickup_number
                _this.selectComponent('#share').loading(order)
            } else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: '获取提货码失败'
                })
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })

    },
    /**
     * 复制提货码
     * @method copyCode
     */
    copyCode() {
        let _this = this
        wx.setClipboardData({
            data: _this.data.code.text
        })
    },
    /**
     * 展示canvas
     * @method showShare
     */
    showShare() {
        console.log('11111')
        this.setData({
            share: true
        })
    },
    /**
     * 隐藏canvas
     * @method hideShare
     */
    hideShare(){
        this.setData({
            share: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        // var size = this.setCanvasSize(); //动态设置画布大小 
        // this.createQrCode('{code: 1111}', "mycanvas", size.w, size.h);
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        var order = JSON.parse(decodeURIComponent(options.order))
        
        console.log(order)
        this.setData({
            order: order
        })
        this.getPickCode()
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