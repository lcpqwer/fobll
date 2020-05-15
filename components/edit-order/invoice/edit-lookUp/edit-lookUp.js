// components/edit-order/invoice/edit-lookUp/edit-lookUp.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        rootUrl: getApp().globalData.rootUrl,
        // 抬头数据
        defaultData: {
            defaults: 0, // 是否默认
            eid: '', // 企业id
            invoce_bank: "", // 开户银行
            invoce_bankaccount: "", // 银行账号
            invoice_address: "", // 企业地址
            invoice_rise: "", // 抬头名称
            taxnumber: "", // 税号
            enterprise_phone: "" // 企业电话
        },
        update: false,
        updateIndex: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 隐藏
         * @method cancel
         */
        cancel() {
            this.triggerEvent('cancel')
        },
        /**
         * 输入
         * @method inputVal
         * @param {Object} e 元素信息
         */
        inputVal(e) {
            let nav = e.currentTarget.dataset.nav
            let val = e.detail.value
            switch (nav) {
                case '0': // 名称 
                    this.setData({
                        ['defaultData.invoice_rise']: val
                    })
                    break
                case '1': // 税号
                    this.setData({
                        ['defaultData.taxnumber']: val
                    })
                    break
                case '2': // 开户银行
                    this.setData({
                        ['defaultData.invoce_bank']: val
                    })
                    break
                case '3': // 银行账号
                    this.setData({
                        ['defaultData.invoce_bankaccount']: val
                    })
                    break
                case '4': // 企业地址
                    this.setData({
                        ['defaultData.invoice_address']: val
                    })
                    break
                case '5': // 企业电话
                    this.setData({
                        ['defaultData.enterprise_phone']: val
                    })
                    break
                default:
                    break
            }
        },
        /**
         * 确认添加抬头
         * @method confirm
         */
        confirm() {
            let params = this.data.defaultData
            params.eid = getApp().globalData.company.id
            params.type = this.data.type
            let data = {
                params: params
            }
            if (this.data.update){
                data.index = this.data.updateIndex
                this.triggerEvent('update', data)
            }else {
                this.triggerEvent('confirm', data)
            }
            
        },
        init(defaultData, updateIndex){
            this.setData({
                defaultData: defaultData,
                update: true,
                updateIndex
            })
        }
    }
})