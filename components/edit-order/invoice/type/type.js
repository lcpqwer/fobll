// components/edit-order/invoice/type/type.js
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
        nav: null,
        rootUrl: getApp().globalData.rootUrl
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
        },
        changeNav(e){
            this.setData({
                nav: e.currentTarget.dataset.nav
            })
        },
        back(){
            this.hide()
            this.triggerEvent('back') 
        },
        confirm(){
            let data = {
                nav: this.data.nav
            }
            this.hide()
            this.triggerEvent('confirm', data) 
        }
    }
})
