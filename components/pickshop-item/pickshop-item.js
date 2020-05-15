// components/pickshop-item/pickshop-item.js
import Request from '../../utils/request.js'
import Url from '../../utils/http.js'
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pickItem: Object,
        index: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        showImg: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showImg() {
            this.setData({
                showImg: true
            })
        },
        toDetail(e) {
            // console.log(e.currentTarget.dataset.id)
            wx.navigateTo({
                url: '/pages/pickShop-detail/pickShop-detail?Id=' + e.currentTarget.dataset.id + '&index=' + this.data.index,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
        },
        //确认收货
        okAcceptGoods: function() {
            let _this = this
            _this.load = _this.selectComponent('#load')
            _this.marked = _this.selectComponent('#marked')
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
        }
    }
})