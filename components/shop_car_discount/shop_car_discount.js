// components/shop_car_100/shop_car_100.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        shopList: null,
        giftBag: false,
        allChecked: false,
        money: 0,
        page: 1,
        delIndex: null,
        selectList: []
    },
    /*
     * 组件创建时运行
     */
    created() {
        this.loadMore = this.selectComponent('#loadMore')
        this.marked = this.selectComponent('#marked')
        this.load = this.selectComponent('#load')
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 全选
         * @method allSelected
         */
        allSelected() {
            let flag = !this.data.allChecked
            this.setData({
                allChecked: flag
            })
            let money = 0
            for (let i = 0; i < this.data.shopList.length; i++) {
                let newLi = 'shopList[' + i + '].checked'
                this.setData({
                    [newLi]: flag
                })
                if (flag) money += this.data.shopList[i].price
            }
            this.setData({
                money: money,
                selectList: this.data.shopList
            })
        },
        /**
         * 单选
         * @method selectedOne
         */
        selectedOne(e) {
            // console.log(e.detail)
            let index = e.detail.index;
            let flag = !this.data.shopList[index].checked;
            let newli = 'shopList[' + index + '].checked';
            if (flag) {
                let list = this.data.shopList
                this.setData({
                    [newli]: flag,
                    money: this.data.money + this.data.shopList[index].price
                })
                let ls = this.data.selectList
                ls.push(this.data.shopList[index])
                this.setData({
                    selectList: ls
                })
                for (let i = 0; i < list.length; i++) {
                    if (i !== index) {
                        if (!list[i].checked) {
                            return
                        }
                    }
                }
                console.log('全选')
                this.setData({
                    allChecked: true,
                })
            } else {
                let sLsit = this.data.selectList;
                for (let j = 0; j < sLsit.length; j++) {
                    if (sLsit[j].id == this.data.shopList[index].id) {
                        sLsit = sLsit.delete(j)
                        break
                    }
                }
                this.setData({
                    [newli]: flag,
                    allChecked: false,
                    money: this.data.money - this.data.shopList[index].price,
                    selectList: sLsit
                })
            }
        },
        /* 格式化购物车数据
         * @method formatData
         * @param {Object} data 购物车数据
         */
        formatData(data) {
            let arr = [];
            for (let key in data) {
                data[key].checkde = false
                let ls = data[key].supply_price.split('.')
                console.log('ls',ls)
                data[key].price = parseFloat(data[key].supply_price)
                data[key].int_price = ls[0]
                data[key].decimal = ls[1]
                console.log(data[key])
                arr.push(data[key])
            }
            return arr
        },
        /**
         * 数据按照创建时间排序
         * @method compare
         */
        compare() {
            return (a, b) => {
                var value1 = a.create_time;
                var value2 = b.create_time;
                return value2 - value1
            }
        },
        /* 获取购物车列表
         * @method getShopCarWithDiscount
         */
        getShopCarWithDiscount() {
            let _this = this;
            let params = {
                openId: getApp().globalData.openid
            };
            // _this.load.show()
            _this.setData({
                state: 'Loading'
            })
            this.loadMore = this.selectComponent('#loadMore')
            this.loadMore.setState('Loading')
            // console.log(this.data.state)
            Request.Ajax(Url.getShopCarWithDiscount(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    getApp().globalData.shop_car_bool['discount'] = true
                    // if (res.data instanceof Array) {
                    //     _this.setData({
                    //         state: 'noMore'
                    //     })
                    // } else {
                    getApp().globalData.shop_car_discount = _this.formatData(res.data).sort(_this.compare())
                    _this.getPageOne()
                    // }

                    // _this.load.hide()
                } else {
                    // _this.load.hide()
                    _this.marked.show()
                }
            }).catch(res => {
                // _this.load.hide()
                _this.marked.show()
                _this.setData({
                    state: 'Error'
                })
            })
        },
        /**加载一页数据
         * @method getPageOne
         */
        getPageOne() {
            this.setData({
                state: 'Loading'
            })
            this.loadMore.setState('Loading')
            let ls = getApp().globalData.shop_car_discount;
            console.log('ls', ls)
            let page = this.data.page;
            let state = 'More';
            let shopList;
            if (10 * page >= ls.length) {
                // console.log(ls.slice(10 * (page - 1)))
                // shopList = this.data.shopList.concat(ls.slice(10 * (page - 1)))
                shopList = ls
                state = 'noMore'
                console.log('shopList', shopList)
            } else {
                if (page == 1){
                    shopList = ls.slice(10 * (page - 1), 10 * page)
                }else {
                    shopList = this.data.shopList.concat(ls.slice(10 * (page - 1), 10 * page))
                }
                
            }
            this.setData({
                shopList: shopList,
                state: state,
                page: page + 1
            })
            console.log(shopList)
        },
        /**
         * 删除数组元素
         * @method removeArray
         * @param {Array} arr 原始数组
         * @param {String} str 删除的元素
         */
        removeArray(arr, str) {
            let ls = []
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] != str) {
                    ls.push(arr[i])
                }
            }
            return ls
        },
        /**
         * 初始化
         * @method init
         */
        init() {
            let ls = getApp().globalData.add_car_list
            let ls1 = getApp().globalData.shop_car_discount
            let page = this.data.page - 1
            console.log(ls)
            if (getApp().globalData.shop_car_bool['discount']) {
                if (ls.includes('discount')) {
                    // this.setData({
                    //     page: 1,
                    //     shopList: null
                    // })
                    let shopList;
                    let state = 'More'
                    if (10 * page >= ls1.length) {
                        state = 'noMore'
                        shopList = ls1
                    } else {
                        shopList = ls1.slice(0, 10 * page)
                    }
                    this.setData({
                        allChecked: false,
                        shopList: shopList,
                        state: state
                    })
                    getApp().globalData.add_car_list = this.removeArray(ls, 'discount')
                }
                if (getApp().globalData.placeOrder){
                    let ls1 = getApp().globalData.shop_car_discount
                    let shopList;
                    let state = 'More'
                    if (10 * page >= ls1.length) {
                        state = 'noMore'
                        shopList = ls1
                    } else {
                        shopList = ls1.slice(0, 10 * page)
                    }
                    this.setData({
                        selectList: [],
                        allChecked: false,
                        shopList: shopList
                    })
                    getApp().globalData.placeOrder = false
                }
            } else {
                this.getShopCarWithDiscount()
            }
        },
        /**
         * 加载下一页
         * @method lower
         */
        lower() {
            let _this = this
            if (_this.data.state != 'noMore' && _this.data.state != 'Loading') {
                _this.setData({
                    state: 'Loading'
                })
                _this.loadMore.setState('Loading')
                setTimeout(function() {
                    _this.getPageOne()
                }, 500)
            }
        },
        /**
         * 商品开始滑动
         * @method touchStart
         * @param {Object} e 元素信息
         */
        touchStart() {
            let delIndex = this.data.delIndex;
            if (delIndex) {
                console.log(delIndex)
                let delShop = this.selectComponent('#' + delIndex)
                delShop.setData({
                    tran: 0
                })
                this.setData({
                    delIndex: null
                })
            }
        },
        /**
         * 商品滑动结束
         * @method touchEnd
         * @param {Object} e 商品id
         */
        touchEnd(e) {
            let shopId = e.detail.id;
            this.setData({
                delIndex: 'shop' + shopId
            })
        },
        /**
         * 删除商品
         * @method delShop
         * @param {Object} e 商品信息
         */
        delShop(e) {
            let _this = this
            _this.load.show()
            let index = e.detail.index;
            let shop = e.detail.shop;
            let params = {
                type: '2',
                openId: getApp().globalData.openid,
                supplyPrice: '',
                shopId: shop.shopId
            }
            console.log(params)
            Request.Ajax(Url.delShopCar(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'success',
                        msg: '删除成功'
                    })
                    _this.delSuccess(index)
                } else {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'error',
                        msg: '删除失败'
                    })
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
        /**
         * 删除成功整合数据
         * @method delSuccess
         * @param {Number} index 删除商品索引
         */
        delSuccess(index) {
            let shopId = this.data.shopList[index].shopId
            let lastList = getApp().globalData.shop_car_discount
            console.log(lastList.length)
            let newList = lastList.delete(index)
            console.log(newList.length)
            getApp().globalData.shop_car_discount = newList
            let page = this.data.page - 1
            let shopList = [];
            let state = 'More'
            if (10 * page >= newList.length) {
                state = 'noMore'
                shopList = newList
            } else {
                shopList = newList.slice(0, 10 * page)
            }
            console.log(shopList, 'shopList')
            let selectList = this.data.selectList
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].shopId == shopId) {
                    selectList = selectList.delete(i)
                    break
                }
            }
            let allChecked = selectList.length == shopList.length ? true : false
            this.setData({
                shopList: shopList,
                state: state,
                selectList: selectList,
                allChecked: allChecked
            })
            console.log(this.data.shopList)
        },
        /**
         * 下单
         * @method placeOrder
         */
        placeOrder(){
            let json = encodeURIComponent(JSON.stringify(this.data.selectList))
            let url = '/pages/edit-order/edit-order?type=2&shopList='+json
            wx.navigateTo({
                url: url
            })
        }
    }
})