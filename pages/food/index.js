const app = getApp()

Page({

  data: {
    pageInfo: {
      pno: 1,
      psize: 24,
      loadAll: false,
    },
    loading: false,
    dataList: [],
  },

  onLoad: function () {
    this.getData(this.data.pageInfo.pno)
  },
  getData(__pno) {

    if (__pno == 1 && !this.data.pageInfo.loadAll) {
      this.setData({
        pageInfo: { loadAll: false }
      })
    }
    if (this.data.pageInfo.loadAll) {
      wx.stopPullDownRefresh()
      return
    }

    var that = this;
    this.setData({
      loading: true
    })

    wx.cloud.callFunction({
      name: 'foodiesfeed-image-list',
      data: {
        q: '',
        pno: __pno
      },
    }).then(res => {
      
      var list = res.result
      
      that.calcImageView(list);

      if (__pno == 1 && list.length > 0) {
        that.setData({
          dataList: [],
        })
      }

      that.setData({
        dataList: that.data.dataList.concat(list),
      })

      if (that.data.dataList.length == 0) {
        console.log('empty list')
      }
      if (list.length < that.data.pageInfo.psize) {
        that.data.pageInfo.loadAll = true;
        wx.showToast({ title: '已加载全部!', icon: 'success' })
      } else {
        that.setData({
          pageInfo: {
            loadAll: false,
            pno: __pno + 1,
            psize: that.data.pageInfo.psize
          }
        })
      }

      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh()
    }).catch(err => {
      // handle error
      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh()
    })

  },

  /**
   * 扩展图片的展示尺寸，2张图片的横线瀑布流
   */
  calcImageView(__list) {

    for(let i=0; i<__list.length; i++) {

      if(i % 2 == 0) {
        continue
      }

      let a = this.convertSize(__list[i - 1].width, __list[i - 1].height, __list[i].width, __list[i].height)
      __list[i-1].viewWidth = a.viewWidth1
      __list[i-1].viewHeight = a.viewHeight1
      __list[i].viewWidth = a.viewWidth2
      __list[i].viewHeight = a.viewHeight2
    }
  },

  /**
   * 传入两涨图片的尺寸，计算横线瀑布流的拉伸尺寸
   */
  convertSize(__w1, __h1, __w2, __h2) {
    let _totalWith = 750 - 15 * 2 - 10

    let _viewWidth1 = parseInt((_totalWith * __w1 * __h2) / (__w1 * __h2 + __h1 * __w2))
    let _viewHeight1 = parseInt(_viewWidth1 * __h1 / __w1)

    let _viewWidth2 = _totalWith - _viewWidth1
    let _viewHeight2 =  _viewHeight1

    return {
      viewWidth1 : _viewWidth1,
      viewHeight1: _viewHeight1,
      viewWidth2: _viewWidth2,
      viewHeight2: _viewHeight2,
    }
  },
  previewImage: function (event) {

    //进入图片详情前，初始化滚动swiper图片列表备用。
    //为防止从hot热图列表页进入详情时，swiper-item 过多，做最大长度截取

    let _list = this.data.dataList
    let list = []
    for(let i=0; i<_list.length; i++) {
      list.push(_list[i].url)
    }
    
    let src = event.currentTarget.dataset.src;//获取data-src
    let length = list.length
    let count = 10

    if (length <= count) {
      app.globalData.wallpaperDetailList = list
    } else {
      let index = list.indexOf(src)
      if (length - index <= count) {
        app.globalData.wallpaperDetailList = list.slice(length - count, length)
      } else {
        app.globalData.wallpaperDetailList = list.slice(index, index + count)
      }
    }

    wx.navigateTo({
      url: '/pages/wallpaper/detail?url=' + src,
    })
  },

  onPullDownRefresh: function () {
    let that = this
    this.setData({
      pageInfo: {
        loadAll: false,
        pno: 1,
        psize: that.data.pageInfo.psize
      }
    })
    this.getData(this.data.pageInfo.pno)
  },

  onReachBottom: function () {
    this.getData(this.data.pageInfo.pno)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '海量美食主题高清壁纸，快来看看吧！- 可可壁纸',
      path: '/pages/food/index'
    }
  }
})