const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    imageUrl: '',
    hasFavourite: false,
  },
  onLoad: function (options) {

    let url = options.url

    const reg = /wallpapers\/thumb\/small\/th-([0-9]+)\.jpg/igm;

    var r = ''
    if (r = reg.exec(url)) {
      url = "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-" + r[1] + ".jpg"
    }

    this.setData({
      imageUrl: url,
    })
  },
  bindImageError: function (e) {

    //图片地址找不到时将 jpg 扩展名替换为 png
    var that = this
    this.setData({
      imageUrl: that.data.imageUrl.replace(".jpg", (e.detail.errMsg.indexOf('404 (Not Found)') > -1) ? '.png' : '.jpg'),
    })
  },
  bindImageLoad: function (e) {
    let key = app.globalData.favouriteListKey
    let value = this.data.imageUrl

    let data = wx.getStorageSync(key)
    if (data == '') {
      this.setData({
        hasFavourite: false
      })
      return
    }

    if (data.indexOf(value) > -1) {
      this.setData({
        hasFavourite: true
      })
    }
  },
  previewImage: function (event) {
    util.previewImage(event)
  },
  gotoBack() {
    wx.navigateBack({ delta: 1 })
  },
  gotoFavourite() {
    let key = app.globalData.favouriteListKey
    let value = this.data.imageUrl

    let data = wx.getStorageSync(key)
    //初始化数组
    if (data == '') {
      data = []
    }

    //防止重复收藏
    let index = data.indexOf(value)
    if (index > -1) {
      data.splice(index, 1)
    }
    //将图片添加到数组开头
    data.unshift(value)

    var that = this
    wx.setStorage({
      key: key,
      data: data,
      success(res) {
        wx.showToast({ title: '添加收藏成功！', icon: 'none' })
        that.setData({
          hasFavourite: true
        })
      }
    })
  },
  cancelFavourite() {
    let key = app.globalData.favouriteListKey
    let value = this.data.imageUrl

    let data = wx.getStorageSync(key)
    if (data == '') {
      return
    }

    let index = data.indexOf(value)
    if (index > -1) {
      data.splice(index, 1)
    }

    var that = this
    wx.setStorage({
      key: key,
      data: data,
      success(res) {
        wx.showToast({ title: '取消收藏成功！', icon: 'none' })
        that.setData({
          hasFavourite: false
        })
      }
    })
  },
  gotoDownload() {
    wx.showModal({
      title: '如何下载图片？',
      content: '点击图片进行预览，然后长按图片保存到手机。',
      showCancel: false,
      confirmText: '知道了',
    })
  },
  onShareAppMessage: function () {

  }
})