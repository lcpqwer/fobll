// components/shop-item/shop-item.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shop: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /* 查看商品详情
         * @method toDetail
         */
        toDetail() {
            let _this = this
            console.log(_this.data.shop)
            let shopJson = encodeURIComponent(JSON.stringify(_this.data.shop))
            wx.navigateTo({
                url: '/pages/shop-details/shop-details?shop=' + shopJson,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
            
        },
        /* 加入购物车
         * @method addToCar
         */
        addToCar() {
            let _this = this;
            _this.load = _this.selectComponent('#load')
            _this.marked = _this.selectComponent('#marked')
            let userIdent = getApp().globalData.userIdent
            if (userIdent == -1){
                this.marked.show({
                    mode: 'error',
                    msg: '您还未登录，请先登录'
                })
                return
            } else if (userIdent ==  0){
                this.marked.show({
                    mode: 'error',
                    msg: '您还未绑定账号，请先绑定'
                })
                return
            } else if (userIdent == 2) {
                this.marked.show({
                    mode: 'error',
                    msg: '非采购账号没有该权限'
                })
                return
            }
            
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
            // getApp().globalData.addCar(_this.data.shop.supply_price, params)
            // return
            console.log(params)
            _this.load.show()
            Request.Ajax(Url.addToCar(_this.data.shop.type),params,'POST').then(res => {
                console.log(res)
                if (res.code == 200){
                    _this.load.hide()
                    _this.marked.show({ mode: 'success', msg: '加入购物车成功'})
                    if (_this.data.shop.type == 3) {
                        if (getApp().globalData.shop_car_bool['discount']){
                            getApp().globalData.addCar('discount', params)
                        }
                    }else {
                        if (getApp().globalData.shop_car_bool[_this.data.shop.supply_price]) {
                            getApp().globalData.addCar(_this.data.shop.supply_price, params)
                        }
                    }
                }else {
                    _this.load.hide()
                    _this.marked.show({mode: 'error',msg: res.msg})
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
    }
})