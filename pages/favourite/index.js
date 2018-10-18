const app = getApp()

Page({
  data: {
    dataList: []
  },
  onShow: function (options) {
    let key = app.globalData.favouriteListKey
    
    let data = wx.getStorageSync(key)
    if (data == '') {
      data = []
    }

    this.setData({
      dataList: data
    })
  },
  previewImage: function (event) {

    //进入图片详情前，初始化滚动swiper图片列表备用
    app.globalData.wallpaperDetailList = this.data.dataList
    
    var src = event.currentTarget.dataset.src;//获取data-src
    wx.navigateTo({
      url: '/pages/wallpaper/detail?url=' + src,
    })
  },
})