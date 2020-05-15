// components/marked/marked.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        rootUrl: getApp().globalData.rootUrl,
        show: false,
        marked: {
            mode: 'error',
            msg: '网络连接失败，请检查网络重试'
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        show(marked){
            let _this = this;
            _this.setData({
                show:true
            })
            if (marked){
                _this.setData({
                    marked: marked
                })
            }
            _this.hide()
        },
        hide(){
            let _this = this;
            _this.timeOut = setTimeout(function(){
                _this.setData({
                    show: false,
                    marked: {
                        mode: 'error',
                        msg: '网络连接失败，请检查网络重试'
                    }
                })
            },1000)
        },
        nowHide(){
            let _this = this
            _this.setData({
                show: false,
                marked: {
                    mode: 'error',
                    msg: '网络连接失败，请检查网络重试'
                }
            })
            clearTimeout(_this.timeOut)
        }
    }
})
