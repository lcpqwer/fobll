// components/edit-order/new-address/new-address.js
import Request from '../../../utils/request.js'
import Url from '../../../utils/http.js'
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
        show: false,
        cityIndex: [0, 0, 0],
        cityArray: [
            [],
            [],
            []
        ],
        // 地址信息填写
        name: '', // 联系人
        phone: '', // 联系电话
        ubranAreas: '请选择城市区域', // 城市区域
        addressDetail: '', // 详细地址
    },
    // attached(){
    //     console.log('111')
    // },
    created() {
        this.getProvince()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 显示
         */
        show() {
            this.setData({
                show: true
            })
        },
        /**
         * 隐藏
         */
        hide() {
            this.setData({
                show: false
            })
            this.setData({
                name: '',
                phone: '',
                ubranAreas: '请选择城市区域', // 城市区域
                addressDetail: '' // 详细地址
            })
            // this.triggerEvent('hide')
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
                ubranAreas: ls[0][indexList[0]].name + '/' + ls[1][indexList[1]].name + '/' + ls[2][indexList[2]].name
            })
        },
        /**
         * 输入
         * @method inputVal
         */
        inputVal(e) {
            // console.log(e)
            let type = e.currentTarget.dataset.type;
            let val = e.detail.value
            switch (type) {
                case '0':
                    this.setData({
                        name: val
                    })
                    break
                case '1':
                    this.setData({
                        phone: val
                    })
                    break
                default:
                    this.setData({
                        addressDetail: val
                    })
            }
        },
        /**
         * 确认使用新地址
         * @methode confirm
         */
        confirm() {
            let address = this.data.ubranAreas.replace(/\//g, '') + this.data.addressDetail
            let data = {
                name: this.data.name,
                phone: this.data.phone,
                address: address
            }
            console.log(data)
            this.hide()
            this.triggerEvent('confirm', data)
        }
    }
})