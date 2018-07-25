export default {
    refreshToken(state, token){
        state.token = token
        window.localStorage.setItem('token', token)
    },
    logout(state){
        state.token = null
        state.me = null
        window.localStorage.removeItem('token')
    },
    me(state, me){
        state.me = me
    }
}