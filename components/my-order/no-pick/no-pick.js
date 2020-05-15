// components/my-order/no-pick/no-pick.js
import Request from '../../../utils/request.js'
import Url from '../../../utils/http.js'
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hidden: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        orderList: null,
        page: 1,
        pageTotal: 1,
        state: 'More'
    },
    /**
     * 组件创建时运行
     */
    created(){
        // 礼包订单支付成功后回调
        app.noPickOrderCallback = order => {
            if (this.data.orderList) {
                let ls = this.data.orderList
                if (this.data.page <= this.data.pageTotal) {
                    ls.pop()
                }
                let newls = [order].concat(ls)
                this.setData({
                    orderList: newls
                })
            }
        }
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
        dateFormat(time) {
            let fmt = 'YYYY-mm-dd'
            let date = new Date(new Date(time).getTime() - 8 * 60 * 60 * 1000)
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
         * 获取分页订单
         * @method getOrders
         */
        getOrders() {
            let _this = this
            let page = _this.data.page
            let params = {
                eid: getApp().globalData.company.id,
                page: page
            }
            _this.setData({
                state: 'Loading'
            })
            Request.Ajax(Url.getNoPickOrders(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    if (res.data == ''){
                        this.setData({
                            orderList: [],
                            state: "noMore"
                        })
                    }else {
                        let ls = res.data.data
                        let state = 'More';
                        let orderList;
                        let pageTotal = Math.ceil(res.data.count / 10)
                        for (let i = 0; i < ls.length; i++) {
                            ls[i].ordtimeFormat = _this.dateFormat(ls[i].ordtime)
                        }
                        if (page == 1) {
                            orderList = ls.slice(10 * (page - 1), 10 * page)
                        } else {
                            orderList = this.data.orderList.concat(res.data.data)
                        }
                        if (page == pageTotal) {
                            state = 'noMore'
                        }
                        _this.setData({
                            state: state,
                            orderList: orderList,
                            page: page + 1,
                            pageTotal: pageTotal
                        })
                    }
                } else {
                    _this.setData({
                        page: page,
                        state: 'Error'
                    })
                }
            }).catch(res => {
                _this.setData({
                    page: page,
                    state: 'Error'
                })
            })
        },
        /**
         * 初始化
         * @method init
         */
        init() {
            let userIdent = getApp().globalData.userIdent;
            if (userIdent == 1) {
                if (this.data.page == 1) {
                    this.getOrders()
                }
            } else {
                this.setData({
                    orderList: []
                })
            }
        },
        /**
         * 滑动到底部触发
         * @method lower
         */
        lower() {
            if (this.data.state != 'Loading' && this.data.state != 'noMore') {
                this.setData({
                    state: 'Loading'
                })
                this.getOrders()
            }
        }
    }
})