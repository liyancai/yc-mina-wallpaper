const app = getApp()

const util = require('../../utils/util.js')
const listUtil = require('../../utils/list.js')

Page({
  data: {
    filterInfo: {
      showInfo: false,
      cate1: 1,
      cate2: 1,
      cate3: 1,
      q: '',
    },
    pageInfo: {
      pno: 1,
      psize: 24,
      loadAll: false,
    },
    loading: false,
    dataList: [],
  },
  onLoad: function (options) {
    this.getData(this.data.pageInfo.pno)
  },
  getData(pno) {
    var that = this;

    if (pno == 1 && !this.data.pageInfo.loadAll) {
      this.setData({
        dataList: [],
        pageInfo: {
          loadAll: false,
          pno: that.data.pageInfo.pno,
          psize: that.data.pageInfo.psize
        }
      })
    }
    if (this.data.pageInfo.loadAll) {
      wx.stopPullDownRefresh()
      return
    }

    this.setData({
      loading: true
    })

    wx.cloud.callFunction({
      name: 'wallhaven-image-list',
      data: {
        q: that.data.filterInfo.q,
        cate1: that.data.filterInfo.cate1 + '',
        cate2: that.data.filterInfo.cate2 + '',
        cate3: that.data.filterInfo.cate3 + '',
        pno: pno,
        isCover: true
      },
    }).then(res => {
      console.log(res)
      var list = res.result;
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
            pno: pno + 1,
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
      console.error(err)
      that.setData({
        loading: false
      })
      wx.stopPullDownRefresh()
    })

  },
  previewImage: function (event) {

    //进入图片详情前，初始化滚动swiper图片列表备用。
    //为防止从hot热图列表页进入详情时，swiper-item 过多，做最大长度截取
    
    let list = this.data.dataList
    let src = event.currentTarget.dataset.src;//获取data-src
    let length = list.length
    let count = 10

    if(length <= count) {
      app.globalData.wallpaperDetailList = this.data.dataList
    } else {
      let index = list.indexOf(src)
      if(length - index <= count) {
        app.globalData.wallpaperDetailList = this.data.dataList.slice(length - count, length)
      } else {
        app.globalData.wallpaperDetailList = this.data.dataList.slice(index, index + count)
      }
    }

    wx.navigateTo({
      url: '/pages/wallpaper/detail?url=' + src,
    })
  },
  getFirstPageData() {
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
  inputFunc(e) {
    let that = this
    this.setData({
      filterInfo: {
        showInfo: that.data.filterInfo.showInfo,
        cate1: that.data.filterInfo.cate1,
        cate2: that.data.filterInfo.cate2,
        cate3: that.data.filterInfo.cate3,
        q: e.detail.value
      }
    })
    console.log(that.data.filterInfo.q)
  },
  toggleInfoView() {
    let that = this
    let show = that.data.filterInfo.showInfo

    this.setData({
      filterInfo: {
        showInfo: !that.data.filterInfo.showInfo,
        cate1: that.data.filterInfo.cate1,
        cate2: that.data.filterInfo.cate2,
        cate3: that.data.filterInfo.cate3,
        q: that.data.filterInfo.q
      }
    })
    if(show){
      that.getFirstPageData()
    }
  },
  toggleCate0() {
    let that = this
    this.setData({
      filterInfo: {
        showInfo: that.data.filterInfo.showInfo,
        cate1: 1,
        cate2: 1,
        cate3: 1,
        q: that.data.filterInfo.q
      }
    })
  },
  toggleCate1() {
    let that = this
    this.setData({
      filterInfo: {
        showInfo: that.data.filterInfo.showInfo,
        cate1: 1,
        cate2: 0,
        cate3: 0,
        q: that.data.filterInfo.q
      }
    })
  },
  toggleCate2() {
    let that = this
    this.setData({
      filterInfo: {
        showInfo: that.data.filterInfo.showInfo,
        cate1: 0,
        cate2: 1,
        cate3: 0,
        q: that.data.filterInfo.q
      }
    })
  },
  toggleCate3() {
    let that = this
    this.setData({
      filterInfo: {
        showInfo: that.data.filterInfo.showInfo,
        cate1: 0,
        cate2: 0,
        cate3: 1,
        q: that.data.filterInfo.q
      }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '海量高清壁纸，快来看看吧！- 可可壁纸',
      path: '/pages/hot/index'
    }
  }
})