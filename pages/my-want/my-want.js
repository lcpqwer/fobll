// pages/want/want.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
Array.prototype.delete = function (delIndex) {
    var temArray = [];
    for (var i = 0; i < this.length; i++) {
        if (i != delIndex) {
            temArray.push(this[i]);
        }
    }
    return temArray;
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopList: null,
        rootUrl: getApp().globalData.rootUrl,
        page: 1,
        state: 'More',
        totalPage: 1,
        delIndex: null
    },
    /**
     * 获取我的想要
     * @method getMyWant
     */
    getMyWant() {
        let _this = this
        let page = _this.data.page
        let params = {
            page: page
        }
        _this.setData({
            state: 'Loading'
        })
        Request.Ajax(Url.getMyWant(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                let totalPage = Math.ceil(res.data.num / 10)
                let state = 'More'
                let shopList
                if (page == 1) {
                    shopList = res.data.shopList
                } else {
                    shopList = this.data.shopList.concat(res.data.shopList)
                }
                if (totalPage <= page) {
                    state = 'noMore'
                }
                _this.setData({
                    shopList: shopList,
                    page: page + 1,
                    totalPage: totalPage,
                    state: state
                })
            } else {
                _this.setData({
                    state: 'Error',
                    page: page,
                })
            }
        }).catch(res => {
            _this.setData({
                state: 'Error',
                page: page
            })
        })
    },
    /**
     * 获取本页的最后一条
     * @method getMyOne
     */
    getMyOne() {
        let _this = this
        let page = _this.data.page-1
        let params = {
            page: page
        }
        Request.Ajax(Url.getMyWant(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                let totalPage = Math.ceil(res.data.num / 10)
                let state = 'More'
                let ls = res.data.shopList
                let shopList = _this.data.shopList
                shopList.push(ls[ls.length-1])
                if (totalPage <= page) {
                    state = 'noMore'
                }
                _this.setData({
                    shopList: shopList,
                    totalPage: totalPage,
                    state: state
                })
                _this.load.hide()
                _this.marked.show({
                    mode: 'success',
                    msg: '删除成功'
                })
            }
        }).catch(res => {
            _this.load.hide()
        })
    },
    /**
     * 获取大家想要
     * @method getEveryOneWant
     */
    getEveryOneWant() {
        let _this = this
        let page = _this.data.page
        let params = {
            page: page
        }
        _this.setData({
            state: 'Loading'
        })
        Request.Ajax(Url.getMyWant(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                let totalPage = Math.ceil(res.data.num / 10)
                let state = 'More'
                let shopList
                if (page == 1) {
                    shopList = res.data.shopList
                } else {
                    shopList = this.data.shopList.concat(res.data.shopList)
                }
                if (totalPage <= page) {
                    state = 'noMore'
                }
                _this.setData({
                    shopList: shopList,
                    page: page,
                    totalPage: totalPage,
                    state: state
                })
            } else {
                _this.setData({
                    state: 'Error',
                    page: page,
                })
            }
        }).catch(res => {
            _this.setData({
                state: 'Error',
                page: page
            })
        })
    },
    /**
     * 判断身份
     * @method checkUser
     */
    checkUser() {
        let userIdent = getApp().globalData.userIdent
        if (userIdent == 1) {
            // 采购
            this.getEveryOneWant()
        } else if (userIdent == 2) {
            // 普通
            this.getMyWant()
        } else {
            // 个人
            this.setData({
                shopList: []
            })
            // app.wantCallback = () => {
            //     this.checkUser()
            // }
        }
    },
    /**
     * 商品开始滑动
     * @method touchStart
     * @param {Object} e 元素信息
     */
    touchStart() {
        let delIndex = this.data.delIndex;
        if (delIndex) {
            // console.log(delIndex)
            let delShop = this.selectComponent('#' + delIndex)
            delShop.setData({
                tran: 0
            })
            this.setData({
                delIndex: null
            })
        }
    },
    /**
     * 商品滑动结束
     * @method touchEnd
     * @param {Object} e 商品id
     */
    touchEnd(e) {
        let shopId = e.detail.id;
        this.setData({
            delIndex: 'shop' + shopId
        })
    },
    /**
     * 删除想要
     * @method delWant
     */
    delWant(e){
        let _this = this
        console.log(e)
        let index = e.detail.index
        let params = {
            wid: _this.data.shopList[index].Id
        }
        _this.load.show()
        Request.Ajax(Url.delMyWant(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
                let shopList = _this.data.shopList
                shopList = shopList.delete(index)
                this.setData({
                    shopList: shopList
                })
                if (_this.data.state != "noMore"){
                    _this.getMyOne()
                }else {
                    _this.marked.show({
                        mode: 'success',
                        msg: '删除成功'
                    })
                    _this.load.hide()
                }
            }else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: '删除失败'
                })
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
        this.checkUser()
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
        if (this.data.state != 'Loading' && this.data.state != 'noMore' && this.data.page <= this.data.totalPage) {
            this.checkUser()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})