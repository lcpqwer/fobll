// components/shop-car-item/shop-car-item.js
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shop: Object,
        index: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: app.globalData.rootUrl,
        showImg: false,
        startX: 0,
        endX: 0,
        tran: 0,
        screenWidth: app.globalData.screenWidth
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 选择
         * @method
         */
        choose() {
            let data = {
                index: this.data.index
            }
            this.triggerEvent('select', data)
        },
        /**
         * 显示图片
         * @method showImg
         */
        showImg() {
            let that = this
            // setTimeout(function(){
            that.setData({
                showImg: true
            })
            // },100)
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
            let tran = moveX/this.data.screenWidth*750
            // console.log(tran)
            if (tran < 0) {
                if (tran > -120){
                    this.setData({
                        endX: touch.clientX,
                        tran: tran
                    })
                }else {
                    this.setData({
                        tran: -120
                    })
                }
                
            }else {
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
            if (this.data.tran < -60){
                this.setData({
                    tran: -120
                })
                let data = {
                    id: this.data.shop.shopId
                }
                this.triggerEvent('touchEnd', data)
            }else {
                this.setData({
                    tran: 0
                })
            }
        },
        /**
         * 删除购物车
         * @method delShop
         */
        delShop(){
            let data = {
                index: this.data.index,
                shop: this.data.shop
            }
            this.triggerEvent('delShop', data)
        },
        /**
         * 查看详情
         * @method toDetail
         */
        toDetail(){
            console.log('tap')
            this.setData({
                tran: 0
            })
        }
    }
})