// pages/edit-order/edit-order.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
import ShopCar from '../../utils/shopCar.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        shopList: [],
        invoice: false,
        type: null,
        address: {
            address: '',
            name: '',
            phone: ''
        },
        way: 0, // 送礼方式
        hasInvoice: false, // 是否开具订单
        titleList: null,
        invoiceDate: {
            type: '2',
            title: {
                type: 1,
                name: ''
            },
            content: '详细'
        },
        fee: null,
        shopTotalPrice: 0, // 商品总价
        feeDeduction: 0, // 会费可用抵扣金额
        deduction: false, // 是否使用会费抵扣
        feeBack: 0, // 会费返还金额
        copePrice: 0, // 实付
        deductionNum: 0, // 实际抵扣
        pay: false,
        result: null
    },
    payResult(index){
        this.setData({
            result: index
        })
    },
    /**
     * 进行选择送礼方式
     * @method distribution
     */
    distribution() {
        this.dist.show()
    },
    /**
     * 选择送礼方式
     * @method changeWay
     */
    changeWay(e) {
        let way = e.detail.way
        this.setData({
            way: way
        })
    },
    /**
     * 获取默认公司地址
     * @method getAddress
     */
    getAddress() {
        let _this = this
        let params = {
            eid: getApp().globalData.company.id
        }
        // _this.load.show()
        Request.Ajax(Url.getAddress(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    ['address.name']: res.data[0].name,
                    ['address.phone']: res.data[0].account,
                    ['address.address']: res.data[0].address
                })
            } else {
                _this.marked.show()
            }
        }).catch(res => {
            _this.marked.show()
        })
    },
    /**
     * 填写新地址
     * @method newAddress
     */
    newAddress() {
        this.newaddress.show()
    },
    /**
     * 改变地址
     * @method changeAddress
     * @param {Object} e 地址详情
     */
    changeAddress(e) {
        this.setData({
            address: e.detail
        })
    },
    /**
     * 选择发票
     * @method inShow
     */
    inShow() {
        if (this.data.type == '1') {
            this.setData({
                invoice: true
            })
            this.invoice = this.selectComponent("#invoice")
            this.invoice.show()
        }
    },
    /**
     * 不开具发票
     * @method noInvoice
     */
    noInvoice() {
        this.setData({
            hasInvoice: false
        })
        this.inHide()
    },
    /**
     * 开具发票
     * @method openInvoice
     */
    openInvoice(e) {
        console.log(e)
        this.setData({
            invoiceDate: e.detail.invoice,
            hasInvoice: true
        })
        this.inHide()
    },
    /**
     * 隐藏选择发票
     * @method inHide
     */
    inHide() {
        this.setData({
            invoice: false
        })
    },
    /**
     * 获取抬头
     * @method getInvoice
     */
    getInvoice() {
        let _this = this
        Request.Ajax(Url.getInvoice(), {}, 'GET').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    titleList: res.data
                })
                for (let i = 0; i < res.data.length; i++) {
                    let item = res.data[i]
                    if (item['defaults'] == 1) {
                        _this.setData({
                            hasInvoice: true,
                            ['invoiceDate.title']: item
                        })
                        break
                    }
                }
            } else {
                _this.marked.show()
            }
        }).catch(res => {
            _this.marked.show()
        })
    },
    /**
     * 添加抬头
     * @method addOne
     */
    addOne(e) {
        let params = e.detail.params
        console.log(params)
        let _this = this
        this.load.show()
        Request.Ajax(Url.addInvoice(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                let ls = _this.data.titleList
                ls.push(params)
                _this.setData({
                    titleList: ls
                })
                _this.marked.show({
                    mode: 'success',
                    msg: '添加成功'
                })
                _this.selectComponent('#invoice').selectComponent('#look-up-name').cancelAdd()
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 修改抬头
     * @method addOne
     */
    updateOne(e) {
        let params = e.detail.params
        let index = e.detail.index
        console.log(params)
        let _this = this
        _this.load.show()
        Request.Ajax(Url.updateInvoice(), params, "POST").then(res => {
            if (res.code == 200) {
                _this.load.hide()
                let ls = _this.data.titleList
                ls[index] = params
                _this.setData({
                    titleList: ls
                })
                _this.marked.show({
                    mode: 'success',
                    msg: '修改成功'
                })
                _this.selectComponent('#invoice').selectComponent('#look-up-name').cancelAdd()
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 确认下单
     * @method confirm
     */
    confirm() {
        let type = this.data.type;
        if (type == 1) {
            this.giftOrder()
        } else {
            this.discountOrder()
        }
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
     * 礼包下单
     * @method giftOrder
     */
    giftOrder() {
        let _this = this
        // // =============================
        // _this.toPay()
        // return
        // // =============================
        let invoice = _this.data.invoiceDate
        let address = _this.data.address
        let giftList = _this.data.shopList
        let singleShopNum = {}
        let ls = []
        let surplus_back = parseFloat(_this.data.feeBack)
        let surplus_dedu = parseFloat(_this.data.deductionNum)
        for (let i = 0; i < giftList.length; i++) {
            let gift = giftList[i]
            let shopList = gift.shop_list
            for (let j = 0; j < shopList.length; j++) {
                if (singleShopNum[shopList[j].Id.toString()]) {
                    singleShopNum[shopList[j].Id.toString()] += gift.number
                } else {
                    singleShopNum[shopList[j].Id.toString()] = gift.number
                }
            }

            let totalPrice = Math.round(parseFloat(gift.price) * gift.number * 100) / 100
            // 商品总价（应付金额）
            gift.amount_payable = totalPrice
            if (_this.data.copePrice == 0.01 * _this.data.shopList.length) {
                // 会费返还
                gift.feeBack = 0
                // 会费抵扣
                gift.feeDeduction = gift.amount_payable - 0.01
                // 实付金额
                gift.copePrice = 0.01
            } else {
                let feeDeduction = Math.round(totalPrice / parseFloat(_this.data.shopTotalPrice) * parseFloat(_this.data.deductionNum) * 100) / 100
                let feeBack = Math.round(totalPrice / parseFloat(_this.data.shopTotalPrice) * parseFloat(_this.data.feeBack) * 100) / 100
                if (i < giftList.length - 1) {
                    // 会费返还
                    gift.feeBack = feeBack
                    // 会费抵扣
                    gift.feeDeduction = feeDeduction
                    surplus_back -= feeBack
                    surplus_dedu -= feeDeduction
                } else {
                    // 会费返还
                    gift.feeBack = Math.round(surplus_back * 100) / 100
                    // 会费抵扣
                    gift.feeDeduction = Math.round(surplus_dedu * 100) / 100
                }
                // 实付金额
                gift.copePrice = Math.round((gift.amount_payable - gift.feeDeduction) * 100) / 100
            }
            ls.push(gift)

        }
        console.log(ls)
        // return
        let hasInvoice = _this.data.hasInvoice
        let params = {
            singleShopNum: singleShopNum,
            giftList: ls,
            enterpriseId: getApp().globalData.company.id,
            phone: address.phone,
            name: address.name,
            address: address.address,
            createTime: _this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
            invoiceType: hasInvoice?invoice.type:'4',
            invoiceRiseType: hasInvoice ? invoice.title.type : '',
            invoiceRiseName: hasInvoice ? invoice.title.invoice_rise : '',
            invoiceRiseContent: hasInvoice ? "商品详情" : '',
            invoiceAddress: hasInvoice ? invoice.title.invoice_address : '',
            invoiceBank: hasInvoice ? invoice.title.invoce_bank : '',
            invoiceBankAccount: hasInvoice ? invoice.title.invoce_bankaccount : '',
            taxnumber: hasInvoice ? invoice.title.taxnumber : '',
            orderType: '2',
            feeDeduction: parseFloat(_this.data.deductionNum)
        }
        console.log(params)
        _this.load.show()
        Request.Ajax(Url.giftOrderAdd(), params, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200) {
                getApp().globalData.company.fee = parseFloat(getApp().globalData.company.fee) - _this.data.deductionNum
                ShopCar.removeGift(_this.data.shopList)
                for (let i = 0; i < res.data.ordid.length; i++) {
                    this.setData({
                        ['shopList[' + i + '].ordid']: res.data.ordid[i]
                    })
                }
                _this.toPay()
            } else {
                _this.marked.show({
                    mode: 'error',
                    msg: '获取订单信息失败',
                })
                if (res.msg == '会费余额不足') {
                    getApp().globalData.company.fee = res.data.fee
                }
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()

        })
    },
    /**
     * 折扣下单
     * @method discountOrder
     */
    discountOrder() {
        let _this = this
        // // =============================
        // _this.toPay()
        // return
        // // =============================
        let shopList = []
        let ls = _this.data.shopList
        for (let i = 0; i < ls.length; i++) {
            let item = ls[i]
            let dic = {
                id: item.shopId,
                price: item.supply_price
            }
            shopList.push(dic)
        }
        let address = _this.data.address
        let params = {
            shopList: shopList,
            enterpriseId: getApp().globalData.company.id,
            phone: address.phone,
            name: address.name,
            address: address.address,
            createTime: _this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
            orderType: '1'
        }
        _this.load.show()
        console.log(params)
        // return
        Request.Ajax(Url.discountOrderAdd(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                // _this.discountFinish()
                ShopCar.removeDiscount(_this.data.shopList)
                for (let i = 0; i < res.data.ordid.length; i++) {
                    this.setData({
                        ['shopList[' + i + '].ordid']: res.data.ordid[i]
                    })
                }
                _this.toPay()
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 去支付
     * @method toPay
     * @param {Date} time 创建时间 
     */
    toPay() {
        let _this = this
        let json = encodeURIComponent(JSON.stringify(_this.data.shopList))
        let type = _this.data.type

        wx.navigateTo({
            url: '/pages/pay/pay?type=' + type + '&orderList=' + json + '&totalPrice=' + _this.data.copePrice,
            success: () => {
                _this.setData({
                    pay: true
                })
            }
        })
    },
    /**
     * 获取商品总价
     * @method shopTotalPrice
     */
    shopTotalPrice(type, ls) {
        let sum = 0;
        for (let i = 0; i < ls.length; i++) {
            if (type == 2) {
                sum += parseFloat(ls[i].supply_price)
            } else {
                // console.log('price === ' + ls[i].price)
                sum += parseFloat(ls[i].price) * ls[i].number
            }
        }
        return sum.toFixed(2)
    },
    /**
     * 获取会费返还
     * @method getFeeBack
     */
    getFeeBack(price) {
        let _this = this
        let params = {
            price: parseFloat(price)
        }
        _this.load.show()
        Request.Ajax(Url.getFeeBack(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                _this.setData({
                    feeBack: parseFloat(res.data.fee_return).toFixed(2)
                })
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            _this.load.hide()
        })
    },
    /**
     * 获取会费可用抵扣
     * @method feeDeduction
     */
    getFeeDeduction() {
        let fee = parseFloat(this.data.fee)
        /**
         * 是否预留0.01
         */
        let totalPrice = parseFloat(this.data.shopTotalPrice) - 0.01 * this.data.shopList.length
        if (fee < totalPrice) {
            this.setData({
                feeDeduction: fee.toFixed(2)
            })
        } else {
            this.setData({
                feeDeduction: totalPrice.toFixed(2)
            })
        }
    },
    /**
     * 选择是否使用会费抵扣
     * @method switchChange
     */
    switchChange(e) {
        this.load.show()
        this.setData({
            deduction: e.detail.value
        })
        if (e.detail.value) {
            this.setData({
                copePrice: (parseFloat(this.data.shopTotalPrice) - parseFloat(this.data.feeDeduction)).toFixed(2),
                deductionNum: this.data.feeDeduction
            })
            this.getFeeBack(this.data.copePrice)
        } else {
            this.setData({
                copePrice: this.data.shopTotalPrice,
                deductionNum: 0.00
            })
            this.getFeeBack(this.data.copePrice)
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.getAddress()
        let shopList = JSON.parse(decodeURIComponent(options.shopList))
        console.log(shopList)
        let type = options.type
        console.log(getApp().globalData.company)
        this.setData({
            type: type,
            shopList: shopList,
            shopTotalPrice: this.shopTotalPrice(type, shopList),
            fee: parseFloat(getApp().globalData.company.fee).toFixed(2),
            copePrice: this.shopTotalPrice(type, shopList),
        })
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        if (type == 1) {
            this.getInvoice()
            this.getFeeBack(this.data.shopTotalPrice)
            this.getFeeDeduction()
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.dist = this.selectComponent("#dist");
        this.newaddress = this.selectComponent("#newAddress")
        this.invoice = this.selectComponent("#invoice")
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let _this = this
        if (this.data.pay) {
            if (this.data.result == 2){
                _this.marked.show({
                    mode: 'success',
                    msg: '支付成功'
                })
            }else {
                _this.marked.show({
                    mode: 'error',
                    msg: '支付失败'
                })
            }
            this.timeOut = setTimeout(function() {
                wx.navigateBack({
                    delta: 1,
                })
            }, 500)
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