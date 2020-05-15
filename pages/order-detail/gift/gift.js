// pages/order-detail/gift/gift.js
import Request from '../../../utils/request.js'
import Url from '../../../utils/http.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        order: null,
        otherInfo: null,
        pickList: [],
        time: 0
    },
    /**
     * 获取订单详情
     * @method getDetail
     */
    getDetail(ordId) {
        let _this = this
        let params = {
            ordId: ordId
        }
        // _this.load = this.selectComponent('#load')
        _this.load.show()
        Request.Ajax(Url.giftOrderDetail(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                let otherInfo = res.data[0]
                if (otherInfo.payment_notify_time) {
                    otherInfo.payment_notify_time = _this.dateFormat('YY-mm-dd HH:MM:SS', otherInfo.payment_notify_time)
                }
                _this.setData({
                    otherInfo: res.data[0]
                })
                if (otherInfo.title) {
                    for (let i = 0; i < res.data.length; i++) {
                        let item = res.data[i]
                        res.data[i].pickup_time = _this.dateFormat('YY-mm-dd HH:MM:SS', item.pickup_time)
                    }
                    _this.setData({
                        pickList: res.data
                    })
                }
                let order = _this.data.order
                if (order.Invalid != 1 && order.ordstatus == 1 && order.checkedNum != order['SUM(ordbuynum)']) {
                    let time1 = Date.parse(new Date(otherInfo.payment_notify_time.replace(/\-/g, "\/"))) / 1000
                    let time2 = Date.parse(new Date()) / 1000
                    let time = 24 * 30 * 60 * 60 - (time2 - time1)
                    _this.setData({
                        time: time
                    })
                    _this.timeInterval = setInterval(function () {
                        // console.log(_this.data.time)
                        _this.setData({
                            time: _this.data.time - 60
                        })
                    }, 1000)
                }
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 时间格式化
     * @method dateFormat
     * @param {String} fmt 格式 'YYYY-mm-dd HH:MM'
     * @param {Date} date 日期
     */
    dateFormat(fmt, time) {
        let date = new Date(new Date(time).getTime() - 8 * 60 * 60 * 1000)
        // let date = new Date(time)
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "H+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "S+": date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        console.log(opt)
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        console.log('fmt', fmt)
        return fmt;
    },
    /**
     * 取消订单
     * @method cancelOrder
     */
    cancelOrder() {
        let _this = this
        // app.cancelOrderCallback1(_this.data.order.ordid)
        // app.cancelOrderCallback2(_this.data.order.ordid)
        // return
        let params = {
            ordid: _this.data.order.ordid,
            eid: app.globalData.company.id,
            ordtype: _this.data.order.order_type
        }
        console.log(params)
        _this.load.show()
        Request.Ajax(Url.cancelOrder(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    ['order.Invalid']: 1
                })
            } else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: '取消订单失败'
                })
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 支付订单
     * @method payOrder
     */
    payOrder() {
        let json = encodeURIComponent(JSON.stringify(this.data.order))
        wx.navigateTo({
            url: '/pages/user_pay/user_pay?order=' + json
        })
    },
    /**
     * 生成提货码
     * @method pickCode
     */
    pickCode() {
        let json = encodeURIComponent(JSON.stringify(this.data.order))
        wx.navigateTo({
            url: '/pages/pick-code/pick-code?order=' + json,
        })
    },
    /**
     * 格式化时间
     * @method formatTime
     */
    formatTime(s) {
        var h = 0;
        var m = 0;
        if (s > 60) {
            m = parseInt(s / 60);
            s = parseInt(s % 60);
            if (m > 60) {
                h = parseInt(m / 60);
                m = parseInt(m % 60);
            }
        };
        return h + '小时' + m + '分钟'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let order = JSON.parse(decodeURIComponent(options.order))
        order.ordtime = this.dateFormat('YYYY-mm-dd HH:MM:SS', order.ordtime)
        order.deductiont = (parseFloat(order.ordprice) - parseFloat(order.amount_payable)).toFixed(2)
        console.log(order)
        this.setData({
            order: order
        })
        this.getDetail(order.ordid)
        if (order.Invalid != 1 && order.ordstatus == 0) {
            let time1 = Date.parse(new Date(order.ordtime.replace(/\-/g, "\/"))) / 1000
            let time2 = Date.parse(new Date()) / 1000
            let time = 2 * 60 * 60 - (time2 - time1)
            console.log(time1)
            console.log(time2)
            console.log(time)
            let _this = this
            _this.setData({
                time: time
            })
            _this.timeInterval = setInterval(function() {
                // console.log(_this.data.time)
                _this.setData({
                    time: _this.data.time - 60
                })
            }, 60000)
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
        clearInterval(this.timeInterval)
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