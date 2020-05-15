import Config from './config.js'
const PHP_ROOT_URL = Config.PHP
// PHP
// 省市区
const GET_PROVINCE = PHP_ROOT_URL + '/api/province'
// 生成提货码
const GET_PICK_CODE_URL = PHP_ROOT_URL + '/applet/Order/pickup'
// 获取礼包商品
const GET_ShOPS_URL = PHP_ROOT_URL + '/applet/Order/pickup_show'
// 提货
const PICK_SHOP_URL = PHP_ROOT_URL + '/applet/Order/pickupadd'
// 背景图片获取
const GET_SETTING_IMG_UTL = PHP_ROOT_URL + '/api/Setting/img'
///////////////////////////////////////////// 我的提货列表
const tihuoShow = PHP_ROOT_URL + '/applet/pickup/show'
//提货详情
const tihuoShowDeatail = PHP_ROOT_URL + '/applet/pickup/detail'
//确认收货
const tihuoAccept = PHP_ROOT_URL + '/api/order/takeover'
//查看物流
const checkDelivery = PHP_ROOT_URL + '/api/Common/logistics_information'
//礼品列表
const giftShowTabke = PHP_ROOT_URL + '/applet/Feedback/show'
//提交新礼品
const addNewGift = PHP_ROOT_URL + '/applet/Feedback/add'
//活动主页
const getPartyShowUrl = PHP_ROOT_URL + '/applet/Activity/show'
// 我的活动
const myActiveUrl = PHP_ROOT_URL + '/applet/Activity/mine'
//a活动详情
const activeDetailUrl = PHP_ROOT_URL + '/applet/Activity/detail'
//a活动提交
const addActiveDetailUrl = PHP_ROOT_URL + '/applet/Activity/sign_up'
//提醒发货
const warngoodslUrl = PHP_ROOT_URL + '/api/order/remind'


