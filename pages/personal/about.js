
Page({
  data: {

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