// components/shop_car_100/shop_car_100.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Array.prototype.delete = (index) => {
    let newArray = []
    for (let i = 0; i < this.length; i++) {
        if (i != index) {
            newArray.psuh(this[i])
        }
    }
    return newArray
}
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
        giftList: null,
        giftBag: false,
        allChecked: false,
        selectList: [],
        money: 0,
        state: 'More',
        page: 1
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
            wx.showLoading({
                title: '',
                mask: true
            })
            let flag = !this.data.allChecked
            this.setData({
                allChecked: flag
            })
            let money = 0
            for (let i = 0; i < this.data.giftList.length; i++) {
                let newLi = 'giftList[' + i + '].checked'
                this.setData({
                    [newLi]: flag
                })
                if (flag) money += this.data.giftList[i].price * this.data.giftList[i].num
            }
            if (flag) {
                this.setData({
                    selectNum: this.data.giftList.length,
                    selectList: this.data.giftList,
                    money: money
                })
            } else {
                this.setData({
                    selectNum: 0,
                    selectList: [],
                    money: money
                })
            }
            wx.hideLoading()
        },
        /**
         * 单选
         * @method selectedOne
         * @params {Object} e 选择的商品索引
         */
        selectedOne(e) {
            // console.log(e.detail)
            let index = e.detail.index;
            let flag = !this.data.giftList[index].checked;
            let newli = 'giftList[' + index + '].checked';
            if (flag) {
                let list = this.data.giftList
                this.setData({
                    [newli]: flag,
                    money: this.data.money + this.data.giftList[index].price
                })
                let ls = this.data.selectList
                ls.push(this.data.giftList[index])
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
                    if (sLsit[j].id == this.data.giftList[index].id) {
                        sLsit = sLsit.delete(j)
                        break
                    }
                }
                this.setData({
                    [newli]: flag,
                    allChecked: false,
                    money: this.data.money - this.data.giftList[index].price,
                    selectList: sLsit
                })
            }
        },
        /**
         * 下单
         * @method placeOrder
         */
        placeOrder() {
            if (this.data.selectList.length < 1) {
                this.marked.show({ mode: 'error', msg: '请选择下单的礼包' })
                return
            }
            let json = encodeURIComponent(JSON.stringify(this.data.selectList))
            let url = '/pages/edit-order/edit-order?type=1&shopList=' + json
            wx.navigateTo({
                url: url
            })
        },
        /**
         * 格式化数据
         * @method formatData
         * @param {Object} ls 礼包列表
         */
        formatData(ls) {
            for (let i = 0; i < ls.length; i++) {
                ls[i].checked = false
            }
            return ls
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
        /**
         * 获取礼包全部数据
         * @method getGift
         */
        getGift() {
            let _this = this
            _this.setData({
                state: 'Loading'
            })
            this.loadMore = this.selectComponent('#loadMore')
            _this.loadMore.setState('Loading')
            let params = {
                openId: getApp().globalData.openid
            }
            Request.Ajax(Url.getGift(), params, 'POST').then(res => {
                console.log(res.data)
                if (res.code == 200) {
                    getApp().globalData.shop_car_gift = _this.formatData(res.data).sort(_this.compare())
                    getApp().globalData.shop_car_bool['gift'] = true
                    _this.getPageOne()
                } else {
                    _this.setData({
                        state: 'Error'
                    })
                }

            }).catch(res => {
                _this.setData({
                    state: 'Error'
                })
            })
        },
        /**
         * 加载一页数据
         * @method getPageOne
         */
        getPageOne() {
            this.setData({
                state: 'Loading'
            })
            this.loadMore.setState('Loading')
            let ls = getApp().globalData.shop_car_gift;
            console.log('ls', ls)
            let page = this.data.page;
            let state = 'More';
            let giftList;
            if (10 * page >= ls.length) {
                // console.log(ls.slice(10 * (page - 1)))
                // giftList = this.data.giftList.concat(ls.slice(10 * (page - 1)))
                giftList = ls
                state = 'noMore'
                console.log('giftList', giftList)
            } else {
                if (page == 1) {
                    giftList = ls.slice(10 * (page - 1), 10 * page)
                } else {
                    giftList = this.data.giftList.concat(ls.slice(10 * (page - 1), 10 * page))
                }

            }
            this.setData({
                giftList: giftList,
                state: state,
                page: page + 1
            })
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
            let page = this.data.page - 1
            let ls1 = getApp().globalData.shop_car_gift
            if (getApp().globalData.shop_car_bool['gift']) {
                if (ls.includes('gift')) {
                    console.log('有生成礼包')
                    let giftList;
                    let state = 'More'
                    if (10 * page >= ls1.length) {
                        state = 'noMore'
                        giftList = ls1
                    } else {
                        giftList = ls1.slice(0, 10 * page)
                    }
                    console.log(this.data.giftList.length)
                    console.log(ls1.length)
                    this.setData({
                        allChecked: false,
                        giftList: giftList,
                        state: state
                    })
                    getApp().globalData.add_car_list = this.removeArray(ls, 'gift')
                }
                if (getApp().globalData.placeOrder) {
                    let giftList;
                    let state = 'More'
                    if (10 * page >= ls1.length) {
                        state = 'noMore'
                        giftList = ls1
                    } else {
                        giftList = ls1.slice(0, 10 * page)
                    }
                    this.setData({
                        selectList: [],
                        allChecked: false,
                        giftList: giftList
                    })
                    getApp().globalData.placeOrder = false
                }
            } else {
                this.getGift()
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
            let index = e.detail.index;
            this.setData({
                delIndex: 'shop' + index
            })
        },
        /**
         * 删除礼包
         * @method delGift
         * @param {Object} e 删除礼包索引
         */
        delGift(e) {
            let _this = this
            _this.load.show()
            let index = e.detail.index
            let params = {
                "operation": "2",
                "openId": getApp().globalData.openid,
                "createTime": _this.data.giftList[index].create_time.toString()
            }
            console.log(params)

            Request.Ajax(Url.delGift(), params, 'POST').then(res => {
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
            let create_time = this.data.giftList[index].create_time
            let lastList = getApp().globalData.shop_car_gift
            console.log(lastList.length)
            let newList = lastList.delete(index)
            console.log(newList.length)
            getApp().globalData.shop_car_gift = newList
            let page = this.data.page - 1
            let giftList = [];
            let state = 'More'
            if (10 * page >= newList.length) {
                state = 'noMore'
                giftList = newList
            } else {
                giftList = newList.slice(0, 10 * page)
            }
            console.log(giftList, 'giftList')
            let selectList = this.data.selectList
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].create_time == create_time) {
                    selectList = selectList.delete(i)
                    break
                }
            }
            let allChecked = selectList.length == giftList.length ? true : false
            this.setData({
                giftList: giftList,
                state: state,
                selectList: selectList,
                allChecked: allChecked
            })
            console.log(this.data.giftList)
        },
        /**
         * 增加礼包数量
         * @method addOne
         * @param {Object} e 商品索引
         */
        addOne(e) {
            let _this = this
            let index = e.detail.index
            // console.log('==== 需要改变数量的index ====')
            // console.log('==== '+index+' =====')
            let gift = _this.data.giftList[index]
            // console.log('==== 改变前数量 ====')
            // console.log(gift.number)
            let params = {
                "operation": "1",
                "openId": getApp().globalData.openid,
                "createTime": gift.create_time.toString()
            }
            _this.load.show()
            Request.Ajax(Url.delGift(), params, 'POST').then(res => {
                if (res.code == 200) {
                    console.log(res)
                    let li = 'giftList[' + index + '].number'
                    // console.log('==== 改变成功后数量 ====')
                    let last_num = gift.number + 1
                    // console.log(gift.number + 1)
                    _this.setData({
                        [li]: last_num
                    })
                    let seList = _this.data.selectList
                    for (let i = 0; i < seList.length; i++) {
                        if (seList[i].create_time == gift.create_time) {
                            this.setData({
                                ['selectList[' + index + '].number']: last_num
                            })
                            break
                        }
                    }
                    // console.log('==== 改变后的列表 ====')
                    // console.log(_this.data.giftList)
                    getApp().globalData.shop_car_gift[index].number = last_num
                    // console.log(getApp().globalData.shop_car_gift)
                    _this.load.hide()
                } else {
                    _this.load.hide()
                    _this.marked.show()
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
        /**
         * 减少礼包数量
         * @method addOne
         * @param {Object} e 商品索引
         */
        minusOne(e) {
            let _this = this
            let index = e.detail.index
            let gift = _this.data.giftList[index]
            let params = {
                "operation": "3",
                "openId": getApp().globalData.openid,
                "createTime": gift.create_time.toString()
            }
            _this.load.show()
            Request.Ajax(Url.delGift(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    let li = 'giftList[' + index + '].number'
                    let last_num = gift.number - 1
                    _this.setData({
                        [li]: last_num
                    })
                    let seList = _this.data.selectList
                    for (let i = 0; i < seList.length; i++) {
                        if (seList[i].create_time == gift.create_time) {
                            this.setData({
                                ['selectList[' + index + '].number']: last_num
                            })
                            break
                        }
                    }
                    getApp().globalData.shop_car_gift[index].number = last_num
                    _this.load.hide()
                } else {
                    _this.load.hide()
                    _this.marked.show()
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
        /**
         * 改变礼包数量
         * @method inputNumber
         */
        inputNumber(e){
            let _this = this
            let index = e.detail.index
            let value = e.detail.value
            let params = {
                "number": value,
                "openId": getApp().globalData.openid,
                "createTime": _this.data.giftList[index].create_time.toString()
            }
            console.log(params)
            _this.load.show()
            Request.Ajax(Url.updateGiftNumber(), params, 'POST').then(res => {
                _this.load.hide()
                console.log(res)
                if (res.code == 200){
                    _this.marked.show({mode: 'success', msg: '修改成功'})
                    _this.setData({
                        ['giftList[' + index +'].number']: parseInt(value)
                    })
                    for (let i=0; i<_this.data.selectList.length;i++){
                        if (_this.data.selectList[i].create_time == _this.data.giftList[index].create_time){
                            this.setData({
                                ['selectList['+i+'].number']: parseInt(value)
                            })
                        }
                    }
                }else {
                    _this.marked.show({mode: 'error', msg: '修改失败'})
                    _this.setData({
                        ['giftList[' + index + '].number']: _this.data.giftList[index].number
                    })
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
                _this.setData({
                    ['giftList[' + index + '].number']: _this.data.giftList[index].number
                })
            })
        }
    }
})