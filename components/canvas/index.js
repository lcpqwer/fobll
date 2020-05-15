// canvas/index.js
var app = getApp()
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
        bgImgPath: '/components/canvas/img/one.png',
        order: null,
        img: '',
        imgs: [],
        show: false
    },
    // 在组件完全初始化完毕、进入页面节点树后
    /**
     * 组件的方法列表
     */
    methods: {
        hide(){
            this.triggerEvent('hide')
        },
        loading(order){
            let that = this
            this.load = this.selectComponent('#load')
            that.setData({
                order: order
            })
            this.load.show()
            wx.request({
                url: 'https://fobll.cn/fobll-api/api/getcode',
                // url: 'http://192.168.8.107:5000/api/getcode',
                data: {
                    scene: '1'
                },
                header: {},
                method: 'POST',
                dataType: 'json',
                responseType: 'arraybuffer',
                success: function (res) {
                    console.log(res)
                    // return
                    console.log(wx.arrayBufferToBase64(res.data))
                    that.setData({
                        img: 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
                    })
                    that.downImg()

                    // that.downImg()
                },
                fail: function (res) {
                    console.log(res)
                },
                complete: function (res) { },
            })
        },
        init() {
            let that = this
            wx.getSystemInfo({
                success: function(res) {
                    console.log(res)
                    let canvasW = Math.round(res.screenWidth * 0.6)
                    let height = Math.round(res.screenHeight)
                    let canvasH = 10
                    that.setData({
                        pixelRatio: res.pixelRatio, // 图片像素比
                        canvasW,
                        canvasH,
                        height
                    })
                    that.writeCanvas()
                    // that.writeCanvas() // 暂时在此执行
                }
            })
            // return
        },
        // 生成临时文件
        downImg() {
            let that = this
            let imgs = that.data.order.shopInfo
            let number = imgs.length
            switch (number) {
                case 1:
                    Promise.all([that.downFile(imgs[0].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
                case 2:
                    Promise.all([that.downFile(imgs[0].order_img), that.downFile(imgs[1].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath, res[1].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
                case 3:
                    Promise.all([that.downFile(imgs[0].order_img), that.downFile(imgs[1].order_img), that.downFile(imgs[2].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath, res[1].tempFilePath, res[2].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
                case 4:
                    Promise.all([that.downFile(imgs[0].order_img), that.downFile(imgs[1].order_img), that.downFile(imgs[2].order_img), that.downFile(imgs[3].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath, res[1].tempFilePath, res[2].tempFilePath, res[3].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
                case 5:
                    Promise.all([that.downFile(imgs[0].order_img), that.downFile(imgs[1].order_img), that.downFile(imgs[2].order_img), that.downFile(imgs[3].order_img), that.downFile(imgs[4].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath, res[1].tempFilePath, res[2].tempFilePath, res[3].tempFilePath, res[4].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
                case 6:
                    Promise.all([that.downFile(imgs[0].order_img), that.downFile(imgs[1].order_img), that.downFile(imgs[2].order_img), that.downFile(imgs[3].order_img), that.downFile(imgs[4].order_img), that.downFile(imgs[5].order_img)]).then(res => {
                        console.log(res)
                        that.setData({
                            imgs: [res[0].tempFilePath, res[1].tempFilePath, res[2].tempFilePath, res[3].tempFilePath, res[4].tempFilePath, res[5].tempFilePath]
                        })
                        that.init()
                    }).catch(res => {
                        console.log('失败')
                    })
                    break
            }
        },
        // 生成临时文件
        downFile(url) {
            let timeStamp = new Date().getTime()
            url = url + '?t=' + timeStamp
            // url = url.replace("https:", "http:")
            console.log(url)
            return new Promise((resolve, reject) => {
                wx.downloadFile({
                    url: url,
                    success(res) {
                        console.log(res)
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            resolve(res)
                        }
                    },
                    fail(res) {
                        reject(res)
                    },
                    complete() {
                        console.log('complete')
                    }
                })
            })
        },
        // 删除临时文件
        delFile(url) {
            return new Promise((resolve, reject) => {
                wx.removeSavedFile({
                    filePath: url,
                    success: function(res) {
                        console.log(res)
                        resolve(res)
                    },
                    fail: function(res) {
                        reject(res)
                    }
                })
            })
        },
        // 绘制canvas
        writeCanvas() {
            let that = this
            const ctx = wx.createCanvasContext('myCanvas', that)
            let imgs = that.data.imgs
            let canvasW = that.data.canvasW
            let canvasH = that.data.canvasH
            let w
            ctx.drawImage('/components/canvas/img/back.png', 10, 10, canvasW, that.data.height)
            switch (imgs.length) {
                case 1:
                    console.log('canvas img')
                    ctx.drawImage(imgs[0], 10, 10, canvasW, canvasW)
                    canvasH += canvasW
                    break
                case 2:
                    w = canvasW / 2 - 2
                    ctx.drawImage(imgs[0], 10, 10, w, w)
                    ctx.drawImage(imgs[1], w + 4+10, 10, w, w)
                    canvasH += w
                    break
                case 3:
                    w = canvasW / 2 - 2
                    ctx.drawImage(imgs[0], (canvasW - w) / 2+10, 10, w, w)
                    ctx.drawImage(imgs[1], 10, w + 4+10, w, w)
                    ctx.drawImage(imgs[2], w + 4+10, w + 4+10, w, w)
                    canvasH += canvasW
                    break
                case 4:
                    w = canvasW / 2 - 2
                    ctx.drawImage(imgs[0], 10, 10, w, w)
                    ctx.drawImage(imgs[1], w + 4+10, 10, w, w)
                    ctx.drawImage(imgs[2], 10, w + 4+10, w, w)
                    ctx.drawImage(imgs[3], w + 4+10, w + 4+10, w, w)
                    canvasH += canvasW
                    break
                case 5:
                    w = canvasW / 3 - 2
                    ctx.drawImage(imgs[0], (canvasW - w * 2 - 3) / 2+10, 10, w, w)
                    ctx.drawImage(imgs[1], (canvasW - w * 2 - 3) / 2 + w + 3+10, 10, w, w)
                    ctx.drawImage(imgs[2], 10, w + 3+10, w, w)
                    ctx.drawImage(imgs[3], w + 3+10, w + 3+10, w, w)
                    ctx.drawImage(imgs[3], 2 * w + 6+10, w + 3+10, w, w)
                    canvasH += w + w + 3
                    break
                case 6:
                    w = canvasW / 3 - 2
                    ctx.drawImage(imgs[0], 10, 10, w, w)
                    ctx.drawImage(imgs[1], w + 3+10, 10, w, w)
                    ctx.drawImage(imgs[2], 2 * w + 6+10, 10, w, w)
                    ctx.drawImage(imgs[3], 10, w + 3+10, w, w)
                    ctx.drawImage(imgs[4], w + 3+10, w + 3+10, w, w)
                    ctx.drawImage(imgs[5], 2 * w + 6+10, w + 3+10, w, w)
                    canvasH += w + w + 3
                    break
            }
            let str1 = that.data.order.blessing
            let strList1 = that.strToList1(str1)
            canvasH += that.computedPercent(15)
            for (let i = 0; i < strList1.length; i++) {
                canvasH += that.computedPercent(25)
                ctx.textAlign = 'left'
                ctx.setFontSize(that.computedPercent(15))
                // ctx.font = 'normal ' + that.computedPercent(15) + 'px sans-serif'
                ctx.setFillStyle('#353535')
                ctx.fillText(strList1[i], that.computedPercent(9)+10, canvasH - 2)
            }
            // 提货码 start
            canvasH += that.computedPercent(50)
            ctx.textAlign = 'center'
            ctx.setFontSize = that.computedPercent(25)
            // ctx.font = 'normal bold' + that.computedPercent(15) + 'px Arial, sans-serif'
            ctx.fillText('提货码：' + that.data.order.pickup_number, canvasW / 2+10, canvasH - 0.5);
            ctx.fillText('提货码：' + that.data.order.pickup_number, canvasW / 2 - 0.5+10, canvasH);
            ctx.setFillStyle('#353535')
            ctx.fillText('提货码：' + that.data.order.pickup_number, canvasW / 2+10, canvasH)
            // 提货码 end
            // 注意事项1 start
            canvasH += that.computedPercent(15)
            ctx.drawImage('./img/one.png', that.computedPercent(57)+10, canvasH, that.computedPercent(260), that.computedPercent(35))
            canvasH += that.computedPercent(30)
            // 注意事项1 end
            // 小程序码 start
            canvasH += that.computedPercent(30)
            ctx.drawImage('/components/canvas/img/two.png', that.computedPercent(130)+10, canvasH, that.computedPercent(220), that.computedPercent(120))
            let num = Math.random();
            let filePath = wx.env.USER_DATA_PATH + '/png' + num + '.png'
            wx.getFileSystemManager().writeFile({
                filePath: filePath,
                data: that.data.img.slice(22),
                encoding: 'base64',
                success: res => {
                    console.log(res)
                    ctx.drawImage(filePath, that.computedPercent(10)+10, canvasH, that.computedPercent(120), that.computedPercent(120))
                    canvasH += that.computedPercent(120)
                    that.setData({
                        canvasH,
                        show: true
                    })
                    ctx.draw()
                    that.load.hide()
                },
                fail: res => {
                    console.log('error')
                }
            })
            // 小程序码 end

        },
        computedPercent(value) {
            let currentWidth = this.data.canvasW
            let oldWidth = 374
            return Math.floor(value * currentWidth / oldWidth)
        },
        strToList2(s) {
            if (s.length < 26) {
                var  rs = [];
                rs[0] = s;
                return rs
            } else {
                var reg = /.{26}/g;
                var rs = s.match(reg); //注意如果s的长度小于4,那么rs=null
                rs.push(s.substring(rs.join('').length));
                return rs
            }
        },
        strToList1(s) {
            if (s.length < 22) {
                var  rs = [];
                rs[0] = s;
                return rs
            } else {
                var reg = /.{22}/g;
                var rs = s.match(reg); //注意如果s的长度小于4,那么rs=null
                rs.push(s.substring(rs.join('').length));
                return rs
            }
        },
        // 保存图片
        save() {
            let that = this
            wx.canvasToTempFilePath({
                x: 0, // 起点横坐标
                y: 0, // 起点纵坐标
                width: that.data.canvasW, // canvas 当前的宽
                height: that.data.canvasH, // canvas 当前的高
                destWidth: that.data.canvasW * that.data.pixelRatio, // canvas 当前的宽 * 设备像素比
                destHeight: that.data.canvasH * that.data.pixelRatio, // canvas 当前的高 * 设备像素比
                canvasId: 'myCanvas',
                success: function (res) {
                    //调取小程序当中获取图片
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            wx.showToast({
                                title: '图片保存成功！',
                                icon: 'none'
                            })
                            that.triggerEvent('hide')
                        },
                        fail: function (res) {
                            console.log(res)
                            if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                                console.log("打开设置窗口");
                                that.doAuth()
                            }
                        }
                    })
                },
                fail: function (res) {
                    console.log(res)
                }
            }, this)
        },
    }
})