// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let { q, pno } = event

  q = defaultValue(q, '')
  pno = defaultValue(pno, '1')

  let url = 'https://www.foodiesfeed.com/trending-photos/page/' + pno + '/'

  return await new Promise((resolve, reject) => {

    request(url, function (error, response, body) {

      let list = []
      if (!error && response.statusCode == 200) {
        list = getImageList(body)
      }
      resolve(list)
    })

  });

}

/**
 * 从文本中过滤出图片
 */
const getImageList = (str) => {

  let list = []

  const reg = /\<article class="post-item item"\>[\s\S]*?\<img[\s\S]*?width="([\s\S]*?)"[\s\S]*?height="([\s\S]*?)"[\s\S]*?src="([\s\S]*?)"[\s\S]*?\>/igm;

  var r = ''
  while (r = reg.exec(str)) {
    list.push({
      width: r[1],
      height: r[2],
      url: r[3],
    })
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