// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let { q, cate1, cate2, cate3, purity, ratios, sorting, order, pno, isCover } = event

  q = defaultValue(q, '')
  cate1 = defaultValue(cate1, '1')
  cate2 = defaultValue(cate2, '1')
  cate3 = defaultValue(cate3, '1')
  purity = defaultValue(purity, '110')
  ratios = defaultValue(ratios, '')
  sorting = defaultValue(sorting, 'random')
  order = defaultValue(order, 'desc')
  pno = defaultValue(pno, '1')
  isCover = defaultValue(isCover, false)

  var url = 'https://alpha.wallhaven.cc/search?q=' + q + '&categories=' + cate1 + '' + cate2 + '' + cate3 + '&purity=' + purity + '&ratios=' + ratios + '&sorting=' + sorting + '&order=' + order + '&page=' + pno
  console.log(url)

  return await new Promise((resolve, reject) => {

    request(url, function (error, response, body) {

      let list = []
      if (!error && response.statusCode == 200) {
        list = dealImageUrl(body, isCover)
      }
      resolve(list)
    })

  });

}

/**
 * 从文本中过滤出图片ids, 然后组装出图片地址
 */
const dealImageUrl = (str, isCover) => {

  let list = []

  const reg = /wallpapers\/thumb\/small\/th-([0-9]+)\.jpg/igm;

  var r = ''
  while (r = reg.exec(str)) {

    if(isCover) {
      list.push("https://alpha.wallhaven.cc/wallpapers/thumb/small/th-" + r[1] + ".jpg")
    } else {
      list.push("https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-" + r[1] + ".jpg")
    }

  }

  return list
}

/**
 * 处理默认值
 */
const defaultValue = (v, defaultValue) => {
  if (v == undefined || v == null || v == '') {
    v = defaultValue
  }
  return v
}