// Python
const PYTHON_ROOT_URL = Config.PYTHON
// 获取openid
const GET_OPENID_URL = PYTHON_ROOT_URL + 'user/login/auth'
// 授权认证
const AUTH_URL = PYTHON_ROOT_URL + 'user/login/after'
// 获取banner图
const GET_BANNERS_URL = PYTHON_ROOT_URL + 'api/index'
// 获取分页折扣商品
const GET_DISCOUNT_URL = PYTHON_ROOT_URL + 'shop/discount'
// 获取分页全部商品
const GET_ALL_SHOP_URL = PYTHON_ROOT_URL + 'shop/all'
// 账号密码登陆
const USER_LOGIN_URL = PYTHON_ROOT_URL + 'user/login'
// 获取商品详情
const GET_SHOP_DETAIL_URL = PYTHON_ROOT_URL + 'shop/single'
// 获取礼品采购价格区间商品
const GET_PRESENT_SHOP_URL = PYTHON_ROOT_URL + 'shop/present'
// 获取福利采购价格区间商品
const GET_WEAL_SHOP_URL = PYTHON_ROOT_URL + 'shop/weal'
// 获取祝福语
const GET_GREETING_URL = PYTHON_ROOT_URL + 'api/greeting'
// 加入购物车（非折扣）
const ADD_TO_CAR_URL = PYTHON_ROOT_URL + 'shopcar/add'
// 加入购物车（折扣）
const ADD_TO_CAR_DISCOUNT_URL = PYTHON_ROOT_URL + 'shopcar/discount/add'
// 获取收货地址
const GET_ADDRESS_URL = PYTHON_ROOT_URL + 'api/address/get'
// 获取会费详情
const GET_FEE_DETAIL_URL = PYTHON_ROOT_URL + 'api/details/fee'
// 生成礼包
const CREATE_GIFT_URL = PYTHON_ROOT_URL + 'shop/gift/generate'
// 获取购物车中商品价格区间的商品
const GET_SHOP_CAR_WITH_PRICE_URL = PYTHON_ROOT_URL + 'shopcar/with/price'
// 获取购物车中折扣商品
const GET_SHOP_CAR_WHITE_DISCOUNT_URL = PYTHON_ROOT_URL + 'shopcar/with/discount'
// 购物车删除（价格区间/折扣）
const DEL_SHOP_CAR_URL = PYTHON_ROOT_URL + 'shopcar/shop/update'
// 获取礼包
const GET_GIFT_URL = PYTHON_ROOT_URL + 'shopcar/with/gift'
// 礼包增加/删除/减少
const DEL_GIFT_URL = PYTHON_ROOT_URL + 'shopcar/gift/update'
// 礼包改变数量
const UPADTE_GIFT_NUMBER_URL = PYTHON_ROOT_URL + 'shopcar/number/update'
// 获取抬头
const GET_INVOICE_URL = PYTHON_ROOT_URL + 'orders/invoice/get'
// 获取会费返还金额
const GET_FEE_BACK_URL = PYTHON_ROOT_URL + 'orders/fee/return'
// 礼包下单
const GIFT_ORDER_ADD_URL = PYTHON_ROOT_URL + 'orders/gift/add'
// 折扣商品下单
const DISCOUNT_ORDER_ADD_URL = PYTHON_ROOT_URL + 'orders/discount/add'
// 添加抬头
const ADD_INVOICE_URL = PYTHON_ROOT_URL + 'orders/invoice/add'
// 修改抬头
const UPDATE_INVOICE_URL = PYTHON_ROOT_URL + 'orders/invoice/update'
// 获取全部订单
const GET_ALL_ORDERS_URL = PYTHON_ROOT_URL + 'orders/show/all'
// 获取未付款订单
const GET_NO_PAY_ORDERS_URL = PYTHON_ROOT_URL + 'orders/pending/payments'
// 获取待发货订单
const GET_NO_SEND_ORDERS_URL = PYTHON_ROOT_URL + 'orders/wait/deliver'
// 获取已发货订单
const GET_HAS_SEND_ORDERS_URL = PYTHON_ROOT_URL + 'orders/already/deliver'
// 获取待提货订单
const GET_NO_PICK_ORDERS_URL = PYTHON_ROOT_URL + 'orders/wait/pickup'
// 取消订单
const CANCEL_ORDER_URL = PYTHON_ROOT_URL + 'orders/cancel'
// 确认支付
const CONFIRM_PAY_URL = PYTHON_ROOT_URL + 'orders/payment'
// 支付成功回调
const PAY_CALL_BACK_URL = PYTHON_ROOT_URL + 'orders/payment/return'
// 折扣订单详情
const DSICOUNT_ORDER_DETAIL_URL = PYTHON_ROOT_URL + 'orders/details/discount'
// 礼包订单详情
const GIFT_ORDER_DETAIL_URL = PYTHON_ROOT_URL + 'orders/details'
// 提醒发货
const REMIND_ORDER_URL = PYTHON_ROOT_URL + 'orders/remind'
// 确认收货
const CONFIRM_ORDER_URL = PYTHON_ROOT_URL + 'orders/ack'
// 添加想要
const ADD_TO_WANT_URL = PYTHON_ROOT_URL + 'shop/want/add'
// 查看我的想要
const GET_MY_WANT_URL = PYTHON_ROOT_URL + 'shop/want/query'
// 删除我的想要
const DEL_MY_WANT_URL = PYTHON_ROOT_URL + 'shop/want/delete'
// 大家想要
const EVERY_WANT_URL = PYTHON_ROOT_URL + 'shop/want/all'
// wantToCar
const WANT_TO_CAR_URL = PYTHON_ROOT_URL +'shop/shopcar/add'
// 判断是否存在订单
const JUDGE_URL = PYTHON_ROOT_URL + 'shop/judge'


