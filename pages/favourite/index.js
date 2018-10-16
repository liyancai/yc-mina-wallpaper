const app = getApp()

Page({
  data: {
    dataList: []
  },
  onShow: function (options) {
    let key = app.globalData.favouriteListKey
    
    let data = wx.getStorageSync(key)
    if (data == '') {
      return
    }

    this.setData({
      dataList: data
    })
  },
})