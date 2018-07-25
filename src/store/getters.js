//import * as types from './mutation-types'
export default {
    token: (state, getters) => {
        state.token = window.localStorage.getItem('token')
        return state.token
    },
    me: (state, getters) => {
        return state.me
    }
}