const url = {
    /**
     * @return {String} 获取省市区三级联动数据的API
     */
    getProvince: () => {
        return GET_PROVINCE
    },
    //我的提货
    getGoodsShow() {
        return tihuoShow
    },
    //我的提货详情
    getGoodsShowDeatail() {
        return tihuoShowDeatail
    },
    //确认收货
    okAcceptGoodsDeatail() {
        return tihuoAccept
    },
    //查看物流
    checkDeliveryDetail() {
        return checkDelivery
    },
    //礼品列表
    getGiftShowTabke() {
        return giftShowTabke
    },
    //提交新礼品
    getAddNewGift() {
        return addNewGift
    },
    //活动列表
    getPartyShow() {
        return getPartyShowUrl
    },
    // 我的活动
    myActive(){
        return myActiveUrl
    },
    //活动详情
    activeDetail() {
        return activeDetailUrl
    },
    //活动提交
    addActiveDetail() {
        return addActiveDetailUrl
    },
    //提醒发货
    warngoods() {
        return warngoodslUrl
    },



    /**
     * @return {String} 获取用户openID的API
     */
    getOpenid: () => {
        return GET_OPENID_URL
    },
    /**
     * @return {String} 微信授权登陆后用户信息存储API
     */
    auth: () => {
        return AUTH_URL
    },
    /**
     * @return {String} 获取banner图API
     */
    getBanners: () => {
        return GET_BANNERS_URL
    },
    /**
     * @return {String} 获取折扣商品API
     */
    getDiscount: () => {
        return GET_DISCOUNT_URL
    },
    /**
     * @return {String} 获取全部商品API
     */
    getAllShop: () => {
        return GET_ALL_SHOP_URL
    },
    /**
     * @return {String} 账号密码登陆API
     */
    userLogin: () => {
        return USER_LOGIN_URL
    },
    /**
     * @return {String} 获取商品详情API
     */
    getShopDetail: () => {
        return GET_SHOP_DETAIL_URL
    },
    /**
     * @return {String} 获取礼品采购价格区间商品API
     */
    getPrensentShop: () => {
        return GET_PRESENT_SHOP_URL
    },
    /**
     * @return {String} 获取福利采购价格区间商品API
     */
    getWealShop: () => {
        return GET_WEAL_SHOP_URL
    },
    /**
     * @return {String} 获取祝福语API
     */
    getGreeting: () => {
        return GET_GREETING_URL
    },
    /**
     * @param {String} 商品类型
     * @return {String} 添加购物车API
     */
    addToCar: type => {
        if (type == 3) {
            return ADD_TO_CAR_DISCOUNT_URL
        } else {
            return ADD_TO_CAR_URL
        }

    },
    /**
     * @return {String} 获取公司地址API
     */
    getAddress: () => {
        return GET_ADDRESS_URL
    },
    /**
     * @return {String} 获取会费规则API
     */
    getFeeDetail: () => {
        return GET_FEE_DETAIL_URL
    },
    /**
     * @return {String} 创建礼包API
     */
    createGift: () => {
        return CREATE_GIFT_URL
    },
    /**
     * @return {String} 获取购物车中商品价格区间商品API
     */
    getShopCarWithPrice: () => {
        return GET_SHOP_CAR_WITH_PRICE_URL
    },
    /**
     * @return {String} 获取购物车中折扣商品API
     */
    getShopCarWithDiscount: () => {
        return GET_SHOP_CAR_WHITE_DISCOUNT_URL
    },
    /**
     * @return {String} 删除购物车中的商品API
     */
    delShopCar: () => {
        return DEL_SHOP_CAR_URL
    },
    /**
     * @return {String} 获取购物车中的礼包API
     */
    getGift: () => {
        return GET_GIFT_URL
    },
    /**
     * @return {String} 删除购物车中的礼包API
     */
    delGift: () => {
        return DEL_GIFT_URL
    },
    /**
     * @return {String} 获取发票抬头API
     */
    getInvoice: () => {
        return GET_INVOICE_URL
    },
    /**
     * @return {String} 礼包下单API
     */
    giftOrderAdd: () => {
        return GIFT_ORDER_ADD_URL
    },
    /**
     * @return {String} 折扣商品下单API
     */
    discountOrderAdd: () => {
        return DISCOUNT_ORDER_ADD_URL
    },
    /**
     * @return {String} 添加发票抬头API
     */
    addInvoice: () => {
        return ADD_INVOICE_URL
    },
    /**
     * @return {String} 修改发票抬头API
     */
    updateInvoice: () => {
        return UPDATE_INVOICE_URL
    },
    /**
     * @return {String} 获取订单会费返还API
     */
    getFeeBack: () => {
        return GET_FEE_BACK_URL
    },
    /**
     * @return {String} 获取全部订单API
     */
    getAllOrders: () => {
        return GET_ALL_ORDERS_URL
    },
    /**
     * @return {String} 获取未付款订单API
     */
    getNoPayOrders: () => {
        return GET_NO_PAY_ORDERS_URL
    },
    /**
     * @return {String} 获取未发货订单API
     */
    getNoSendOrders: () => {
        return GET_NO_SEND_ORDERS_URL
    },
    /**
     * @return {String} 获取已发货订单API
     */
    getHasSendOrders: () => {
        return GET_HAS_SEND_ORDERS_URL
    },
    /**
     * @return {String} 获取待提货单API
     */
    getNoPickOrders: () => {
        return GET_NO_PICK_ORDERS_URL
    },
    /**
     * @return {String} 取消订单API
     */
    cancelOrder: () => {
        return CANCEL_ORDER_URL
    },
    /**
     * @return {String} 确认支付API
     */
    confirmPay: () => {
        return CONFIRM_PAY_URL
    },
    /**
     * @return {String} 支付成功回调API
     */
    payCallBack(){
        return PAY_CALL_BACK_URL
    },
    /**
     * @return {String} 折扣订单详情API
     */
    discountOrderDetail: () => {
        return DSICOUNT_ORDER_DETAIL_URL
    },
    /**
     * @return {String} 礼包订单详情API
     */
    giftOrderDetail: () => {
        return GIFT_ORDER_DETAIL_URL
    },
    /**
     * @return {String} 提醒发货API
     */
    remindOrder: () => {
        return REMIND_ORDER_URL
    },
    /**
     * @return {String} 确认收货API
     */
    confirmOrder: () => {
        return CONFIRM_ORDER_URL
    },
    /**
     * @return {String} 添加想要API
     */
    addToWant: () => {
        return ADD_TO_WANT_URL
    },
    /**
     * @return {String} 查看我的想要API
     */
    getMyWant: () => {
        return GET_MY_WANT_URL
    },
    /**
     * @return {String} 删除我的想要API
     */
    delMyWant: () => {
        return DEL_MY_WANT_URL
    },
    /**
     * @return {String} 生成提货码API
     */
    getPickCode: () => {
        return GET_PICK_CODE_URL
    },
    /**
     * @return {String} 展示礼包商品API
     */
    getShops: () => {
        return GET_ShOPS_URL 
    },
    /**
     * @return {String} 提货API
     */
    pickShop: () => {
        return PICK_SHOP_URL
    },
    /**
     * @return {String} 获取背景图片API
     */
    getSettingImg: () => {
        return GET_SETTING_IMG_UTL
    },
    /**
     * @return {String} 大家想要API
     */
    everyWant: () => {
        return EVERY_WANT_URL
    },
    /**
     * @return {String} 大家想要加入购物车API
     */
    wantToCar: () => {
        return WANT_TO_CAR_URL
    },
    /**
     * @return {String} 判断折扣商品是否已购买API
     */
    judge:() => {
        return JUDGE_URL
    },
    /**
     * @return {String} 改变礼包数量
     */
    updateGiftNumber(){
        return UPADTE_GIFT_NUMBER_URL
    }
}

module.exports = {
    ...url
}