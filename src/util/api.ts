import service from './service'
console.log()
const link = (url: string, method = 'GET', data = {}, params = {}) => {
  return new Promise((resolve, reject) => {
    service
      .request({
        url,
        method,
        data,
        params,
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}
export default link
