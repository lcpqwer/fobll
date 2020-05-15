// pages/shop-details/shop-details.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        shop: null,
        imgs: [],
        buy: false,
        bottom1: '0px',
        greeting: [],
        gIndex: null,
        getGreetingBool: false,
        sentiment: '',
        userIdent: getApp().globalData.userIdent
    },
    showBuy() {
        if (this.data.getGreetingBool) {
            this.setData({
                buy: true
            })
        } else {
            this.getGreeting()
        }
    },
    hideBuy() {
        this.setData({
            buy: false
        })
    },
    focus(e) {
        console.log(e)
        if (e.detail.height != 0) {
            this.setData({
                bottom1: e.detail.height + 'px'
            })
        }

    },
    blur(e) {
        console.log(e)
        this.setData({
            bottom1: '0'
        })
    },

    input(e) {
        console.log(e)
        let val = e.detail.value
        if (e.detail.keyCode === 10) {
            val = val.replace(/[\r\n]/g, "")
        }
        console.log(val)
        this.setData({
            sentiment: val
        })
    },
    /**
     * 判断折扣商品是否已购买
     * @method judge
     */
    judge(){
        this.load.show()
        let _this = this
        let params = {
            openId: getApp().globalData.openid,
            shopId: this.data.shop.Id
        }
        Request.Ajax(Url.judge(), params, 'POST').then(res => {
            console.log(res)
            _this.load.hide()
            if (res.code == 200){
                _this.toBuy()
            }else {
                _this.marked.show({
                    mode: 'error',
                    msg: '同批次商品只能购买一件'
                })
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 立即购买
     * @method toBuy
     */
    toBuy(){
        let shop = this.data.shop
        console.log(this.data.shop)
        shop.price = shop.supply_price
        shop.shopId = shop.Id
        let ls = []
        ls.push(shop)
        console.log(ls)
        let json = encodeURIComponent(JSON.stringify(ls))
        let url = '/pages/edit-order/edit-order?type=2&shopList=' + json
        wx.navigateTo({
            url: url
        })
    },
    /* 切换祝福语
     * @method changeSentiment
     */
    changeSentiment() {
        let index;
        if (this.data.gIndex < this.data.greeting.length - 1) {
            index = this.data.gIndex + 1;
        } else {
            index = 0
        }
        this.setData({
            sentiment: this.data.greeting[index].content,
            gIndex: index
        })
    },
    /* 获取全部祝福语
     * @method getGreeting
     */
    getGreeting() {
        if (getApp().globalData.greetingList){
            this.setData({
                buy: true
            })
            return
        }
        let _this = this;
        _this.load.show()
        Request.Ajax(Url.getGreeting(), {}, "POST").then(res => {
            console.log(res)
            if (res.code == 200) {
                getApp().globalData.greetingList = res.data
                _this.setData({
                    greeting: res.data,
                    gIndex: 0,
                    getGreetingBool: true,
                    sentiment: res.data[0].content,
                    buy: true
                })
                _this.load.hide()
            } else {
                _this.load.hide()
                _this.marked.show({mode: 'error', msg: res.msg})
            }

        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /* 获取商品详情
     * @method getShopDetail
     * @param {Object} params 商品id({ShopId: 1})
     */
    getShopDetail(params) {
        let _this = this
        Request.Ajax(Url.getShopDetail(), params, 'POST').then(res => {
            console.log(res)

            if (res.code == 200) {
                _this.setData({
                    imgs: res.data
                })
                _this.load.hide()
            } else {
                _this.load.hide()
                _this.marked.show()

            }

        }).catch(res => {
            _this.load.hide()
        })
    },
    /* 生成礼包
     * @method createGift
     */
    createGift() {
        let _this = this;
        let shop = _this.data.shop
        let params = {
            // openId: getApp().globalData.openid,
            price: parseFloat(shop.supply_price).toFixed(2),
            greeting: _this.data.sentiment,
            create_time: new Date().getTime(),
            shop_list: [{
                Id: shop.Id,
                order_img: shop.order_img,
                title: shop.title,
                label_list: shop.label_list,
                brand: shop.brand,
                supply_price: parseFloat(shop.supply_price).toFixed(2),
                brief_introduction: shop.brief_introduction
            }],
            number: 1,
            type: '1'
        }
        _this.load.show()
        Request.Ajax(Url.createGift(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.load.hide()
                _this.marked.show({
                    mode: 'success',
                    msg: '礼包生成成功，可在购物车内查看'
                })
                _this.setData({
                    buy: false
                })
                if (getApp().globalData.shop_car_bool['gift']) {
                    getApp().globalData.addCar('gift', params)
                }
            } else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: res.msg
                })
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.marked.show()
        })
    },
    /* 加入购物车
     * @method addToCar
     */
    addToCar() {
        let _this = this;
        let shop = _this.data.shop;
        let params = {
            shopId: shop.Id,
            openId: getApp().globalData.openid,
            supply_price: shop.supply_price,
            title: shop.title,
            label_list: shop.label_list,
            order_img: shop.order_img,
            create_time: new Date().getTime(),
            brand: shop.brand,
            brief_introduction: shop.brief_introduction
        }
        _this.load.show()
        Request.Ajax(Url.addToCar(_this.data.shop.type), params, 'POST').then(res => {
            if (res.code == 200) {
                _this.load.hide()
                _this.marked.show({
                    mode: 'success',
                    msg: '加入购物车成功'
                })
                if (_this.data.shop.type == 3) {
                    if (getApp().globalData.shop_car_bool['discount']) {
                        getApp().globalData.addCar('discount', params)
                    }
                } else {
                    if (getApp().globalData.shop_car_bool[_this.data.shop.supply_price]) {
                        getApp().globalData.addCar(_this.data.shop.supply_price, params)
                    }
                }
            } else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: res.msg
                })
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 添加想要
     * @method addToWant
     */
    addToWant(){
        let _this = this
        let params = {
            shopId: _this.data.shop.Id,
            eid: getApp().globalData.company.id
        }
        _this.load.show()
        Request.Ajax(Url.addToWant(), params, "POST").then(res => {
            console.log(res)
            if (res.code == 200){
                _this.load.hide()
                _this.marked.show({
                    mode: 'success',
                    msg: '添加想要成功'
                })
            }else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: res.msg
                })
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userIdent: getApp().globalData.userIdent
        })
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        this.load.show()
        let shop = JSON.parse(decodeURIComponent(options.shop))
        console.log(shop)
        this.setData({
            shop: shop
        })
        let params = {
            ShopId: shop.Id
        }
        this.getShopDetail(params)
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
        let shop = encodeURIComponent(JSON.stringify(this.data.shop))
        let title = this.data.shop.title
        return {
            title: title,
            path: '/pages/shop-details/shop-details?shop='+shop
        }
    }
})