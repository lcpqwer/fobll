// components/edit-order/invoice/look-up/look-up.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        titleList: Array,
        type: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        show: false,
        nav: null,
        edit: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 
         */
        show() {
            this.setData({
                show: true
            })
            console.log(this.data.titleList, this.data.type)
        },
        hide() {
            this.setData({
                show: false
            })
        },
        confirm(e){
            console.log(e)
            let index = e.currentTarget.dataset.index;
            let list = this.data.titleList
            let data = {
                title: list[parseInt(index)]
            }
            this.setData({
                nav: index
            })
            this.triggerEvent('confirm', data) 
        },
        back(){
            this.hide()
            this.triggerEvent('back')
        },
        add(){
            this.setData({
                edit: true
            })
            this.hide()
        },
        /**
         * 编辑抬头
         */
        edit(e){
            let index = e.currentTarget.dataset.index
            this.setData({
                edit: true
            })
            this.hide()
            this.selectComponent('#edit').init(this.data.titleList[index], index)
        },
        /**
         * 取消添加抬头
         * @method cancelAdd
         */
        cancelAdd(){
            this.setData({
                edit: false
            })
            this.show()
        },
        /**
         * 添加抬头
         * @method addOne
         */
        addOne(e){
            let params = e.detail.params
            let data = {
                params: params
            }
            this.triggerEvent('addOne', data)
        },
        /**
         * 修改抬头
         * @method updateOne
         */
        updateOne(e) {
            let params = e.detail.params
            let data = {
                params: params,
                index: e.detail.index
            }
            this.triggerEvent('updateOne', data)
        },
    }
})