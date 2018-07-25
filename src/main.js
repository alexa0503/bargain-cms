import Vue from 'vue'
//import axios from 'axios'
import VueRouter from 'vue-router'
import App from './App.vue'
import Routers from './router.js'
import store from './store'
import Vuetify from 'vuetify'
import './stylus/main.styl'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
Vue.use(Vuetify, {
  iconfont: 'fa'
 })
Vue.use(VueRouter)


// The routing configuration
const RouterConfig = {
  hashbang: true,
  mode: 'hash',
  routes: Routers
}
const router = new VueRouter(RouterConfig)
window.axios = require('axios');
//window.axios.defaults.baseURL = 'http://localhost:8000';
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//window.axios.defaults.headers.common['Authorization'] = `bearer ${store.getters.token}`;
window.axios.defaults.withCredentials = true;
// 自定义的 axios 响应拦截器
axios.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `bearer ${store.getters.token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
axios.interceptors.response.use((response) => {
  // 登陆判断
  var token = response.data.token
  if (token) {
    store.dispatch('refreshToken', token).then(()=>{
      router.push({
        name: 'home'
      })
    })
  }
  return response
}, (error) => {
  switch (error.response.status) {
    //未授权跳至登陆页面
    case 401:
      router.push({
        name: 'login'
      })
    case 405:
      //return Message.error(error.response.data.error)
    case 404:
      //alert('错误的页面')
    case 500:
      //alert('服务器错误，请联系管理员')
      console.log(error)
  }
  return Promise.reject(error)
})


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - 后台管理系统'
  }
  next()
})

Vue.config.productionTip = false
new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')