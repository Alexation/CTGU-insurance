import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import './mock/mockServers'
// process.env.Mock && require('./mock.js')
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'
import { userInfo } from './api'
import { CheckboxGroup, Switch, DatePicker, TimePicker, RadioGroup, Card, Radio, Form, FormItem, Col, Dropdown, DropdownMenu, DropdownItem, Button, Pagination, Checkbox, Icon, Autocomplete, Loading, Message, Notification, Steps, Step, Table, TableColumn, Input, Dialog, Select, Option } from 'element-ui'
import { getStore } from '/utils/storage'
import VueContentPlaceholders from 'vue-content-placeholders'

import VueParticles from 'vue-particles' 
Vue.use(VueParticles) 

// import Toast from './components/toast'
// Vue.prototype.$Toast = Toast

// import Vcomp from './components/index'
// Vue.use(Vcomp)

Vue.use(VueContentPlaceholders)
Vue.use(RadioGroup)
Vue.use(TimePicker)
Vue.use(Card)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(Radio)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Button)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(infiniteScroll)
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
Vue.config.productionTip = false

// Date.prototype.format = function (format) {
//   var o = {
//       "M+": this.getMonth() + 1, //month
//       "d+": this.getDate(), //day
//       "h+": this.getHours(), //hour
//       "m+": this.getMinutes(), //minute
//       "s+": this.getSeconds(), //second
//       "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
//       "S": this.getMilliseconds() //millisecond
//   }
//   if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
//       (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//   for (var k in o) if (new RegExp("(" + k + ")").test(format))
//       format = format.replace(RegExp.$1,
//           RegExp.$1.length == 1 ? o[k] :
//               ("00" + o[k]).substr(("" + o[k]).length));
//   return format;
// }

// const whiteList = ['/home', '/goods', '/login', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面

// // token登录检测
// // (to.path == '/login') || 
// router.beforeEach(function (to, from, next) {
//   userInfo(window.localStorage.getItem('id')).then(res => {
//     if (res.code !== 200) { // 没登录
//         if (whiteList.indexOf(to.path) !== -1) {
//           next();
//       } else {
//           next({path: '/login'})
//       }
// //       // next({
// //       //   replace: true,
// //       //   name:'login',
// //       // })
// //       // if (whiteList.indexOf(to.path) !== -1) { // 白名单
// //         // next()
//       } else {
//         // next('/login')
//         next()
//       }
// //     } else {
//       store.commit('RECORD_USERINFO', {info: res.data})
// //       next()
// //     }
//   })
// })
// const whiteList = ['/home', '/goods', '/login', '/register', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面

const whiteList = ['/map', '/home', '/goods', '/login', '/register', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  let params = {
    params: {
      token: getStore('token')
    }
  }

  if (window.localStorage.getItem('id')) {
    userInfo(window.localStorage.getItem('id')).then(res => {
      if (res.code !== 200) { // 没登录
        if (whiteList.indexOf(to.path) !== -1) { // 白名单
          next()
        } else {
          next('/login')
        }
      } else {
        store.commit('RECORD_USERINFO', {info: res.data})
        if (to.path === '/login') { //  跳转到
          next({path: '/'})
        }
        next()
      }
    })
  }else{
    if (whiteList.indexOf(to.path) !== -1) { // 白名单
      next()
    } else {
      next('/login')
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
