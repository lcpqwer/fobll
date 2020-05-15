// components/my-order/order-item/order-item.js
import Request from '../../../utils/request.js'
import Url from '../../../utils/http.js'
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        order: Object,
        index: Number,
    },
    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
    },
    created() {
        // console.log(this.order)
        this.marked = this.selectComponent('#marked')
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 时间格式化
         * @method dateFormat
         * @param {String} fmt 格式 'YYYY-mm-dd HH:MM'
         * @param {Date} date 日期
         */
        dateFormat() {
            let fmt = 'YYYY-mm-dd'
            let date = new Date(this.data.order.ordtime)
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
         * 查看商品详情
         * @method toDetail
         */
        toDetail() {
            // let json = encodeURIComponent(JSON.stringify(_this.data.order))
            console.log(this.data.order)
            let json = encodeURIComponent(JSON.stringify(this.data.order))
            let url = '/pages/order-detail/gift/gift?order=' + json;
            if (this.data.order.order_type == 1) {
                url = '/pages/order-detail/delivery/delivery?order=' + json
            }
            wx.navigateTo({
                url: url,
            })
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
            _this.triggerEvent('show')
            Request.Ajax(Url.cancelOrder(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    app.cancelOrderCallback1(_this.data.order.ordid)
                    app.cancelOrderCallback2(_this.data.order.ordid)
                } else {
                    _this.triggerEvent('hide')
                    _this.marked.show({
                        mode: 'error',
                        msg: '取消订单失败'
                    })
                }
            }).catch(res => {
                _this.triggerEvent('hide')
                _this.marked.show()
            })
            // _this.triggerEvent('cancelOrder', data)
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
         * 确认收货
         * @method confirmOrder
         */
        confirmOrder(){
            let _this = this
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
                        msg: '确认收货成功'
                    })
                    app.confirmCallback1(_this.data.order.ordid)
                    app.confirmCallback2(_this.data.order.ordid)
                } else {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'error',
                        msg: '确认收货失败'
                    })
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
        /**
         * 生成提货码
         * @method pickCode
         */
        pickCode(){
            let json = encodeURIComponent(JSON.stringify(this.data.order))
            wx.navigateTo({
                url: '/pages/pick-code/pick-code?order='+json,
            })
        }
    }
})