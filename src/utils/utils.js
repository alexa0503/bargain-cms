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
      vm.snackbarText = '提交失败'
    })
}