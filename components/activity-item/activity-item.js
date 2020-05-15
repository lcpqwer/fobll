// components/activity-item/activity-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    showImg: false,
    rootUrl: getApp().globalData.rootUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showImg(){
      this.setData({showImg: true})
    },
    showDetail(){
      
    }
  }
})
