/**
 * 添加购物车
 * @method add
 * @param {String} val 商品类型 ('100.00','150.00','200.00','300.00','500.00','discount','gift')
 * @obj {Object} obj 商品
 */
const add = (val, obj) => {
    let shop;
    if (val == 'gift') {
        shop = {
            price: obj.price,
            greeting: obj.greeting,
            create_time: obj.create_time,
            shop_list: obj.shop_list,
            number: 1,
            checked: false
        }
    } else {
        let ls = obj.supply_price.split('.')
        let price = parseFloat(obj.supply_price)
        let int_price = ls[0]
        let decimal = ls[1]
        shop = {
            shopId: obj.shopId,
            supply_price: obj.supply_price,
            int_price: int_price,
            price: price,
            decimal: decimal,
            title: obj.title,
            label_list: obj.label_list,
            order_img: obj.order_img,
            create_time: obj.create_time,
            brand: obj.brand,
            brief_introduction: obj.brief_introduction
        }

    }
    console.log('添加购物车。。。')
    let last;
    console.log(val)
    switch (val) {
        case '100.00':
            last = getApp().globalData.shop_car_100
            last.unshift(shop)
            getApp().globalData.shop_car_100 = last
            break
        case '200.00':
            last = getApp().globalData.shop_car_200
            last.unshift(shop)
            getApp().globalData.shop_car_200 = last
            break
        case '150.00':
            last = getApp().globalData.shop_car_150
            last.unshift(shop)
            getApp().globalData.shop_car_150 = last
            break
        case '300.00':
            last = getApp().globalData.shop_car_300
            last.unshift(shop)
            getApp().globalData.shop_car_300 = last
            break
        case '500.00':
            last = getApp().globalData.shop_car_500
            last.unshift(shop)
            getApp().globalData.shop_car_500 = last
            break
        case 'discount':
            last = getApp().globalData.shop_car_discount
            last.unshift(shop)
            getApp().globalData.shop_car_discount = last
            break
        default:
            last = getApp().globalData.shop_car_gift
            last.unshift(shop)
            getApp().globalData.shop_car_gift = last
            break
    }
    let ls = getApp().globalData.add_car_list
    if (!ls.includes(val)) {
        ls.push(val)
        console.log('添加')
    }
    getApp().globalData.add_car_list = ls
    console.log(getApp().globalData.add_car_list)
}

/**
 * 下单后删除购物车中折扣商品
 * @method removeDiscount
 * @param {Object} objList 需要删除的商品列表
 */
const removeDiscount = (objList) => {
    let lastList = getApp().globalData.shop_car_discount
    let newList = []
    for (let i = 0; i < lastList.length; i++) {
        let flag = false
        for (let j = 0; j < objList.length; j++) {
            if (lastList[i].shopId == objList[j].shopId) {
                flag = true
                break
            }
        }
        if (flag) {
            continue
        }
        newList.push(lastList[i])
    }
    getApp().globalData.shop_car_discount = newList
    getApp().globalData.placeOrder = true
}

/**
 * 下单后删除购物车中礼包
 * @method removeGift
 * @param {Object} objList 需要删除的商品列表
 */
const removeGift = (objList) => {
    console.log(objList)
    let lastList = getApp().globalData.shop_car_gift
    let newList = []
    for (let i = 0; i < lastList.length; i++) {
        console.log(lastList[i])
        let flag = false
        for (let j = 0; j < objList.length; j++) {
            if (lastList[i].create_time == objList[j].create_time) {
                flag = true
                break
            }
        }
        if (flag) {
            console.log('删除', lastList[i].create_time)
            continue
        }
        newList.push(lastList[i])
    }
    getApp().globalData.shop_car_gift = newList
    getApp().globalData.placeOrder = true
}

/**
 * 大家想要加入购物车
 * @method wantToCar
 * @param {Array} 添加的商品
 * @param {Number} 添加时间
 */
const wantToCar = (objList, create_time) => {
    for (let i = 0; i < objList.length; i++) {
        let obj = objList[i]
        let ls = obj.supply_price.split('.')
        let price = parseFloat(obj.supply_price)
        let int_price = ls[0]
        let decimal = ls[1]
        let shop = {
            shopId: obj.Id,
            supply_price: obj.supply_price,
            int_price: int_price,
            price: price,
            decimal: decimal,
            title: obj.title,
            label_list: obj.label,
            order_img: obj.order_img,
            create_time: create_time,
            brand: obj.brand,
            brief_introduction: obj.brief_introduction
        }
        console.log(shop)
        let last;
        let val = obj.supply_price
        let flag = false
        if (!getApp().globalData.shop_car_bool[val]){
            return
        }
        switch (val) {
            case '100.00':
                last = getApp().globalData.shop_car_100
                for (let j=0;j<last.length;j++){
                    let shop1 = last[j]
                    if (shop1.shopId == shop.shopId){
                        flag = true
                        break
                    }
                }
                if (!flag){
                    last.unshift(shop)
                    getApp().globalData.shop_car_100 = last
                }
                break
            case '200.00':
                last = getApp().globalData.shop_car_200
                for (let j = 0; j < last.length; j++) {
                    let shop1 = last[j]
                    if (shop1.shopId == shop.shopId) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    last.unshift(shop)
                    getApp().globalData.shop_car_200 = last
                }
                break
            case '150.00':
                last = getApp().globalData.shop_car_150
                for (let j = 0; j < last.length; j++) {
                    let shop1 = last[j]
                    if (shop1.shopId == shop.shopId) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    last.unshift(shop)
                    getApp().globalData.shop_car_150 = last
                }
                break
            case '300.00':
                last = getApp().globalData.shop_car_300
                for (let j = 0; j < last.length; j++) {
                    let shop1 = last[j]
                    if (shop1.shopId == shop.shopId) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    last.unshift(shop)
                    getApp().globalData.shop_car_300 = last
                }
                break
            case '500.00':
                last = getApp().globalData.shop_car_500
                for (let j = 0; j < last.length; j++) {
                    let shop1 = last[j]
                    if (shop1.shopId == shop.shopId) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    last.unshift(shop)
                    getApp().globalData.shop_car_500 = last
                }
                break
        }
        if (!flag){
            let ls = getApp().globalData.add_car_list
            if (!ls.includes(val)) {
                ls.push(val)
                console.log('添加')
            }
            getApp().globalData.add_car_list = ls
            console.log(getApp().globalData.add_car_list)
        }

    }
}

module.exports = {
    add,
    removeDiscount,
    removeGift,
    wantToCar
}