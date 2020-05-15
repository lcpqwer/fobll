// components/shop_car_200/shop_car_200.js
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
        rootUrl:getApp().globalData.rootUrl,
        shopList: null,
        giftBag: false,
        allChecked: false,
        selectList: [],
        page: 1,
        delIndex: null
    },
    /**
     * 组件创建时运行
     */
    created(){
        this.loadMore = this.selectComponent('#loadMore')
        this.marked = this.selectComponent('#marked')
        this.load = this.selectComponent('#load')
        this.giftBag = this.selectComponent('#giftBag')
    },
    /**
     * 组件的方法列表
     */
    methods: {
        allSelected() {
            let flag = !this.data.allChecked
            this.setData({
                allChecked: flag
            })
            for (let i = 0; i < this.data.shopList.length; i++) {
                let newLi = 'shopList[' + i + '].checked'
                this.setData({
                    [newLi]: flag
                })
            }
            if (flag) {
                this.setData({
                    selectList: this.data.shopList
                })
            } else {
                this.setData({
                    selectList: []
                })
            }
        },
        selectedOne(e) {
            // console.log(e.detail)
            let index = e.detail.index;
            let flag = !this.data.shopList[index].checked;
            let newli = 'shopList[' + index + '].checked';
            if (flag) {
                let list = this.data.shopList
                let ls = this.data.selectList
                ls.push(this.data.shopList[index])
                this.setData({
                    [newli]: flag,
                    selectList: ls
                })
                console.log(this.data.selectList)
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
                let ls = []
                for (let j = 0; j < sLsit.length; j++) {
                    if (sLsit[j].shopId != this.data.shopList[index].shopId) {
                        ls.push(sLsit[j])
                    }
                }
                this.setData({
                    [newli]: flag,
                    allChecked: false,
                    selectList: ls,
                })
            }
        },
        showGift() {
            if (this.data.selectList.length < 1) {
                this.marked.show({ mode: 'error', msg: '请选择加入礼包的商品' })
                return
            }
            this.setData({
                giftBag: true
            })
            this.giftBag.getGreeting()
        },
        /**
         * 创建礼包成功之后整合数据
         * @method success
         */
        success() {
            let lastList = getApp().globalData.shop_car_200
            let selectList = this.data.selectList
            let newList = []
            for (let i = 0; i < lastList.length; i++) {
                let item = lastList[i]
                let flag = false
                for (let j = 0; j < selectList.length; j++) {
                    if (item.create_time == selectList[j].create_time) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    newList.push(item)
                }
            }
            getApp().globalData.shop_car_200 = newList
            let page = this.data.page - 1
            let shopList = [];
            let state = 'More'
            if (10 * page >= newList.length) {
                state = 'noMore'
                shopList = newList
            } else {
                shopList = newList.slice(0, 10 * page)
            }
            this.setData({
                shopList: shopList,
                selectList: [],
                allChecked: false
            })
            this.hideGift()
        },
        hideGift() {
            this.setData({
                giftBag: false
            })
        },
        /* 格式化购物车数据
         * @method formatData
         * @param {Object} data 购物车数据
         */
        formatData(data) {
            let arr = [];
            for (let key in data) {
                data[key].checkde = false
                data[key].supply_price = '200.00'
                data[key].int_price = '200'
                data[key].decimal = '00'
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
         * @method getShopCarWithPrice
         */
        getShopCarWithPrice() {
            let _this = this;
            let params = {
                openId: getApp().globalData.openid,
                priceSection: '200.00'
            };
            // _this.load.show()
            _this.setData({
                state: 'Loading'
            })
            this.loadMore = this.selectComponent('#loadMore')
            this.loadMore.setState('Loading')
            // console.log(this.data.state)
            Request.Ajax(Url.getShopCarWithPrice(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    getApp().globalData.shop_car_bool['200.00'] = true
                    if (res.data instanceof Array) {
                        _this.setData({
                            state: '',
                            shopList: []
                        })
                    } else {
                        getApp().globalData.shop_car_200 = _this.formatData(res.data).sort(_this.compare())
                        _this.getPageOne()
                    }

                    // _this.load.hide()
                } else {
                    // _this.load.hide()
                    _this.marked.show({ mode: 'error', msg: res.msg })
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
            let ls = getApp().globalData.shop_car_200;
            console.log(ls)
            let page = this.data.page;
            let state = 'More';
            let shopList;
            if (10 * page >= ls.length) {
                if (page == 1) {
                    shopList = ls.slice(10 * (page - 1))
                    console.log('shopList')
                    console.log(shopList)
                } else {
                    shopList = this.data.shopList.concat(ls.slice(10 * (page - 1)))
                }
                state = 'noMore'
            } else {
                if (page == 1) {
                    shopList = ls.slice(10 * (page - 1), 10 * page)
                } else {
                    shopList = this.data.shopList.concat(ls.slice(10 * (page - 1), 10 * page))
                }

            }
            this.setData({
                shopList: shopList,
                state: state,
                page: page + 1
            })
            console.log(this.data.shopList)
        },
        /**
         * 删除数组元素
         * @method removeArray
         * @param {Array} arr 原始数组
         * @param {String} str 删除的元素
         */
        removeArray(arr, str){
            let ls = []
            for (let i=0;i<arr.length;i++){
                if (arr[i] != str){
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
            console.log(ls)
            if (getApp().globalData.shop_car_bool['200.00']) {
                if (ls.includes('200.00')) {
                    this.setData({
                        page: 1,
                        shopList: null
                    })
                    this.getPageOne()
                    getApp().globalData.add_car_list = this.removeArray(ls, '200.00')
                }
            } else {
                this.getShopCarWithPrice()
            }
        },
        /**
         * 加载下一页
         * @method lower
         */
        lower() {
            let _this = this
            // _this.loadMore.setState('Loading')
            if (_this.data.state != 'noMore' && _this.data.state != 'Loading') {
                _this.setData({
                    state: 'Loading'
                })
                setTimeout(function () {
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
                type: '1',
                openId: getApp().globalData.openid,
                supplyPrice: '200.00',
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
            let lastList = getApp().globalData.shop_car_200
            let newList = lastList.delete(index)
            getApp().globalData.shop_car_200 = newList
            let page = this.data.page - 1
            let shopList = [];
            let state = 'More'
            if (10 * page >= newList.length) {
                state = 'noMore'
                shopList = newList
            } else {
                shopList = newList.slice(0, 10 * page)
            }
            let selectList = this.data.selectList
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].shopId == shopId) {
                    selectList = selectList.delete(i)
                    break
                }
            }
            this.setData({
                shopList: shopList,
                state: state,
                selectList: selectList
            })
        }
    }
})