// pages/order-detail/delivery/delivery.js
import Request from '../../../utils/request.js'
import Url from '../../../utils/http.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        order: null,
        otherInfo: null,
        time: 0
    },
    /**
     * 查看物流信息
     * @method checkLog
     */
    checkLog() {
        wx.navigateTo({
            url: '/pages/logistics/logistics?com=' + this.data.order.courier_code + '&num=' + this.data.order.courier_number + '&comChina=' + this.data.order.courier_company,
        })
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
        Request.Ajax(Url.discountOrderDetail(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                let otherInfo = res.data[0]
                if (otherInfo.delivergoods_time) {
                    otherInfo.delivergoods_time = _this.dateFormat('YY-mm-dd', otherInfo.delivergoods_time)
                }
                if (otherInfo.payment_notify_time) {
                    otherInfo.payment_notify_time = _this.dateFormat('YY-mm-dd', otherInfo.payment_notify_time)
                }
                _this.setData({
                    otherInfo: res.data[0]
                })
                let order = _this.data.order
                if (order.Invalid != 1 && order.ordstatus == 1 && order.shipping_status == 1 && order.takeover != 1) {
                    let time1 = Date.parse(new Date(otherInfo.payment_notify_time.replace(/\-/g, "\/"))) / 1000
                    let time2 = Date.parse(new Date()) / 1000
                    let time = 24 * 7 * 60 * 60 - (time2 - time1)
                    _this.setData({
                        time: time
                    })
                    _this.timeInterval = setInterval(function () {
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
        app.detailPayCallback = () => {
            let order = this.data.order
            let other = this.data.otherInfo
            other.payment_type = 2
            order.ordstatus = 1
            order.shipping_status = 0
            other.payment_notify_time = this.dateFormat('YY-mm-dd', new Date())
            this.setData({
                otherInfo: other,
                order: order
            })
        }
        let json = encodeURIComponent(JSON.stringify(this.data.order))
        wx.navigateTo({
            url: '/pages/user_pay/user_pay?order=' + json
        })
    },
    /**
     * 提醒发货
     * @method remindDelivery
     */
    remindDelivery() {
        let _this = this
        if (_this.data.order.remind != 1) {
            _this.load = _this.selectComponent("#load")
            let params = {
                ordId: _this.data.order.ordid
            }
            _this.load.show()
            Request.Ajax(Url.remindOrder(), params, "POST").then(res => {
                console.log(res)
                if (res.code == 200) {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'success',
                        msg: '提醒发货成功'
                    })
                    app.remindCallback1(_this.data.order.ordid)
                    app.remindCallback2(_this.data.order.ordid)
                } else {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'success',
                        msg: '提醒发货成功'
                    })
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        }
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
            _this.timeInterval = setInterval(function () {
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