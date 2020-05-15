/**
 * post 请求
 * @param {String} path 请求url，必须
 * @param {Object} params 请求参数，可选
 * @param {String} method 请求方式 GET | POST，默认为 POST
 * @param {Object} option 可选配置，如设置请求头 { headers:{} }
 * @param {Boolean} option 可选配置，是否显示‘加载中...’的toast，默认显示
 *
 * option = {
 *  headers: {} // 请求头
 * }
 *
 **/
// 获取接口地址
// const _getPath = path => (`http://home.mobookapp.com/${path}`)


// 封装接口公共参数
const _getParams = (data = {}) => {
    const timestamp = Date.now()
    const token = util.getStorageSync('token') || ''
    const version = data.version
    const sign = data.sign || util.md5(version + timestamp)
    return Object.assign({}, {
        timestamp,
        token,
        sign,
        deviceId,
        version
    }, data)
}
const Get = (path) => {
    const url = path;
    const method = 'GET'

    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            success: (res) => {
                resolve(res.data)
            },
            fail: function (res) {
                reject(res)
            },
            complete: function (res) {


            }
        });
    })
}
const Ajax = (path, params = {}, menthod = "GET") => {
    // const url = _getPath(path)
    const url = path
    // const data = _getParams(params)
    const data = params
    // console.log('data', data)
    // 处理请求头
    const header = {
        Authorization: getApp().globalData.jwt
    };
    const method = menthod
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            data,
            header,
            success: (res) => {
                resolve(res.data)
            },
            fail: function(res) {
                reject(res)
            },
            complete: function(res) {


            }
        });
    })
}

module.exports = {
    Ajax,
    Get
}