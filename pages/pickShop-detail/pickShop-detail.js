// pages/pickShop-detail/pickShop-detail.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app =getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        pickItem: {},
        endTime: '',
        goodsId: '',
        index: null
    },
    //确认收货
    okAcceptGoods: function() {
        let data = {
            Id: this.data.pickItem.Id,
            openid: getApp().globalData.openid
        }

        Request.Ajax(Url.okAcceptGoodsDeatail(), data, 'POST').then(res => {
            let data = {
                Id: this.data.pickItem.Id,
                openid: getApp().globalData.openid
            }
            Request.Ajax(Url.getGoodsShowDeatail(), data, 'POST').then(res => {
                if (res.code == 200) {
                    this.setData({
                        pickItem: res.data,
                    })
                    app.okAcceptGoodsCallback(this.data.index)
                } else {
                    if (res.msg) {
                        let marked = {
                            mode: 'error',
                            msg: res.msg
                        }
                        this.marked.show(marked)
                    } else {
                        this.marked.show()
                    }

                }
            }).catch(res => {
                _this.load.hide()
                _this.marked.show()
            })
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    //提醒发货
    warnGoods() {
        var _this = this
        let data1 = {
            Id: _this.data.pickItem.Id,
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.warngoods(), data1, 'POST').then(res => {
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1500
            })
        }).catch(res => {
            // _this.load.hide()
            // _this.marked.show()
        })
    },
    //查看物流
    checkMesg: function() {
        wx.navigateTo({
            url: '/pages/logistics/logistics?com=' + this.data.pickItem.courier_code + '&num=' + this.data.pickItem.courier_number + '&comChina=' + this.data.pickItem.courier_company,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        // console.log(options.Id)
        var _this = this
        let data = {
            Id: options.Id,
            openid: getApp().globalData.openid
        }
        _this.setData({
            index: parseInt(options.index)
        })
        Request.Ajax(Url.getGoodsShowDeatail(), data, 'POST').then(res => {
            console.log(res)
            if (res.data.state == 1 || res.data.state == 3) {
                var date = new Date(res.data.ordtime.replace(/\-/g, "\/"))
                let startTime = new Date() // 开始时间
                let endTime = new Date(date.setDate(date.getDate() + 7)) // 结束时间
                let usedTime = endTime - startTime // 相差的毫秒数
                // 计算出天数
                let days = Math.floor(usedTime / (24 * 3600 * 1000))
                let leavel = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的时间
                // 计算剩余的小时数
                let hours = Math.floor(leavel / (3600 * 1000))
                var endTimes = days + '天' + hours + '小时'
            }
            if (res.code == 200) {
                _this.setData({
                    pickItem: res.data,
                    endTime: endTimes,
                    goodsId: options.Id
                })
            } else {
                if (res.msg) {
                    let marked = {
                        mode: 'error',
                        msg: res.msg
                    }
                    _this.marked.show(marked)
                } else {
                    _this.marked.show()
                }

            }
        }).catch(res => {
            _this.marked.show()
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