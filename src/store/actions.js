//import * as types from './mutation-types'
import * as apiUrls from './../utils/api-urls'
export default {
    getMe({
        commit
    }) {
        return new Promise((resolve, reject) => {
            axios.get(apiUrls.ME)
                .then(function (response) {
                    commit('me', response.data.data)
                    resolve(response.data.data)
                })
                .catch(function (error) {
                    commit('me', null)
                    reject(error)
                });
        })
    },
    refreshToken({
        commit
    }, token) {
        return new Promise((resolve, reject) => {
            if (!token) {
                axios.post(apiUrls.REFRESH_TOKEN).then(function (response) {
                    commit('refreshToken', response.data.token)
                }).catch(function (error) {
                })
            } else {
                commit('refreshToken', token)
                resolve()
            }
        })
    },
    login({
        commit
    },data) {
        return new Promise((resolve, reject) => {
        })
    },
    logout({
        commit
    }) {
        return new Promise((resolve, reject) => {
            axios.post(apiUrls.LOGOUT).then((response) => {
                commit('logout')
                return resolve(response)
            }).catch((error) => {
                return reject(error)
            })
        })
    },
    getEvents({commit}) {
        return new Promise((resolve,reject)=>{
            let url = apiUrls.EVENTS
            axios.get(url).then(res => {
                commit('setEvents', res.data.data)
                return resolve(res.data.data)
            }).catch(err => {
                return reject(err)
            })
        })
    },
    getItems({
        state,
        commit
    }, {
        model,
        page,
        keyword
    }) {
        return new Promise((resolve, reject) => {
            if (page == undefined) {
                page = 1
            }
            let url = apiUrls.PREFIX_ITEMS + model
            axios.get(url, {
                params: {
                    page: page,
                    keyword: keyword
                }
            }).then(res => {
                let items = res.data.data
                // let headers = res.data.headers
                let pagination = {
                    rowsPerPage: res.data.meta.per_page,
                    totalItems: res.data.meta.total,
                    page: res.data.meta.current_page,
                    lastPage: res.data.meta.last_page
                }
                let data = {
                    data: items,
                    pagination: pagination,
                    // headers: headers
                }
                //commit('updateItems',{items,headers,pagination})
                return resolve(data)
            }).catch(error => {
                return reject(error)
            })
        })
    }
}