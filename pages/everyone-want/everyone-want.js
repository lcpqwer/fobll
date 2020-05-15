// pages/everyone-want/everyone-want.js
var Request = require('../../utils/request.js')
var Url = require('../../utils/http.js')
import ShopCar from '../../utils/shopCar.js'
Array.prototype.delete = (index) => {
    let newArray = []
    for (let i = 0; i < this.length; i++) {
        if (i != index) {
            newArray.psuh(this[i])
        }
    }
    return newArray
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: null,
        allChecked: false,
        rootUrl: getApp().globalData.rootUrl,
        page: 1,
        state: 'More',
        seList: []
    },
    /* 单选 
     * @method choose
     * @param{Arrray} index [人员索引,商品索引]
     * @return {null} 
     */
    choose(e){
        let userIndex = e.detail.userIndex;
        let shopIndex = e.detail.index;
        let shop1 = this.data.list[userIndex].shopList[shopIndex]
        let flag = !shop1.checked;
        console.log(flag)
        let newli = 'list[' + userIndex + '].shopList['+shopIndex+'].checked';
        console.log(newli)
        this.setData({
            [newli]: flag
        })
        let seList = this.data.seList
        if (flag){
            let flag1 = false
            console.log(flag1)
            for (let j = 0; j < seList.length; j++) {
                if (seList[j].Id == shop1.Id) {
                    flag1 = true
                    break
                }
            }
            console.log(flag1)
            if (!flag1) {
                console.log('选择')
                seList.push(shop1)
            }
            this.setData({
                seList: seList
            })
            let ls1 = this.data.list
            for (let i=0; i<ls1.length;i++){
                let ls2 = ls1[i].shopList
                for (let j= 0; j < ls2.length; j++){
                    let shop = ls2[j];
                    if (!shop.checked){
                        return
                    }
                }
            }
            this.setData({
                allChecked: true
            })
        }else {
            for (let i=0;i<seList.length;i++){
                if (seList[i].Id == shop1.Id){
                    seList = seList.delete(i)
                    break
                }
            }
            this.setData({
                allChecked: false,
                seList: seList
            })
        }
    },
    /* 全选
     * @method allSelected
     * @param
     * @return {null}
     */
    allSelected(){
        let flag = !this.data.allChecked;
        this.setData({
            allChecked: flag
        })
        let ls1 = this.data.list
        for (let i = 0; i < ls1.length; i++) {
            let ls2 = ls1[i].shopList
            for (let j = 0; j < ls2.length; j++) {
                let shop = ls2[j];
                let newli = 'list[' + i + '].shopList[' + j + '].checked';
                this.setData({
                    [newli]: flag
                })
            }
            
        }
        if (flag){
            let seList = []
            let ls1 = this.data.list
            for (let i = 0; i < ls1.length; i++) {
                let ls2 = ls1[i].shopList
                seList = seList.concat(ls2)
            }
            this.setData({
                seList: seList
            })
        }else {
            this.setData({
                seList: []
            })
        }

    },
    /**
     * 获取一页大家想要
     */
    getWant(){
        let _this = this
        let page = _this.data.page
        let params = {
            eid: getApp().globalData.company.id,
            page: page
        }
        _this.setData({
            state: 'Loading'
        })
        Request.Ajax(Url.everyWant(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
                let state = 'More'
                let totalPage = Math.ceil(res.data.number / 5)
                if (totalPage <= page){
                    state = 'noMore'
                }
                let list
                if (page == 1){
                    list = res.data.dataList
                }else {
                    list = _this.data.list.concat(res.data.dataList)
                }
                _this.setData({
                    state: state,
                    page: page + 1,
                    list: list
                })
            }else {
                _this.setData({
                    state: 'Error'
                })
            }
        }).catch(res => {
            _this.setData({
                state: 'Error'
            })
        })
    },
    removal(ls) {
        let newArray = []
        let jsonArray = []
        for (let i = 0; i < ls.length; i++) {
            let obj = ls[i]
            let bId = obj['b.Id']
            delete obj['b.Id']
            let json = JSON.stringify(obj)
            if (jsonArray.indexOf(json) == -1) {
                obj['b.Id'] = bId
                newArray.push(obj)
                jsonArray.push(json)
            }
        }
        return newArray
    },
    /**
     * 添加购物车
     * @method addCar
     */
    addCar(){
        this.load = this.selectComponent('#load')
        this.marked = this.selectComponent('#marked')
        let _this = this
        let seList = this.data.seList
        console.log(this.data.seList)
        console.log(this.removal(seList))
        let create_time = new Date().getTime()
        let params = {
            openId: getApp().globalData.openid,
            shopList: seList,
            create_time: create_time,
        }
        _this.load.show()
        Request.Ajax(Url.wantToCar(), params, 'POST').then(res => {
            console.log(res)
            if (res.code == 200){
                _this.load.hide()
                _this.marked.show({
                    mode: 'success',
                    msg: '加入购物车成功'
                })
                _this.setData({
                    page: 1,
                    list: null
                })
                ShopCar.wantToCar(seList, create_time)
                _this.getWant()
            }else {
                _this.load.hide()
                _this.marked.show({
                    mode: 'error',
                    msg: '加入购物车失败'
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
        let userIdent = getApp().globalData.userIdent
        if (userIdent != 1){
            this.setData({
                lsit: []
            })
        }else {
            this.getWant()
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