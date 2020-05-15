// pages/fee-detail/fee-detail.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       detail: {
           increase: 0,
           decrease: 0
       } 
    },
    /* 获取会费清单与规则
     * @method getFeeDetail
     * @param {Object} params 企业名称 {eid:1}
     */
    getFeeDetail(params){
        let _this = this;
        _this.load.show()
        Request.Ajax(Url.getFeeDetail(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
                _this.setData({
                    ['detail.increase']: res.data.increase,
                    ['detail.decrease']: res.data.decrease
                })
                _this.load.hide()
            }else {
                _this.load.hide()
                _this.marked.show()
            }
        }).catch(res => {
            console.log(res)
            _this.load.hide()
            _this.marked.show()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        let params = {
            eid: getApp().globalData.company.id
        }
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        this.getFeeDetail(params)
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
        this.userTop = this.selectComponent('#userTop')
        this.userTop.init()
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