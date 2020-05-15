// pages/pick-shop/pick-shop.js
var Request = require('../../utils/request.js')
var Url = require('../../utils/http.js')
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: true,
        rootUrl: getApp().globalData.rootUrl,
        way: '1',
        error: false,
        code: '',
        choose: false,
        shopInfo: Object,
        pickBack: 'http://47.100.17.14/img/default_back.png'
    },
    /**
     * 显示输入与扫码页面
     * @method show
     */
    show() {
        this.setData({
            show: true,
            choose: false
        })
    },
    /**
     * 隐藏输入与扫码页面
     * @method hide
     */
    hide() {
        this.setData({
            show: false
        })
    },
    /**
     * 选择方式
     * @method changeWay
     */
    changeWay(e) {
        this.setData({
            way: e.currentTarget.dataset.way,
            code: ''
        })
    },
    /**
     * 输入兑换码
     * @method codeInput
     */
    codeInput(e) {
        let code = e.detail.value
        this.setData({
            code: code
        })
    },
    /**
     * 检查兑换码
     * @method codeCheck
     */
    codeCheck() {
        let _this = this
        if (_this.data.code == '') {
            _this.marked.show({
                mode: 'error',
                msg: '请输入兑换码'
            })
        } else {
            _this.getShops()
        }
    },
    
    /**
     * 获取商品
     * @method getShops
     */
    getShops() {
        let _this = this
        let params = {
            code: _this.data.code
        }
        _this.load.show()
        Request.Ajax(Url.getShops(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                let time1 = Date.parse(new Date(res.date.replace(/\-/g, "\/"))) / 1000
                let time2 = Date.parse(new Date()) / 1000
                let time = 7 * 24 * 60 * 60 - (time2 - time1)
                console.log(time1)
                console.log(time2)
                console.log(time)
                _this.setData({
                    choose: true,
                    show: false,
                    shopInfo: {
                        shopList: res.data,
                        count: res.count,
                        date: time,
                        ordid: res.ordid
                    }
                })
                _this.interval = setInterval(function(){
                    _this.setData({
                        ['shopInfo.date']: _this.data.shopInfo.date - 1
                    })
                }, 1000)
                // let shopInfo = {
                //     shopList: res.data,
                //     count: res.count,
                //     date: res.date,
                //     ordid: res.ordid
                // }
                // _this.selectComponent('#shops').init(shopInfo)
            } else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: '兑换码错误或已失效'
                })
                _this.show()
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 扫码
     * @method scanCode
     */
    scanCode() {
        let _this = this
        wx.scanCode({
            success(res) {
                console.log(res)
                _this.hide()
                _this.setData({
                    code: res.result
                })
                _this.getShops()
            }
        })
    },
    destory(){
        this.setData({
            show: true,
            code: '',
            choose: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        let _this = this
        _this.load = this.selectComponent('#load')
        _this.marked = this.selectComponent('#marked')
        if (getApp().globalData.pickBack) {
            _this.setData({
                pickBack: getApp().globalData.pickBack
            })
        } else {
            app.pickBackCallback = (img) => {
                console.log(img)
                _this.setData({
                    pickBack: img
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.shops = this.selectComponent("#shops")
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
        clearInterval(this.interval)
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