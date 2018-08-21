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
    },
    setEvents( state, events ){
        let items = []
        for (let index = 0; index < events.length; index++) {
            let text = events[index].name
            if( events[index].is_current ){
                text += '【活动中】'
            }
            items[index] = {
                'text' : text,
                'value': events[index].id,
                'is_current': events[index].is_current
            }
        }
        state.events = items
    }
}