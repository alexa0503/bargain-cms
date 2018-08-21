import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {},
    user: {},
    auth: false,
    token: null,
    me: null,
    events: null
  },
  getters,
  actions,
  mutations
  //strict: process.env.NODE_ENV !== 'production'
})