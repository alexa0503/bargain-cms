import * as apiUrls from './api-urls'

export const updateItem = (vm, item) => {
  let url = apiUrls.ITEM_UPDATE.replace('{id}', item.id)
  axios({
    method: 'PUT',
    url: url,
    data: item
  }).then((response) => {
    vm.snackbar = true
    vm.snackColor = 'success'
    vm.snackbarText = '排序更新成功'
  }).catch((error) => {
    vm.snackbar = true
    vm.snackColor = 'error'
    vm.snackbarText = '抱歉，服务器出问题了，请稍后重试。'
  })
}
export const storeEventItem = ({
  vm,
  method,
  data
}) => {
  return new Promise((resolve,reject)=>{
    let url
    if (method == 'PUT') {
      url = apiUrls.EVENT_ITEM_UPDATE.replace('{id}', data.id).replace('{eventId}', data.event_id)
    } else {
      url = apiUrls.EVENT_ITEM_STORE.replace('{eventId}', data.event_id)
    }
    axios({
      method: method,
      url: url,
      data: data
    }).then(res => {
      vm.snackbar = true
      vm.snackColor = 'success'
      vm.snackbarText = '恭喜，提交成功。'
      vm.getItems(1)
      return resolve(res)
    }).catch(response => {
      vm.snackbar = true
      vm.snackColor = 'error'
      if (response.status == 422) {
        vm.snackbarText = response.data[Object.keys(response.data)[0]][0]
      } else {
        vm.snackbarText = '抱歉，服务器发生错误，稍后重试'
      }
      return reject(response)
    })
  })
}

// 活动保存
export const storeEvent = ({vm,method,data}) => {
  return new Promise((resolve,reject)=>{
    let url
    if (method == 'PUT') {
      url = apiUrls.EVENT_UPDATE.replace('{id}', data.id)
    } else {
      url = apiUrls.EVENT_STORE
    }
    axios({
      method: method,
      url: url,
      data: data
    }).then(res => {
      // vm.snackbar = true
      // vm.snackColor = 'success'
      // vm.snackbarText = '恭喜，提交成功。'
      // vm.getItems(1)
      // vm.dialog = false
      return resolve(res)
    }).catch(response => {
      // vm.errors = response.data
      // vm.snackbar = true
      // vm.snackColor = 'error'
      // if (response.status == 422) {
      //   vm.snackbarText = response.data[Object.keys(response.data)[0]][0]
      // } else {
      //   vm.snackbarText = '抱歉，服务器发生错误，稍后重试'
      // }
      return reject(response)
    })
  })
}