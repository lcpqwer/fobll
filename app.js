//app.js
import Config from './utils/config.js'
import Request from './utils/request.js'
import Url from './utils/http.js'
import ShopCar from './utils/shopCar.js'
Array.prototype.delete = (index) => {
    let newArray = []
    for (let i = 0; i < this.length; i++) {
        if (i != index) {
            newArray.psuh(this[i])
        }
    }
    return newArray
}
App({
    onLaunch: function() {
        // 检查更新
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                console.log('onCheckForUpdate====', res)
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    console.log('res.hasUpdate====')
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                console.log('success====', res)
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }

        // 获取设备信息
        let _this = this
        wx.getSystemInfo({
            success: function(res) {
                _this.globalData.screenWidth = res.screenWidth
            },
        })
        _this.setImg()
        /** 
         * 获取缓存中的openid
         */
        wx.getStorage({
            key: 'OpenId',
            success: res => {
                _this.globalData.openid = res.data
                // 检查授权
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {
                            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            wx.getUserInfo({
                                success: res => {
                                    console.log(res)
                                    // 可以将 res 发送给后台解码出 unionId
                                    _this.globalData.userInfo = res.userInfo
                                    _this.globalData.hasUserInfo = true
                                    let data = {
                                        'open_id': _this.globalData.openid,
                                        'nickName': _this.globalData.userInfo.nickName,
                                        'avatarUrl': _this.globalData.userInfo.avatarUrl
                                    }
                                    _this.globalData.userIdent = 0
                                    if (_this.userInfoReadyCallback) {
                                        _this.userInfoReadyCallback(res)
                                    }
                                    _this.wx_auth(data)

                                }
                            })
                        } else {
                            getApp().globalData.userIdent = -1
                            console.log('未授权')
                        }
                    }
                })
            },
            fail: () => {

            }
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
                _this.globalData.hasUserInfo = true
                if (res.msg != '个人用户') {
                    _this.globalData.company = {
                        name: res.data[0]['b.name'],
                        fee: res.data[0].fee,
                        id: res.data[0]['b.id']
                    };
                    _this.globalData.jwt = 'JWT ' + res.data[0].hash_auth;
                    _this.globalData.userIdent = res.data[0].type

                } else {
                    _this.globalData.userIdent = 0
                }
                if (_this.wxAuthCallback) {
                    _this.wxAuthCallback()
                }
            } else {
                // _this.globalData.userInfo = null
            }
        }).catch(res => {
            // _this.globalData.userInfo = null
        })
    },
    /**
     * 获取背景图
     * @methos setImg
     */
    setImg() {
        console.log()
        let _this = this
        Request.Get(Url.getSettingImg()).then(res => {
            console.log(res)
            if (res.code == 200) {
                this.globalData.imgs = res
                this.globalData.pickBack = res.background_img
                console.log(this.globalData.background_img)
                if (_this.homeBackCallback){
                    _this.homeBackCallback(res)
                }
                if (_this.pickBackCallback){
                    _this.pickBackCallback(res.background_img)
                }
            }
        }).catch(res => {

        })
    },
    /**
     * 全局变量
     */
    globalData: {
        imgs: null, // 福利、礼品图片
        banner: null,
        screenWidth: null, // 手机宽度
        rootUrl: Config.IMG, // 图标地址公共部分
        hasUserInfo: false, // 是否获取用户信息成功
        userIdent: -1, // 身份：0=>个人用户 1=>企业采购员工 2=>企业普通员工 -1=>未登录
        userInfo: null, // 用户微信信息（头像与昵称）
        jwt: null, // 用户jwt验证
        openid: null, // 用户微信openid
        company: null, // 公司信息
        greetingList: null, // 祝福语列表
        shop_car_100: [], // 购物车100.00商品数据
        shop_car_150: [], // 购物车150.00商品数据
        shop_car_200: [], // 购物车200.00商品数据
        shop_car_300: [], // 购物车300.00商品数据
        shop_car_500: [], // 购物车500.00商品数据
        shop_car_discount: [], // 购物车折扣商品数据
        shop_car_gift: [], // 购物车礼包数据
        shop_car_bool: {}, // 是否获取购物车数据
        add_car_list: [], // 加入购物车的类型 [100.00,150.00,200.00,300.00,500.00,discount,gift]
        addCar: (val, obj) => {
            ShopCar.add(val, obj)
        }, // 添加购物车
        placeOrder: false, //是否下单
        changeOrder: false,
        payBool: false,
        page: '',
        homeBack1: null,
        homeBack2: null,
        pickBack: null
    }
})