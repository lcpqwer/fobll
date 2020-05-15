// pages/gift-detail/gift-detail.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gift: null,
        index: null,
        rootUrl: getApp().globalData.rootUrl
    },
    /**
     * 增加礼包数量
     * @method addOne
     * @param {Object} e 商品索引
     */
    addOne(e) {
        let _this = this
        let index = _this.data.index;
        let gift = _this.data.gift;
        let params = {
            "operation": "1",
            "openId": getApp().globalData.openid,
            "createTime": gift.create_time.toString()
        }
        _this.load.show()
        Request.Ajax(Url.delGift(), params, 'POST').then(res => {
            if (res.code == 200) {
                let last_num = gift.number + 1
                _this.setData({
                    ["gift.number"]: last_num
                })
                getApp().globalData.shop_car_gift[index].number = last_num
                _this.load.hide()
                let ls = getApp().globalData.add_car_list
                for (let i = 0; i<ls.length;i++){
                    if (ls[i] == 'gift'){
                        return
                    }
                }
                ls.push('gift')
                getApp().globalData.add_car_list = ls
                
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 减少礼包数量
     * @method addOne
     * @param {Object} e 商品索引
     */
    minusOne(e) {
        let _this = this
        let index = _this.data.index
        let gift = _this.data.gift
        let params = {
            "operation": "3",
            "openId": getApp().globalData.openid,
            "createTime": gift.create_time.toString()
        }
        _this.load.show()
        Request.Ajax(Url.delGift(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                let last_num = gift.number - 1
                _this.setData({
                    ["gift.number"]: last_num
                })
                getApp().globalData.shop_car_gift[index].number = last_num
                _this.load.hide()
                let ls = getApp().globalData.add_car_list
                for (let i = 0; i < ls.length; i++) {
                    if (ls[i] == 'gift') {
                        return
                    }
                }
                ls.push('gift')
                getApp().globalData.add_car_list = ls
            } else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let gift = JSON.parse(decodeURIComponent(options.gift))
        let index = parseInt(options.index)
        this.setData({
            gift: gift,
            index: index
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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