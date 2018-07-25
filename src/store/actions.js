//import * as types from './mutation-types'
import * as apiUrls from './../utils/api-urls'
export default {
    async getMe({
        commit
    }) {
        return new Promise((resolve, reject) => {
            axios.get(apiUrls.ME)
                .then(function (response) {
                    commit('me', response.data.data)
                    resolve(response)
                })
                .catch(function (error) {
                    commit('me', null)
                    reject(error)
                });
        })
    },
    async refreshToken({
        commit
    }, token) {
        return new Promise((resolve, reject) => {
            if (!token) {
                axios.post(apiUrls.REFRESH_TOKEN).then(function (response) {
                    commit('refreshToken', response.data.token)
                    resolve(response)
                }).catch(function (error) {
                    reject(error)
                })
            } else {
                commit('refreshToken', token)
                resolve()
            }
        })
    },
    async login({
        commit
    },data) {
        return new Promise((resolve, reject) => {
        })
    },
    async logout({
        commit
    }) {
        return new Promise((resolve, reject) => {
            axios.post(apiUrls.LOGOUT).then((response) => {
                commit('logout')
                resolve(response)
            }).catch((error) => {
                reject(error)
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
                let headers = res.data.headers
                let pagination = {
                    rowsPerPage: res.data.meta.per_page,
                    totalItems: res.data.meta.total,
                    page: res.data.meta.current_page,
                    lastPage: res.data.meta.last_page
                }
                //commit('updateItems',{items,headers,pagination})
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}