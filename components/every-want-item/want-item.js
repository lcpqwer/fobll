// components/shop-car-item/shop-car-item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shop: Object,
        index: Number,
        userIndex: {
            type: Number,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        showImg: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        choose() {
            // console.log(this.data.chooseBool)
            // this.setData({ chooseBool: !this.data.chooseBool })
            let data = {
                index: this.data.index
            }
            console.log(this.data)
            if (this.data.userIndex !== null) {
                data.userIndex = this.data.userIndex
            }
            console.log(data)
            this.triggerEvent('choose', data)
        },
        showImg() {
            let that = this
            // setTimeout(function(){
            that.setData({
                showImg: true
            })
            // },100)

        }
    }
})