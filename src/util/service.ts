import axios from 'axios'

let baseURL = 'http://localhost:8848'
if (process.env.NODE_ENV === 'development') {
  baseURL = process.env.VUE_APP_API
  console.log('当前的地址为', baseURL)
}
// 后面可能会有多个判断
else {
  baseURL = process.env.VUE_APP_API
}

// 创建axios 并赋值给常量servic
console.log(baseURL)
const service = axios.create({
  baseURL: baseURL,
})
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 发送请求之前zuoshenm
    return config
  },
  function (err) {
    // 请求错误的时候做什么
    return Promise.reject(err)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据进行处理
    return response
  },
  function (err) {
    // 相应错误时做的事
    switch (err.response.status) {
      case 404:
        console.log('url信息有误')
        break
      case 500:
        console.log('服务器有问题')
        break

      default:
        console.log('未知错误')
        break
    }
    return Promise.reject(err)
  }
)
export default service
