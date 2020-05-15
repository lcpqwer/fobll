// pages/shop-car/shop-car.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        nav: '6',
        userIdent: null
    },
    /**
     * 选择分类
     * @method chooseNav
     */
    chooseNav(e) {
        let that = this
        let nav = e.currentTarget.dataset.nav
        if (that.data.nav != nav) {
            if (this.data.del){
                
            }
            that.setData({
                nav: nav,
                del: false
            })
        }
        this.onShow()
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        
    },
    /**
     * 页面初始化
     */
    init(){
        let _this = this
        _this.setData({
            userIdent: getApp().globalData.userIdent
        })
        if (this.data.userIdent == 1) {
            _this.shop100 = _this.selectComponent('#shop100')
            _this.shop150 = _this.selectComponent('#shop150')
            _this.shop200 = _this.selectComponent('#shop200')
            _this.shop300 = _this.selectComponent('#shop300')
            _this.shop500 = _this.selectComponent('#shop500')
            _this.shopDiscount = _this.selectComponent('#shopDiscount')
            _this.shopGift = _this.selectComponent('#shopGift')
            switch (this.data.nav) {
                case '1':
                    _this.shop150.init()
                    break
                case '2':
                    _this.shop200.init()
                    break
                case '3':
                    _this.shop300.init()
                    break
                case '4':
                    _this.shop500.init()
                    break
                case '5':
                    _this.shopDiscount.init()
                    break
                case '6':
                    _this.shopGift.init()
                    break
                default:
                    _this.shop100.init()
                    break
            }
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        getApp().globalData.page = '/pages/shop-car/shop-car'
        let _this = this
        if (getApp().globalData.userIdent == -1) {
            getApp().wxAuthCallback = () => {
                _this.init()
            }
        }else {
            _this.init()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})