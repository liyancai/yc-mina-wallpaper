/**
 * list : 初始列表
 * size: 子列表长度
 */
const splitList = (list, size) => {

  if(list == undefined || list == null || list.length == 0) {
    return []
  }
  if(size == undefined || size == null || isNaN(size) || size <= 0) {
    return []
  }

  let array = []
  let length = list.length
  let start = 0, end = size

  while(true) {
    end = end > length ? length : end

    if(end > start){
      array.push(list.slice(start, end))
    }
    if (end - start < size) {
      break
    }

    start = end
    end += size
  }
  return array
}

/**
 * 测试程序
 */
const test = () => {
  let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  console.log(splitList(null, 10))
  console.log(splitList(list, 'a'))
  console.log(splitList(list, 20))
  console.log(splitList(list, 10))
  console.log(splitList(list, 15))
  console.log(splitList(list, 5))
  console.log(splitList(list, 6))
}

const test2 = () => {
  let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  console.log(list[0])
  console.log(list[10])
}

// test2()

module.exports = {
  splitList: splitList
}
