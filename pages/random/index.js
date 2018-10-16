const util = require('../../utils/util.js')
const listUtil = require('../../utils/list.js')

Page({
  data: {
    showInfo: false,
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

    if (pno == 1 && !this.data.pageInfo.loadAll) {
      this.setData({
        dataList: [],
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
      name: 'wallhaven-image-list',
      data: {
        ratios: '9x16',
        pno: pno
      },
    }).then(res => {
      // console.log(res)
      var list = res.result;
      that.setData({
        dataList: that.data.dataList.concat(listUtil.splitList(list, 8)),
      })

      if (that.data.dataList.length == 0) {
        console.log('empty list')
        //todo retry
        that.setData({
          pageInfo: {
            loadAll: false,
            pno: 1
          }
        })
        that.getData(that.data.pageInfo.pno)

        return
      }
      if (list.length < that.data.pageInfo.psize) {
        that.data.pageInfo.loadAll = true;
        wx.showToast({ title: '已加载全部!', icon: 'success' })
      } else {
        that.setData({
          pageInfo: { pno: pno + 1 }
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
  bindImageError: function (e) {

    //图片地址找不到时将 jpg 扩展名替换为 png
    let dataset = e.currentTarget.dataset
    let dataList = this.data.dataList

    if (e.detail.errMsg.indexOf('404 (Not Found)') > -1) {
      dataList[dataset.index][dataset.pos] = dataset.src.replace(".jpg", ".png")
    } else {
      dataList[dataset.index][dataset.pos] = dataset.src.replace(".jpg", ".jpg ")
    }

    this.setData({
      dataList: dataList,
    })
  },
  previewImage: function (event) {
    util.previewImage(event)
  },
  toggleInfoView() {
    let that = this
    this.setData({
      showInfo: !that.data.showInfo
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      pageInfo: {
        loadAll: false,
        pno: 1
      }
    })
    this.getData(this.data.pageInfo.pno)
  },
  onReachBottom: function () {
    this.getData(this.data.pageInfo.pno)
  },
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '可可壁纸',
      path: '/pages/random/index'
    }
  }
})