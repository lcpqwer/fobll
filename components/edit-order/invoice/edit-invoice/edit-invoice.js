// components/invoice/eidt-invoice/edit-invoice.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        invoice: Object,
        titleList: Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: true,
        rootUrl: getApp().globalData.rootUrl,
        iType: '0',
        lType: '0',
        lookUp: '抬头名称',
        def: false
    },
    created(){
        console.log(this.data.invoice)
        console.log('创建')
        this.inType = this.selectComponent('#in-type')
        this.lookUpName = this.selectComponent('#look-up-name')
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 关闭
         * @method destory
         */
        destory(){
            this.triggerEvent('destory') 
        },
        /**
         * 选择发票类型
         * @method chooseiType
         */
        chooseiType(){
            this.hide()
            this.inType.changeNav({currentTarget: {dataset: {nav: this.data.invoice.type}}})
            this.inType.show()
        },
         /**
         * 关闭子页面展示
         * @method show
         */
        show(){
            this.setData({
                show: true
            })
        },
        /**
         * 隐藏单不关闭
         * @method hide
         */
        hide(){
            this.setData({
                show: false
            })
        },
        /**
         * 选定发票类型
         * @method changeiType
         */
        changeiType(e){
            this.setData({
                ['invoice.type']: e.detail.nav
            })
            this.show()
        },
        /**
         * 选定抬头类型
         * @method changeLtype
         */
        changeLtype(e){
            this.setData({
                ['invoice.title']: {
                    type: parseInt(e.currentTarget.dataset.ltype),
                    invoice_rise: ''
                }
            })
        },
        /**
         * 选择抬头
         * @method lookUpShow
         */
        lookUpShow(){
            this.hide()
            this.lookUpName.show()
        },
        /**
         * 选定抬头
         * @method changeLookUpName
         */
        changeLookUpName(e){
            console.log(e)
            this.setData({
                ['invoice.title']: e.detail.title
            })
            this.lookUpName.hide()
            this.show()
        },
        /**
         * 添加抬头
         */
        addOne(e){
            let data = {
                params: e.detail.params
            }
            this.triggerEvent('addOne', data)
        },
        /**
         * 修改抬头
         * @method updateOne
         */
        updateOne(e){
            let data = {
                params: e.detail.params,
                index: e.detail.index
            }
            this.triggerEvent('updateOne', data)
        },
        /**
         * 不开具发票
         * @method noInvoice
         */
        noInvoice(){
            this.triggerEvent('noInvoice')
        },
        /**
         * 开具发票
         * @method openInvoice
         */
        openInvoice(){
            let data = {
                invoice: this.data.invoice
            }
            this.triggerEvent('openInvoice', data)
        }
    }
})