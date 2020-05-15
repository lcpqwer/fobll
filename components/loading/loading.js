// components/loading/loading.js
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
        show: false,
        mode: 'loading'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        show(){
            this.setData({
                show: true
            })
        },
        hide(){
            this.setData({
                show: false
            })
        }
    }
})
