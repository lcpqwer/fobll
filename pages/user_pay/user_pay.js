// pages/user_pay/user_pay.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        order: null,
        type: null, // 订单类型 1 => 礼包 2 => 折扣
        rootUrl: getApp().globalData.rootUrl,
        way: '1', // 支付方式
        input: false, // 是否公对公转账
        payName: '', // 付款姓名
        payAccount: '', // 付款账号
        totalPrice: 0, // 总价
        time: 2 * 60 * 60, // 剩余支付是时间
        pay: 0, // 
        clear: false, // 是否清楚timeout
    },
    /**
     * 选择付款方式
     * @method chooseWay
     * @param {Object} e 元素信息
     */
    chooseWay(e) {
        let way = e.currentTarget.dataset.way
        this.setData({
            way: way
        })
    },
    /**
     * 选择公对公账号填写信息
     * @method fillIn
     */
    fillIn() {
        this.setData({
            input: true
        })
    },
    /**
     * 输入
     * @method inputVal
     * @param {Object} e 元素信息
     */
    inputVal(e) {
        let index = e.currentTarget.dataset.index;
        console.log(e)
        let key;
        if (index == 1) {
            key = 'payName'
        } else {
            key = 'payAccount'
        }
        this.setData({
            [key]: e.detail.value
        })
    },
    /**
     * 取消账号信息填写
     * @method cancelFillIn
     */
    cancelFillIn() {
        this.setData({
            input: false
        })
    },
    /**
     * 确认支付
     * @method confirm
     */
    confirm() {
        // if (app.detailPayCallback) {
        //     app.detailPayCallback();
        //     app.detailPayCallback = null;
        // }
        // return
        let _this = this
        let params = {
            total_fee: parseFloat(_this.data.order.ordprice) * 100,
            ordId: [_this.data.order.ordid]
        }
        _this.load.show()
        Request.Ajax(Url.confirmPay(), params, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200) {
                wx.requestPayment({
                    timeStamp: res.data.timeStamp.toString(),
                    nonceStr: res.data.nonceStr,
                    package: 'prepay_id=' + res.data.prepay_id,
                    signType: 'MD5',
                    paySign: res.data.sign,
                    success: res => {
                        console.log(res)
                        // if (res.errMsg == "requestPayment:ok") {
                        // _this.payOrderCallback()
                        _this.paySuccess()
                        // }
                    },
                    fail: res => {
                        console.log('fail')
                        _this.marked.show({
                            mode: 'error',
                            msg: '支付失败'
                        })
                    }
                })
            } else {
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
    dateFormat(fmt, date) {
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
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    },
    /**
     * 支付成功回调
     * @method paySuccess
     */
    paySuccess() {
        let _this = this
        let params = {
            ordId: [_this.data.order.ordid],
            payment_notify_time: _this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
            orderType: _this.data.order.order_type,
            eid: getApp().globalData.company.id
        }
        console.log(params)
        _this.load.show()
        Request.Ajax(Url.payCallBack(), params, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200) {
                _this.marked.show({
                    msg: "支付成功",
                    mode: 'success'
                })
                _this.setData({
                    pay: 1
                })
                if (_this.callback) {
                    _this.callback()
                }
            } else {
                _this.setData({
                    pay: 2
                })
                if (_this.callback) {
                    _this.callback()
                }
                _this.marked.show({
                    mode: 'error',
                    msg: '支付失败，可联系客服进行退款'
                })
            }
        }).catch(res => {
            _this.load.hide()
        })
    },
    /**
     * 订单支付成功回调
     */
    payOrderCallback() {
        let order = this.data.order
        app.payOrderCallback(order.ordid)
        app.cancelOrderCallback2(order.ordid)
        order.ordstatus = 1
        if (this.data.order.order_type == 1) {
            order.shipping_status = 0
            app.noSendCallback(order)
        } else {
            app.noPickOrderCallback(order)
        }
        if (app.detailPayCallback) {
            app.detailPayCallback()
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let $order = JSON.parse(decodeURIComponent(options.order))
        let time1 = Date.parse(new Date($order.ordtime)) / 1000
        let time2 = Date.parse(new Date()) / 1000
        let time = 2 * 60 * 60 - (time2 - time1)
        console.log(time1)
        console.log(time2)
        console.log(time)
        this.setData({
            order: $order,
            time,
        })
        let _this = this
        _this.timeInterval = setInterval(function() {
            // console.log(_this.data.time)
            _this.setData({
                time: _this.data.time - 1
            })
        }, 1000)
        wx.getSystemInfo({
            success(res) {
                console.log(res)
                _this.setData({
                    platform: res.platform
                })
            }
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
        if (_this.data.show) {
            if (this.data.pay == 1) {
                _this.marked.show({
                    msg: '支付成功',
                    mode: 'success'
                })
                _this.payOrderCallback()
                if (_this.data.order.fee) {
                    getApp().globalData.company.fee = (parseFloat(getApp().globalData.company.fee) + parseFloat(_this.data.order.fee)).toFixed(2)
                }
                _this.timeOut = setTimeout(() => {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, 500)
            } else if (this.data.pay == 2) {
                _this.marked.show({
                    msg: '支付失败',
                    mode: 'error'
                })
            } else {
                _this.callback = () => {
                    if (this.data.pay == 1) {
                        _this.marked.show({
                            msg: '支付成功',
                            mode: 'success'
                        })
                        if (_this.data.order.fee) {
                            getApp().globalData.company.fee = (parseFloat(getApp().globalData.company.fee) + parseFloat(_this.data.order.fee)).toFixed(2)
                        }
                        _this.payOrderCallback()
                        _this.timeOut = setTimeout(() => {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }, 500)
                    } else if (this.data.pay == 2) {
                        _this.marked.show({
                            msg: '支付失败',
                            mode: 'error'
                        })
                    }
                }
            }
        } else {
            _this.setData({
                show: true
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
        clearInterval(this.timeInterval)
        clearTimeout(this.timeOut)
        this.setData({
            clear: true
        })
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