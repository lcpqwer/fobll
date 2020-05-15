// pages/my-order/myorder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        nav: null
    },
    search(e){
        console.log(e.detail.value)
    },
    /**
     * 切换table
     * @method changeNav
     * @params {Object} e 元素信息
     */
    changeNav(e){
        this.setData({
            nav: e.currentTarget.dataset.nav
        })
        this.judgeNav()
    },
    /**
     * 判断nav
     * @method judgeNav
     */
    judgeNav(){
        switch(this.data.nav){
            case '0':
                this.allOrder.init()
                break
            case '1':
                this.noPayOrder.init()
                break
            case '2':
                this.noSendOrder.init()
                break
            case '3':
                this.hasSnedOrder.init()
                break
            case '4':
                this.noPickOrder.init()
                break
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.allOrder = this.selectComponent('#allOrder') // 全部订单组件
        this.noPayOrder = this.selectComponent('#noPayOrder') // 未付款订单组件
        this.noSendOrder = this.selectComponent('#noSendOrder') // 未发货订单组件
        this.hasSnedOrder = this.selectComponent('#hasSnedOrder') // 已发货订单组件
        this.noPickOrder = this.selectComponent('#noPickOrder') // 待提货订单组件
        this.setData({
            nav: options.nav
        })
        this.judgeNav()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})