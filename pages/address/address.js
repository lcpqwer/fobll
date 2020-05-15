// pages/address/address.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: null,
        userIdent: null,
        rootUrl: getApp().globalData.rootUrl
    },
    /* 获取收货地址
     * @method getAddress
     * @param {Object} params 企业ID {eid: 1}
     */ 
    getAddress(){
        let _this = this
        let params = {
            eid: getApp().globalData.company.id
        }
        _this.load.show()
        Request.Ajax(Url.getAddress(),params,'POST').then(res => {
            console.log(res)
            if (res.code == 200){
                _this.setData({
                    address:res.data[0]
                })
                _this.load.hide()
            }else {
                _this.load.hide()
                _this.markd.show()
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.markd.show()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            userIdent: getApp().globalData.userIdent
        })
        if (this.data.userIdent == 1 || this.data.userIdent == 2){
            this.load = this.selectComponent('#load')
            this.markd = this.selectComponent('#marked')
            this.getAddress()
        }
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