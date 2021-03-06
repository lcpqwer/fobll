// pages/activity-detail/activity-detail.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        active: null
    },
    sginUp(e) {
        console.log(this.data.active.data)
        wx.setStorage({
          data: this.data.active.data,
          key: 'sginUpMsg',
          success:function(){
            wx.navigateTo({
                url: "/pages/sgin-up/sgin-up",
            })
          }
        })
        
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        var _this = this 
        let data = {
            Id: options.Id,
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.activeDetail(), data, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
              _this.setData({
                active : res,
              })
            }else {
                if (res.msg){
                    let marked = {
                        mode: 'error',
                        msg: res.msg
                    }
                    // _this.marked.show(marked)
                }else {
                    // _this.marked.show()
                }
                
            }
        }).catch(res => {
            // _this.load.hide()
            // _this.marked.show()
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