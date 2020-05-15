// components/widthFix-image/widthFix-image.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        state: String,
        src: String,
        mode: String,
        height: {
            type: String,
            value: ''
        },

    },

    /**
     * 组件的初始数据
     */
    data: {
        showImg: false,
        rootUrl: getApp().globalData.rootUrl
    },
    // ready(){
    //     console.log(this.data.src)
    //     console.log(this.data.state)
    // },
    /**
     * 组件的方法列表
     */
    methods: {
        showImg() {
            this.setData({
                showImg: true
            })
        }
    }
})