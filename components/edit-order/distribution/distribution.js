// components/edit-order/distribution/distribution.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        nav: '0',
        show: false
    },
    create(){
        this.newAddress = this.selectComponent("#newAddress")
    },
    /**
     * 组件的方法列表
     */
    methods: {
        selected(e){
            this.setData({
                nav: e.currentTarget.dataset.nav
            })
            let data = {
                way: e.currentTarget.dataset.nav
            }
            this.triggerEvent('change', data)
            this.hide()
        },
        show(){
            this.setData({
                show: true
            })
        },
        hide(){
            this.setData({
                show: false
            })
        },
        newAddress(){
            this.hide()
            this.triggerEvent('newaddress')
        }
    }
})
