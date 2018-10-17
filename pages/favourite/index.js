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
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    wx.navigateTo({
      url: '/pages/wallpaper/detail?url=' + src,
    })
  },
})