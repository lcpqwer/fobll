// components/shop_car_gift/item/item.js
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        gift: Object,
        index: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: app.globalData.rootUrl,
        imgs: [1,2,3,4],
        startX: 0,
        endx: 0,
        tran: 0,
        screenWidth: app.globalData.screenWidth
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 选择
         * @method choose
         */
        choose(){
            let data = {
                index: this.data.index
            }
            this.triggerEvent('select', data)
        },
        /**
         * 手指触摸
         * @method touchStart
         * @param {Object} e 滑动元素信息
         */
        touchStart(e) {
            // console.log('start', e)
            // console.log(this.data.screenWidth)
            let touch = e.touches[0]
            this.setData({
                startX: touch.clientX,
                endX: touch.clientX
            })
            this.triggerEvent('touchStart')
        },
        /**
         * 手指滑动中
         * @method touchMove
         * @param {Object} e 滑动元素信息
         */
        touchMove(e) {
            // console.log('move', e)
            let touch = e.touches[0]
            let moveX = touch.clientX - this.data.startX
            let tran = moveX / this.data.screenWidth * 750
            // console.log(tran)
            if (tran < 0) {
                if (tran > -120) {
                    this.setData({
                        endX: touch.clientX,
                        tran: tran
                    })
                } else {
                    this.setData({
                        tran: -120
                    })
                }

            } else {
                this.setData({
                    tran: 0
                })
            }

        },
        /**
         * 手指离开元素
         * @method touchEnd
         * @param {Object} e 元素信息
         */
        touchEnd(e) {
            // console.log('End', e)
            let touch = e.touches[0]
            // console.log(this.data.tran)
            if (this.data.tran < -60) {
                this.setData({
                    tran: -120
                })
                let data = {
                    index: this.data.index
                }
                this.triggerEvent('touchEnd', data)
            } else {
                this.setData({
                    tran: 0
                })
            }
        },
        /**
         * 删除礼包
         * @method delGift
         */
        delGift(){
            let data = {
                index: this.data.index
            }
            this.triggerEvent('delGift', data)
        },
        /**
         * 增加礼包数量
         * @method addOne
         */
        addOne(){
            let data = {
                index: this.data.index
            }
            this.triggerEvent('add', data)
        },
        /**
         * 减少礼包数量
         * @method addOne
         */
        minusOne(){
            if (this.data.gift.number == 1){
                this.selectComponent('#marked').show({
                    mode: 'error',
                    msg: '礼包数量不能在减少了'
                })
                return
            }
            let data = {
                index: this.data.index
            }
            this.triggerEvent('minus', data)
        },
        /**
         * 查看详情
         * @method toDetail
         */
        toDetail(){
            let json = encodeURIComponent(JSON.stringify(this.data.gift))
            wx.navigateTo({
                url: '/pages/gift-detail/gift-detail?gift='+json+'&index='+this.data.index,
            })
        },
        /**
         * 改变礼包数量
         * @method inputNumber
         */
        inputNumber(e){
            let val = e.detail.value
            if (val == ''){
                this.selectComponent('#marked').show({
                    mode: 'error',
                    msg: '礼包数量不能为空'
                })
                this.setData({
                    ['gift.number']: this.data.gift.number
                })
            }else if (val == 0){
                this.selectComponent('#marked').show({
                    mode: 'error',
                    msg: '礼包数量至少为1'
                })
                this.setData({
                    ['gift.number']: this.data.gift.number
                })
            } else if (val != this.data.gift.number){
                let data = {
                    index: this.data.index,
                    value: e.detail.value
                }
                this.triggerEvent('inputNumber', data)
            }
        },
    }
})
