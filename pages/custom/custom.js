// pages/custom/custom.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        name:'',
        brand:'',
        money:'',
        number:'',
        grant_time:'',
        contacts_name:'',
        contacts_phone:'',
        openid:'',
        date: '2016-09-01',
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            grant_time: e.detail.value
        })
    },
    inputName:function(event){
        this.setData({
            name:event.detail.value
        })
        // console.log(event.detail.value)
    },
    inputBrand:function(event){
        this.setData({
            brand:event.detail.value
        })
    },
    inputMoney:function(event){
        this.setData({
            money:event.detail.value
        })
    },
    inputNumber:function(event){
        this.setData({
            number:event.detail.value
        })
    },
    inputTime:function(event){
        this.setData({
            grant_time:event.detail.value
        })
    },
    inputPhone:function(event){
        this.setData({
            contacts_phone:event.detail.value
        })
    },
    inputConactName:function(event){
        this.setData({
            contacts_name:event.detail.value
        })
    },
    //提交
    submitForm:function(){
        // var _this = this
        if (this.data.money == '' || this.data.number == '' || this.data.grant_time == '' || this.data.contacts_name == '' || this.data.contacts_phone == ''){
            this.selectComponent('#marked').show({mode: 'error', msg: '请完整填写信息'})
            return
        } 
        let data1 = {
            name: this.data.name,
            brand: this.data.brand,
            money: this.data.money,
            number: this.data.number,
            grant_time: this.data.grant_time,
            contacts_name: this.data.contacts_name,
            contacts_phone: this.data.contacts_phone,
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.getAddNewGift(), data1, 'POST').then(res => {
            if (res.code == 200){
                wx.navigateTo({
                  url: '/pages/apply/apply'
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu()
        var dates = new Date()
        let m = dates.getMonth() + 1
        let d = dates.getDate()
        if (m<10){
            m = '0'+m
        }
        if (d < 10){
            d = '0' + d
        }
        this.setData({
            grant_time:dates.getFullYear() + "-" + m + "-" + d
        })
        var _this = this
        let data = {
            page: '1',
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.getGiftShowTabke(), data, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
            _this.setData({
                list : res.data
            })
            }else {
                if (res.msg){
                    let marked = {
                        mode: 'error',
                        msg: res.msg
                    }
                    _this.marked.show(marked)
                }else {
                    _this.marked.show()
                }
                
            }
        }).catch(res => {
            _this.load.hide()
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