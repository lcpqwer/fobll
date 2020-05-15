// components/choose-shop/choose-shop.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shopList: Array,
        count: Number,
        date: Number,
        ordid: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: true,
        rootUrl: getApp().globalData.rootUrl,
        checkIndex: null,
        checkShop: null,
        pick: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        init(shopInfo){
            console.log(shiopInfo)
            this.setData({
                ...shopInfo
            })
        },
        show() {
            this.setData({
                show: true,
                pick: false
            })
        },
        hide() {
            this.setData({
                show: false
            })
        },
        checked(e) {
            this.setData({
                checkIndex: e.currentTarget.dataset.index,
                checkShop: this.data.shopList[e.currentTarget.dataset.index]
            })
        },
        pickShop() {
            if (this.data.checkShop) {
                this.hide()
                this.setData({
                    pick: true
                })
            }else {
                this.selectComponent('#marked').show({mode: 'error', msg: '请选择提货商品'})
            }
        },
        back(){
            this.hide()
            this.triggerEvent('back')
        },
        destory() {
            this.triggerEvent('destory')
        },
    }
})