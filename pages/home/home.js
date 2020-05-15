// pages/home/home.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        nav: '1',
        banners: null,
        rootUrl: app.globalData.rootUrl,
        discount: {
            list: [],
            page: 1,
            state: '',
            scrollTop: 0
        },
        allShop: {
            list: [],
            page: 1,
            state: '',
            scrollTop: 0
        },
        imgs: null
    },
    //banner详情
    bannerDetail: function (e) {
        wx.navigateTo({
            url: "/pages/activity-detail/activity-detail?Id=" + e.currentTarget.dataset.id,
        })
    },
    /* 切换商品页
     * @method changeNav
     * @param {Object} 传递的参数(nav) e.currentTarget.dataset.index
     */
    changeNav: function(e) {
        let nav = this.data.nav
        // 获取page节点
        let query = wx.createSelectorQuery()
        query.select('page').boundingClientRect()
        query.selectViewport().scrollOffset()
        let _this = this
        let index = e.currentTarget.dataset.index;
        if (index == this.data.nav) {
            return
        } else {
            switch (nav) {
                case '2':
                    query.exec(res => {
                        console.log(res[1].scrollTop)
                        _this.setData({
                            ['discount.scrollTop']: res[1].scrollTop
                        })
                    })
                    break
                case '3':
                    query.exec(res => {
                        console.log(res[1].scrollTop)
                        _this.setData({
                            ['allShop.scrollTop']: res[1].scrollTop
                        })
                    })
                    break
                default:
                    break

            }
            this.setData({
                nav: index
            })
            switch (index) {
                case '2':
                    wx.pageScrollTo({
                        scrollTop: _this.data.discount.scrollTop,
                        duration:0
                    })
                    if (this.data.discount.state != 'Loading' && this.data.discount.list.length < 1) {
                        this.getDiscount()
                    }
                    break
                case '3':
                    wx.pageScrollTo({
                        scrollTop: _this.data.allShop.scrollTop,
                        duration: 0
                    })
                    if (this.data.allShop.state != 'Loading' && this.data.allShop.list.length < 1) {
                        this.getAllShop()
                    }
                    break
                default:
                    break
            }
        }

    },
    /* 查看商品
     * @method shopList
     * @param {Object} 传递的参数(商品价格) e.currentTarget.dataset.price
     */
    shopList(e) {
        let price = e.currentTarget.dataset.price
        wx.navigateTo({
            url: '/pages/shop-list/shop-list?nav=' + this.data.nav + '&price=' + price,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /* 去申请
     * @method custom
     * @param {null}
     * @return {Null}
     */
    custom() {
        wx.navigateTo({
            url: '/pages/custom/custom',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    /* 获取wx授权的openid
     * @method getOpenid
     * @param {String}code wx.login获取的code
     * @return {Null}
     */
    getOpenid(code) {
        let _this = this
        let data = {
            wx_code: code
        }
        Request.Ajax(Url.getOpenid(), data, 'POST').then(res => {
            if (res.code === 200) {
                wx.setStorage({
                    key: 'OpenId',
                    data: res.data.openid,
                })
            }
            _this.load.hide()
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
        })
    },
    /* 微信登陆
     * @method wx_auth
     * @param {Object}data 用户信息 openid nickName 
     * @return {Null}
     */
    wx_auth(data) {
        let _this = this
        Request.Ajax(Url.auth(), data, 'POST').then(res => {
            if (res.code == 200) {
                console.log(res)
                app.globalData.hasUserInfo = true
                _this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: app.globalData.hasUserInfo,
                })
                if (res.msg != '个人用户') {
                    app.globalData.company = {
                        name: res.data[0]['b.name'],
                        fee: res.data[0].fee,
                        id: res.data[0]['b.id']
                    };
                    app.globalData.jwt = 'JWT ' + res.data[0].hash_auth;
                    app.globalData.userIdent = res.data[0].type
                    
                }else {
                    getApp().globalData.userIdent = 0
                }
                _this.userTop.init()
            } else {
                _this.marked.show()
                app.globalData.userInfo = null
            }
            _this.load.hide()
        }).catch(res => {
            _this.load.hide()
            _this.marked.show()
            app.globalData.userInfo = null
        })
    },
    /* 获取banners
     * @method getBanners
     */
    getBanners() {
        let _this = this
        Request.Ajax(Url.getBanners()).then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    banners: res.data
                })
            }
        })
    },
    /* 获取分页折扣商品
     * @method getDiscount
     */
    getDiscount() {
        let _this = this
        if (_this.data.discount.state = 'noMore') {
            _this.setData({
                ['discount.state']: 'Loading'
            })
            let data = {
                page: _this.data.discount.page
            }
            Request.Ajax(Url.getDiscount(), data, 'POST').then(res => {
                if (res.code == 200) {
                    if (res.data.res) {
                        let list = _this.data.discount.list.concat(res.data.res)
                        let state = 'More';
                        if ((10 * _this.data.discount.page) >= res.data.res1[0]['count(*)']) {
                            state = 'noMore'
                        }
                        _this.setData({
                            ['discount.list']: list,
                            ['discount.state']: state,
                            ['discount.page']: _this.data.discount.page + 1
                        })
                    } else {
                        _this.setData({
                            ['discount.state']: 'noMore'
                        })
                    }
                } else {
                    _this.setData({
                        ['discount.state']: 'Error'
                    })
                }
            }).catch(res => {
                _this.setData({
                    ['discount.state']: 'Error'
                })
            })
        }
    },
    /* 获取分页全部商品
     * @method getAllShop
     */
    getAllShop() {
        let _this = this
        if (_this.data.allShop.state = 'noMore') {
            _this.setData({
                ['allShop.state']: 'Loading'
            })
            let data = {
                page: _this.data.allShop.page
            }
            Request.Ajax(Url.getAllShop(), data, 'POST').then(res => {
                if (res.code == 200) {
                    if (res.data.res) {
                        let list = _this.data.allShop.list.concat(res.data.res)
                        console.log(list)
                        let state = 'More';
                        if ((10 * _this.data.allShop.page) >= res.data.res1[0]['count(*)']) {
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this

        // 获取banners
        _this.getBanners()
        _this.load = _this.selectComponent('#load')
        _this.marked = _this.selectComponent('#marked')
        _this.userTop = this.selectComponent('#userTop')
        // _this.load.show()
        if (!app.globalData.hasUserInfo) {
            app.userInfoReadyCallback = () => {
                _this.userTop.init()
            }
        }
        app.wxAuthCallback = () => {
            _this.userTop.init()
        }
        console.log(getApp().globalData.homeBack1)
        if (getApp().globalData.imgs){
            _this.setData({
                imgs: getApp().globalData.imgs
            })
        }else {
            app.homeBackCallback = (res) => {
                _this.setData({
                    imgs: res
                })
            }
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
        this.userTop = this.selectComponent('#userTop')
        this.userTop.init()
        app.globalData.page = '/pages/home/home'
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
        switch (this.data.nav) {
            case '2':
                if (this.data.discount.state != 'noMore') {
                    this.getDiscount()
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})