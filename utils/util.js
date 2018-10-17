const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const previewImage = event => {
  var src = event.currentTarget.dataset.src;//获取data-src
  var imgList = event.currentTarget.dataset.list;//获取data-list
  //图片预览
  wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: imgList // 需要预览的图片http链接列表
  })
}

/**
 * 将图片地址处理成最终的大图地址
 */
const dealImageUrl = data => {

  let sourceList = (typeof data == 'string') ? [data] : data
  let targetList = []

  for (let i = 0, r = ''; i < sourceList.length; i++) {
    let reg = /wallpapers\/thumb\/small\/th-([0-9]+)\.jpg/igm;
    if (r = reg.exec(sourceList[i])) {
      targetList.push("https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-" + r[1] + ".jpg")
    } else {
      targetList.push(sourceList[i])
    }
  }

  return (typeof data == 'string') ? targetList[0] : targetList
}

module.exports = {
  formatTime: formatTime,
  previewImage: previewImage,
  dealImageUrl: dealImageUrl
}
