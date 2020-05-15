// pages/apply/apply.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        discount: {
            list: [],
            page: 1,
            state: '',
            scrollTop: 0
        },
        allShop: {
            list: [],
            page: 1,
            state: 'noMore',
            scrollTop: 0
        },
        nav: '1'
    },

    getAllShop() {
        let _this = this
        console.log(_this.data.allShop.state)
        if (_this.data.allShop.state == 'noMore') {
            _this.setData({
                ['allShop.state']: 'Loading'
            })
            console.log(_this.data.allShop.state, '12')
            let data = {
                page: _this.data.allShop.page,
                openid: getApp().globalData.openid
            }
            Request.Ajax(Url.getGiftShowTabke(), data, 'POST').then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        let list = _this.data.allShop.list.concat(res.data)
                        console.log(list)
                        let state = 'More';
                        if ((10 * _this.data.allShop.page) >= res.count) {
                            state = 'noMore'
                        }
                        _this.setData({
                            ['allShop.list']: list,
                            ['allShop.state']: state,
                            ['allShop.page']: _this.data.allShop.page + 1
                        })
                    } else {
                        _this.setData({
                            ['allShop.state']: 'noMore'
                        })
                    }
                } else {
                    _this.setData({
                        ['allShop.state']: 'Error'
                    })
                }
            }).catch(res => {
                _this.setData({
                    ['allShop.state']: 'Error'
                })
            })
        }
    },
    onReachBottom: function() {
        switch (this.data.nav) {
            case '2':
                if (this.data.discount.state != 'noMore') {
                    this.getAllShop()
                }
                break
            case '3':
                if (this.data.allShop.state != 'noMore') {
                    this.getAllShop()
                }
                break
            default:
                break
        }
    },
    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        this.getAllShop()
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