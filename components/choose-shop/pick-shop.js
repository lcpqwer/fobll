// components/choose-shop/pick-shop.js
var Request = require('../../utils/request.js')
var Url = require('../../utils/http.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shop: Object,
        ordid: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        name: '',
        phone: '',
        city: '',
        address: '',
        cityIndex: [0, 0, 0],
        cityArray: [
            [],
            [],
            []
        ],
    },
    /**
     * 
     */
    created() {
        this.getProvince()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        back() {
            this.triggerEvent('back')
        },
        destory() {
            this.triggerEvent('destory')
        },
        /**
         * 输入
         * @method inputVal
         */
        inputVal(e) {
            let index = e.currentTarget.dataset.index
            let val = e.detail.value
            if (index == 0) {
                this.setData({
                    name: val
                })
            } else if (index == 1) {
                this.setData({
                    phone: val
                })
            } else {
                this.setData({
                    address: val
                })
            }
        },
        /**
         * 获取省级三级联动
         * @method getProvince
         */
        getProvince() {
            let _this = this
            _this.load = this.selectComponent('#load')
            _this.marked = this.selectComponent('#marked')
            _this.load.show()
            Request.Ajax(Url.getProvince()).then(res => {
                _this.load.hide()
                _this.setData({
                    ['cityArray[0]']: res.table,
                    ['cityArray[1]']: res.table[0].data,
                    ['cityArray[2]']: res.table[0].data[0].data
                })
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        },
        /**
         * 改变picker的列
         * @method change
         */
        change(e) {
            let column = e.detail.column
            let value = e.detail.value;
            this.setData({
                ['cityIndex[' + column + ']']: value
            })
            if (column != 2) {

                let _this = this;
                let list;
                switch (column) {
                    case 0:
                        list = this.data.cityArray[0]
                        _this.setData({
                            ['cityArray[1]']: list[value].data,
                            ['cityArray[2]']: list[value].data[0].data,
                            // ['cityIndex[1]']: 0,
                            // ['cityIndex[2]']: 0
                        })
                        break
                    case 1:
                        list = this.data.cityArray[1]
                        _this.setData({
                            ['cityArray[2]']: list[value].data,
                            // ['cityIndex[2]']:0
                        })
                        break
                    default:
                        break
                }
            }
        },
        /**
         * 选择城市区域
         * @method changeVal
         * @param {Object} e picker组件信息
         */
        changeVal(e) {
            // console.log(e)
            var indexList = e.detail.value
            var ls = this.data.cityArray
            // console.log(ls)
            this.setData({
                city: ls[0][indexList[0]].name + '/' + ls[1][indexList[1]].name + '/' + ls[2][indexList[2]].name
            })
        },
        /**
         * 提货
         * @method pickShop
         */
        pickShop() {
            let _this = this
            if (_this.data.name == '' || _this.data.phone == '' || _this.data.city == '' || _this.data.address == '') {
                _this.marked.show({
                    mode: 'error',
                    msg: '请完整填写信息'
                })
                return
            }
            let address = _this.data.city.replace(/\//g, '') + _this.data.address
            let params = {
                'openid': getApp().globalData.openid,
                'ordid': _this.data.ordid,
                'Id': _this.data.shop.Id,
                'pickup_name': _this.data.name,
                'pickup_phone': _this.data.phone,
                'pickup_address': address
            }
            _this.load.show()
            Request.Ajax(Url.pickShop(), params, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'success',
                        msg: '提货成功'
                    })
                    _this.destory()
                    wx.navigateTo({
                        url: '/pages/my-pickShop/my-pickShop'
                    })
                } else {
                    _this.load.hide()
                    _this.marked.show({
                        mode: 'error',
                        msg: '提货失败'
                    })
                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })

        }
    }
})