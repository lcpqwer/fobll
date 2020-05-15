// pages/my-pickShop/my-pickShop.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pickList: [],
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
        // console.log(_this.data.allShop.state)
        if (_this.data.allShop.state == 'noMore') {
            _this.setData({
                ['allShop.state']: 'Loading'
            })
            // console.log(_this.data.allShop.state,'12')
            let data = {
                page: _this.data.allShop.page,
                openid: getApp().globalData.openid
            }
            Request.Ajax(Url.getGoodsShow(), data, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    if (res.data) {
                        let list = _this.data.allShop.list.concat(res.data)
                        // console.log(list)
                        let state = 'More';
                        if ((10 * _this.data.allShop.page) >= res.count) {
                            // console.log('1234444')
                            state = 'noMore'
                        }
                        _this.setData({
                            ['allShop.list']: list,
                            ['allShop.state']: state,
                            ['allShop.page']: _this.data.allShop.page + 1
                        })
                        // console.log(_this.data.allShop.state,'111111')
                    } else {
                        console.log('123')
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
    /**
     * 页面上拉触底事件的处理函数
     */
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
        app.okAcceptGoodsCallback = (index) => {
            console.log('确认收货',index)
            let pickList = this.data.allShop.list
            
            pickList[index].state = 2
            this.setData({
                ['allShop.list']: pickList
            })
            console.log('list', )
        }
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
        this.onLoad()
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})