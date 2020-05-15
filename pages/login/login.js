// pages/login/login.js
import Url from '../../utils/http.js'
import Request from '../../utils/request.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        account: '',
        password: ''
    },
    /* 跳转主页
     * @method toHome
     */
    toHome() {
        wx.switchTab({
            url: "/pages/home/home"
        })
    },
    /* 输入账号
     * @method inputAccount
     * @params {Object} e 账号 e.detail.value
     */
    inputAccount(e){
        this.setData({
            account: e.detail.value
        })
    },
    /* 输入密码
     * @method inputPassword
     * @params {Object} e 密码 e.detail.value
     */
    inputPassword(e) {
        this.setData({
            password: e.detail.value
        })
    },
    /* 输入密码
     * @method userLogin
     */
    userLogin(){
        let _this = this
        if (_this.data.account == '' || _this.data.password == ''){
            _this.selectComponent('#marked').show({mode: 'error', msg: '账号与密码不能为空'})
            return
        }
        _this.load.show()
        let data = {
            account: _this.data.account,
            password: _this.data.password,
            openid: getApp().globalData.openid
        }
        Request.Ajax(Url.userLogin(), data, 'POST').then(res => {
            _this.load.hide()
            console.log(res)
            if (res.code == 200){
                app.globalData.company = {
                    name: res.data[0]['b.name'],
                    id: res.data[0]['b.id'],
                    fee: res.data[0].fee
                }
                app.globalData.userIdent = res.data[0].type
                app.globalData.jwt = 'JWT ' + res.data[0].hash_auth
                _this.marked.show({mode: 'success', msg: '绑定成功'})
                setTimeout(()=>{
                    _this.toHome()
                },500)
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
    //注册
    resgiter(){
        wx.navigateTo({
          url: '../../pages/register/register',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.load = this.selectComponent('#load');
        this.marked = this.selectComponent('#marked');
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