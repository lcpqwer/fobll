// pages/pay/pay.js
var Request = require('../../utils/request.js')
var Url = require('../../utils/http.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        type: null, // 订单类型 1 => 礼包 2 => 折扣
        rootUrl: getApp().globalData.rootUrl,
        way: '1', // 支付方式
        input: false, // 是否公对公转账
        payName: '', // 付款姓名
        payAccount: '', // 付款账号
        totalPrice: 0, // 总价
        time: 2 * 60 * 60,
        success: null,
        show: false
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
        let _this = this
        let ls = []
        console.log(_this.data.orderList)
        for (let i = 0; i < _this.data.orderList.length; i++) {
            ls.push(_this.data.orderList[i].ordid)
        }
        let params = {
            total_fee: parseFloat(_this.data.totalPrice)*100,
            ordId: ls
        }
        console.log(params)
        console.log(ls)
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
                            _this.paySuucess(ls)
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
     * @method paySuucess
     */
    paySuucess(ls) {
        let _this = this
        let params = {
            ordId: ls,
            payment_notify_time: _this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
            orderType: _this.data.type == 1 ? 2 : 1, // 订单类型 1 => 礼包 2 => 折扣
            eid: getApp().globalData.company.id
        }
        console.log(params)
        _this.load.show()
        Request.Ajax(Url.payCallBack(), params, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200) {
                _this.setData({
                    success: '2'
                })
                if (_this.CallBack){
                    _this.CallBack()
                }
            } else {
               
                _this.setData({
                    success: '1'
                })
                if (_this.CallBack) {
                    _this.CallBack()
                }
            }
        }).catch(res => {
            _this.load.hide()
        })
    },
    /**
     * 回调之后判断
     * 
     */
    callbackCallback(){
        let _this = this
        let pages = getCurrentPages()
        var prePage = pages[pages.length - 2];
        switch (this.data.success) {
            case '1':
                _this.marked.show({
                    mode: 'error',
                    msg: '支付失败, 可联系客服进行退款'
                })
                //关键在这里，调用上一页的函数
                prePage.payResult('1')
                _this.timeOut = setTimeout(function () {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, 500)
                break
            case '2':
                _this.marked.show({
                    mode: 'success',
                    msg: '支付成功'
                })
                //关键在这里，调用上一页的函数
                prePage.payResult('2')
                _this.timeOut = setTimeout(function () {
                    wx.navigateBack({
                        delta: 2,
                    })
                }, 500)
                break
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let orderList = JSON.parse(decodeURIComponent(options.orderList))
        let totalPrice = options.totalPrice
        let type = options.type
        console.log(totalPrice)
        console.log(type)
        console.log(orderList)
        // return
        this.setData({
            type: type,
            orderList: orderList,
            totalPrice: totalPrice
        })
        let _this = this
        setInterval(function() {
            _this.setData({
                time: _this.data.time - 1
            })
        }, 1000)
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
        if (this.data.show){
            if (this.data.success) {
                this.callbackCallback()
            } else {
                this.CallBack = () => {
                    this.callbackCallback()
                }
            }
        }else {
            this.setData({
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
        clearTimeout(this.timeOut)
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