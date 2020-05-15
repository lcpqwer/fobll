// components/gift-bag/gift-bag.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shopList: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        getGreeting: getApp().globalData.greetingList,
        gIndex: 0,
        sentiment: ''
    },
    /**
     * 创建时运行
     */
    created() {
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
    },
    /**
     * 组件的方法列表
     */
    methods: {
        input(e) {
            console.log(e)
            let val = e.detail.value
            // if (e.detail.keyCode === 10) {
            val = val.replace(/[\r\n]/g, "")
            // }
            console.log(val)
            this.setData({
                sentiment: val
            })
        },
        hide(e) {
            this.triggerEvent('hide')
        },
        /* 获取全部祝福语
         * @method getGreeting
         */
        getGreeting() {
            let _this = this;
            if (getApp().globalData.greetingList) {
                console.log(_this.data.greeting)
                _this.setData({
                    sentiment: getApp().globalData.greetingList[_this.data.gIndex].content,
                    greeting: getApp().globalData.greetingList
                })
                return
            }
            _this.load.show()
            Request.Ajax(Url.getGreeting(), {}, "POST").then(res => {
                console.log(res)
                if (res.code == 200) {
                    getApp().globalData.greetingList = res.data
                    _this.setData({
                        greeting: res.data,
                        gIndex: 0,
                        sentiment: res.data[0].content,
                    })
                    _this.load.hide()
                } else {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'error',
                        msg: res.msg
                    })
                }

            }).catch(res => {
                _this.laod.hide()
                _this.marked.show()
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
        /* 生成礼包
         * @method createGift
         */
        createGift() {
            let _this = this;
            let shopList = _this.data.shopList
            let shop_list = [];
            for (let i = 0; i < shopList.length; i++) {
                let shop = shopList[i]
                let dic = {
                    Id: shop.shopId,
                    order_img: shop.order_img,
                    title: shop.title,
                    label_list: shop.label_list,
                    brand: shop.brand,
                    supply_price: parseFloat(shop.supply_price).toFixed(2),
                    brief_introduction: shop.brief_introduction
                }
                shop_list.push(dic)
            }
            let params = {
                // openId: getApp().globalData.openid,
                price: parseFloat(shopList[0].supply_price).toFixed(2),
                greeting: _this.data.sentiment,
                create_time: new Date().getTime(),
                shop_list: shop_list,
                number: 1,
                type: '2'
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
                    if (getApp().globalData.shop_car_bool['gift']) {
                        getApp().globalData.addCar('gift', params)
                    }
                    setTimeout(function(){
                        _this.success()
                    },500)
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
        /**
         * 创建成功
         * @method success
         */
        success(){
            this.triggerEvent('success')
        }
    }
})