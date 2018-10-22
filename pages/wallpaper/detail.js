const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    wallpaperDetailList: [],
    defaultIndex: 0,  //用于页面显示
    currentIndex: 0,  //用于内部值状态记录
    hasFavourite: false,
    source: ''
  },
  onLoad: function (options) {

    let _source = options.source
    let _url = options.url
    if(_source == 'share') {
      app.globalData.wallpaperDetailList = [_url]
      this.setData({
        source: _source
      })
    }

    // 拿到当前的imageList 并处理
    // 处理当前图片地址
    // 获取到当前图片的索引
    let _wallpaperDetailList = util.dealImageUrl(app.globalData.wallpaperDetailList)
    let _currentImage = util.dealImageUrl(_url)
    let _currentIndex = _wallpaperDetailList.indexOf(_currentImage)

    this.setData({
      wallpaperDetailList: _wallpaperDetailList,
      defaultIndex: _currentIndex > -1 ? _currentIndex : 0,
      currentIndex: _currentIndex > -1 ? _currentIndex : 0,
    })

    this.updateFavouriteStatus()
  },
  bindImageError: function (e) {

    //图片地址找不到时将 jpg 扩展名替换为 png
    let dataset = e.currentTarget.dataset
    let list = this.data.wallpaperDetailList

    if (e.detail.errMsg.indexOf('404 (Not Found)') > -1) {
      list[dataset.index] = dataset.src.replace(".jpg", ".png")
    }

    this.setData({
      wallpaperDetailList: list,
    })
  },
  bindImageLoad: function (e) {
  },
  previewImage: function (event) {
    util.previewImage(event)
  },
  bindChangeFunc(event) {
    this.data.currentIndex = event.detail.current
    this.updateFavouriteStatus()
  },
  updateFavouriteStatus() {
    let key = app.globalData.favouriteListKey
    let value = this.data.wallpaperDetailList[this.data.currentIndex]

    let data = wx.getStorageSync(key)
    if (data == '') {
      this.setData({
        hasFavourite: false
      })
      return
    }

    this.setData({
      hasFavourite: data.indexOf(value) > -1
    })
  },
  gotoBack() {
    if(this.data.source == 'share') {
      this.setData({
        source: ''
      })
      wx.switchTab({
        url: '/pages/hot/index',
      })
    }
    wx.navigateBack({ delta: 1 })
  },
  gotoFavourite() {
    let key = app.globalData.favouriteListKey
    let value = this.data.wallpaperDetailList[this.data.currentIndex]

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
    let value = this.data.wallpaperDetailList[this.data.currentIndex]

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
      title: '喜欢吗？',
      content: '点击一下图片进入全屏预览模式，然后长按图片把它保存到手机吧^_^',
      showCancel: false,
      confirmText: '知道了',
    })
  },
  onShareAppMessage: function () {
    let url = this.data.wallpaperDetailList[this.data.currentIndex]
    return {
      title: '海量高清壁纸，快来看看吧！- 可可壁纸',
      path: '/pages/wallpaper/detail?source=share&url=' + url,
      imageUrl: url
    }
  }
})