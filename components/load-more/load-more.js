// components/load-more/load-more.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        state: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        setState(val){
            this.setData({
                state: val
            })
        }
    }
})
