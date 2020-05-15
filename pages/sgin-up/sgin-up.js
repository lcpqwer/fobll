// pages/sgin-up/sgin-up.js
// import AppAjax from '../../utils/request.js'
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        active: null,
        Id: '',
        name: '', // 姓名
        phone: '', // 手机号
        position: '', // 职位
        department: '', // 部门
        activeList: [],
    },
    input(e) {
        let self = this
        let type = e.currentTarget.dataset.type;
        switch (type) {
            case 'name':
                self.setData({
                    name: e.detail.value
                })
                break
            case 'department':
                self.setData({
                    department: e.detail.value
                })
                break
            case 'position':
                self.setData({
                    position: e.detail.value
                })
                break
            case 'phone':
                self.setData({
                    phone: e.detail.value
                })
                break
        }
    },
    submit() {
        var _this = this
        this.marked = _this.selectComponent('#marked')
        let data = {
            Id: _this.data.Id,
            name: _this.data.name,
            department: _this.data.department,
            position: _this.data.position,
            phone: _this.data.phone,
            openid: getApp().globalData.openid
        }
        if (_this.data.Id && _this.data.name != '' && _this.data.department != '' && _this.data.position != '' && _this.data.phone != '') {
            Request.Ajax(Url.addActiveDetail(), data, 'POST').then(res => {
                console.log(res)
                if (res.code == 200) {
                    _this.marked.show({
                        mode: 'success',
                        msg: '报名成功'
                    })
                    _this.setData({
                        name: '',
                        department: '',
                        position: '',
                        phone: '',
                        ['active.user_count']: _this.data.active.user_count + 1,
                        ['active.data.surplus_quota']: _this.data.active.data.surplus_quota - 1
                    })
                    let fee = getApp().globalData.company.fee
                    console.log(fee)
                    let newFee = parseFloat(fee) - parseFloat(_this.data.active.data.single_amount)
                    getApp().globalData.company.fee = newFee
                    this.selectComponent('#userTop').init()
                    console.log(newFee)
                } else {
                    _this.marked.show({
                        mode: 'error',
                        msg: res.msg
                    })
                }
            }).catch(res => {
                // _this.load.hide()
                _this.marked.show()
            })
        } else {
            _this.marked.show({
                mode: 'error',
                msg: '请完整填写信息'
            })
        }

    },
    addSgin() {
        let self = this
        console.log(self.data.name, self.data.department, self.data.position, self.data.phone)
        // AppAjax.appGet('tp/admin/index/hello').then(res => {
        //   console.log(res)
        // })
    },
    toDetail(e) {
        // let self = this
        // let index = e.currentTarget.dataset.index
        // let json = JSON.stringify(self.data.activeList[index])
        wx.navigateTo({
            url: "/pages/activity-detail/activity-detail?Id=" + e.currentTarget.dataset.id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        var _this = this
        console.log(options)
        let id = parseInt(options.id)
        wx.getStorage({
            key: 'sginUpMsg',
            success: function(e) {
                console.log(e.data)
                _this.setData({
                    Id: e.data.Id,
                })
                let data = {
                    Id: e.data.Id,
                    openid: getApp().globalData.openid
                }
                Request.Ajax(Url.activeDetail(), data, 'POST').then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        _this.setData({
                            active: res,
                        })
                    } else {
                        if (res.msg) {
                            let marked = {
                                mode: 'error',
                                msg: res.msg
                            }
                            // _this.marked.show(marked)
                        } else {
                            // _this.marked.show()
                        }

                    }
                }).catch(res => {
                    // _this.load.hide()
                    // _this.marked.show()
                })
            }
        })
        // console.log(options,this.data.info[0].time.split(' '))
        let data = {
            // page: '1',
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.getPartyShow(), data, 'POST').then(res => {
            console.log(res)
            if (res.code == 200) {
                _this.setData({
                    activeList: res.data,
                })
            } else {
                if (res.msg) {
                    let marked = {
                        mode: 'error',
                        msg: res.msg
                    }
                    // _this.marked.show(marked)
                } else {
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
        this.selectComponent('#userTop').init()
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