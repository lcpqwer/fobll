// pages/shop-list/shop-list.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        url: null,
        price: null,
        state: '',
        shops: []
    },
    /* 获取该档次的商品
     * @method getShops
     * @param {price} 商品价格 
     */
    getShops() {
        let _this = this;
        _this.setData({
            state: 'Loading'
        })
        let params = {
            price: _this.data.price,
            page: _this.data.page
        };
        console.log(params)
        Request.Ajax(_this.data.url, params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                if (res.data.res) {
                    let list = _this.data.shops.concat(res.data.res)
                    let state = 'More';
                    if ((10 * _this.data.page) >= res.data.res1[0]['count(*)']) {
                        state = 'noMore'
                    }
                    _this.setData({
                        shops: list,
                        state: state,
                        page: _this.data.page + 1
                    })
                } else {
                    _this.setData({
                        state: 'noMore'
                    })
                }
            } else {
                _this.setData({
                    state: 'Error'
                })
            }
        }).catch(res => {
            console.log(res)
            _this.marked.show()
            _this.setData({
                state: 'Error'
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let title;
        this.setData({
            price: options.price,
            nav: options.nav
        })
        console.log(this.data.price)
        switch (options.nav) {
            case '0':
                title = '礼品采购' + options.price + '好礼'
                this.setData({
                    url: Url.getPrensentShop()
                })
                break
            default:
                this.setData({
                    url: Url.getWealShop()
                })
                title = '福利采购' + options.price + '好礼'
                break
        }
        this.setData({
            title: title
        })
        wx.setNavigationBarTitle({
            title: title,
        })
        this.getShops()
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
        if (this.data.state != 'noMore') {
            this.getShops()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: this.data.title,
            path: '/pages/shop-list/shop-list?price='+this.data.price+'&nav='+this.data.nav
        }
    }
})