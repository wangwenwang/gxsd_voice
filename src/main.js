// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';             //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css';  //element-ui的css
import router from './router'
import App from './App'
import Axios from "axios"
import qs from "qs"
import store from "./store"
import $ from "jquery"
import { Loading } from 'element-ui'
import toast from './components/toast/index'
import 'default-passive-events'
import Cube from 'cube-ui'
//import TransWorker from './components/test/transcode.worker.js'
// 引入字体
import '../static/iconfont/MuYaoSoftbrush.css'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Cube)

Vue.use(toast)
Vue.use(ElementUI);   //使用elementUI

Vue.config.productionTip = false


// 开发
Vue.prototype.HOST = "https://www.gxsd.mobi/gxsd-dev/"
// 测试
// Vue.prototype.HOST = "https://www.gxsd.mobi/gxsd-test/"
// 正式
// Vue.prototype.HOST = "https://www.gxsd.mobi/gxsd-pro/"
// 本地
// Vue.prototype.HOST = "http://localhost:8001/gxsd-local/"


// 解决vue版本更新后未刷新内容问题
if( router.name != "login_cellphone"){

  router.push("login_cellphone")
}

// 获取程序根路径
Vue.prototype.get_root_path = function (){

  var base_url = "https://gxsd.mobi/gxsdTeacherApk/gxsd-test"
  if(process.env.NODE_ENV === "development"){
    base_url = "http://localhost:8087"
  }
  return base_url
}


// 用户习惯
Vue.prototype.tellAndroidIOS_user_habbit = function (){

  var user_habbit = JSON.stringify(this.$store.state.user_habbit)
  // 安卓
  try { CallAndroidOrIOS.callAndroid("用户习惯", user_habbit) }
  catch(error) { }
  // 苹果
  try { window.webkit.messageHandlers.messageSend.postMessage({a:'用户习惯', b:user_habbit}) }
  catch(error) { }
}


// 分享检测成绩
Vue.prototype.tellAndroidIOS_share_reading_score = function (data){

  // 安卓
  try { CallAndroidOrIOS.callAndroid(data, "") }
  catch(error) { }
  // 苹果
  try { window.webkit.messageHandlers.messageSend.postMessage({a:data}) }
  catch(error) { }
}


// 把每篇文章阅读时长发送给原生存起来，防止小孩子第一遍读完后，第二遍快速作弊
Vue.prototype.tellAndroidIOS_seve_read_accum_time = function (data){

  var accum_time = JSON.stringify(data)
  // 安卓
  try { CallAndroidOrIOS.callAndroid("文章阅读时长", accum_time) }
  catch(error) { }
  // 苹果
  try { window.webkit.messageHandlers.messageSend.postMessage({a:'文章阅读时长', b:accum_time}) }
  catch(error) { }
}

// Vue页面已加载
Vue.prototype.TelliOSORAndroid_GetCurrentLocMounted=function (){

  // 安卓
  try { CallAndroidOrIOS.callAndroid("获取当前位置页面已加载", ""); }
  catch(error) { }
  // 苹果
  try { CallAndroidOrIOS("获取当前位置页面已加载", ""); }
  catch(error) { }

  try { window.webkit.messageHandlers.messageSend.postMessage({a:'获取当前位置页面已加载'}) }
  catch(error) { }
}

// Vue页面已加载
Vue.prototype.TelliOSORAndroid_class_share=function (url){

  console.log(url)
  // 安卓
  try { CallAndroidOrIOS.callAndroid("邀请加入班级", url); }
  catch(error) { }
  try { CallAndroidOrIOS.callAndroid("邀请加入班级", url, "家长们，快帮助孩子加入我的班级吧！", "让孩子提高阅读速度"); }
  catch(error) { }
  // 苹果
  try { CallAndroidOrIOS("邀请加入班级", url); }
  catch(error) { }

  try { window.webkit.messageHandlers.messageSend.postMessage({ a:'分享链接', b:url, c:'家长们，快帮助孩子加入我的班级吧！', d:'让孩子提高阅读速度' }) }
  catch(error) { }
}

// 微信分享网页
Vue.prototype.TelliOSORAndroid_share_url=function (url, title, description){

  // 安卓
  try { CallAndroidOrIOS.share_url(url, title, description) }
  catch(error) { }
  // 苹果
  try { window.webkit.messageHandlers.messageSend.postMessage({ a:'分享链接', b:url, c:title, d:description }) }
  catch(error) { }
}

//http请求
Vue.prototype.httpRequest = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  var loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  Axios.post(that.HOST + url, qs.stringify(params))
  .then(function(res){

    console.log(res)

    loading.close()

    if(res.data.code == 200){

      success(res.data)

    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    loading.close()
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_body = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  var loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  Axios.post(that.HOST + url, params)
  .then(function(res){

    console.log(res)

    loading.close()

    if(res.data.code == 200){

      success(res.data)

    }else if(res.data.code == 401){

      that.$toast({message:"token验证失败", type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else if(res.data.code == 402){

      that.$toast({message:res.message, type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    console.log(res.message)
    loading.close()

    if(that.$store.state.request_timed_out_list.indexOf(url) == -1){
      console.log("添加")
      that.$store.state.request_timed_out_list.push(url)
    }else{
      console.log("已存在，无操作")
    }
    console.log("结果")
    console.log(that.$store.state.request_timed_out_list)
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_body_token = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  var loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  if(!store.state.token){
    router.push('/');
  }

  Axios.post(that.HOST + url, params,
    {
      headers: {
        'Content-Type': 'application/json',
        "token": store.state.token
      },
    }
  ).then(function(res){

    console.log(res)

    loading.close()

    if(res.data.code == 200){

      success(res.data)

    }else if(res.data.code == 401){

      that.$toast({message:"token验证失败", type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else if(res.data.code == 402){

      that.$toast({message:res.message, type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    console.log(res.message)
    loading.close()

    if(that.$store.state.request_timed_out_list.indexOf(url) == -1){
      console.log("添加")
      that.$store.state.request_timed_out_list.push(url)
    }else{
      console.log("已存在，无操作")
    }
    console.log("结果")
    console.log(that.$store.state.request_timed_out_list)
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_body_token_no_loading = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  if(!store.state.token){
    router.push('/');
  }
  console.log(params)

  Axios.post(that.HOST + url, params,
    {
      headers: {
        'Content-Type': 'application/json',
        "token": store.state.token
      }
    }
  ).then(function(res){

    console.log(res)

    if(res.data.code == 200){

      success(res.data)

    }else if(res.data.code == 401){

      that.$toast({message:"token验证失败", type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else if(res.data.code == 402){

      that.$toast({message:res.message, type:'', position:'bottom', duration:'2000'})
      router.push('/');
    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    console.log(res.message)

    if(that.$store.state.request_timed_out_list.indexOf(url) == -1){
      console.log("添加")
      that.$store.state.request_timed_out_list.push(url)
    }else{
      console.log("已存在，无操作")
    }
    console.log("结果")
    console.log(that.$store.state.request_timed_out_list)
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_token = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  var loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  if(!store.state.token){
    router.push('/');
  }

  Axios.post(that.HOST + url, qs.stringify(params),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "token": store.state.token
      }
    }
  ).then(function(res){

    console.log(res)

    loading.close()

    if(res.data.code == 200){

      success(res.data)

    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    console.log(res.message)
    loading.close()

    if(that.$store.state.request_timed_out_list.indexOf(url) == -1){
      console.log("添加")
      that.$store.state.request_timed_out_list.push(url)
    }else{
      console.log("已存在，无操作")
    }
    console.log("结果")
    console.log(that.$store.state.request_timed_out_list)
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_token_no_loading = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  if(!store.state.token){
    router.push('/');
  }

  Axios.post(that.HOST + url, qs.stringify(params),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "token": store.state.token
      }
    }
  ).then(function(res){

    console.log(res)

    if(res.data.code == 200){

      success(res.data)

    }else{

      that.$toast({message:res.data.message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    console.log(res.message)

    if(that.$store.state.request_timed_out_list.indexOf(url) == -1){
      console.log("添加")
      that.$store.state.request_timed_out_list.push(url)
    }else{
      console.log("已存在，无操作")
    }
    console.log("结果")
    console.log(that.$store.state.request_timed_out_list)
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

//http请求
Vue.prototype.httpRequest_login = function (url, params, success){

  var that = this

  console.log(that.HOST + url)

  var loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  Axios.post(that.HOST + url, qs.stringify(params))
  .then(function(res){

    console.log(res)

    loading.close()

    if(res.data.code == 200){

      success(res.data)

    }else{

      var message
      if(res.data.message){

        message = res.data.message

      }else{

        message = url + "请求失败"
      }
      that.$toast({message:message, type:'', position:'bottom', duration:'2000'})
    }
  })
  .catch(function(res){

    console.log(res)
    loading.close()
    that.$toast({message:"请求超时！  " + res, type:'', position:'bottom', duration:'3000'})
  })
}

// -----------------------------------------------------设置cookie （开发时刷新后token丢失） 开始--------------------------------------------------------------

//设置cookie
Vue.prototype.set_token = function(token){

    var exdate = new Date() //获取时间

    exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * 365) //保存的天数

    //字符串拼接cookie
    window.document.cookie = "c_token" + "=" + token + ";path=/;expires=" + exdate.toGMTString()
}
//读取cookie
Vue.prototype.get_token = function(e){

    if (document.cookie.length > 0) {

      var arr = document.cookie.split('; ')  //这里显示的格式需要切割一下自己可输出看下

      for(var i=0; i < arr.length; i++){

        var arr2 = arr[i].split('=')         //再次切割

        //判断查找相对应的值
        if(arr2[0] == "c_token"){

          return arr2[1]
        }
      }
    }
}
//清除cookie
Vue.prototype.clearCookie = function () {

    this.setCookie("","",-1);//修改2值都为空，天数为负1天就好了
}

// ----------------------------------------------------- 公共方法 --------------------------------------------------------------

// 获取当前时间并处理时间格式
// 2020-01（当前月份，type=y-m时）
// 2020-01-01（月份第一天，type=y-m-d-f时）
// 2020-01-09（当前时间，type=y-m-d）
// 2020-01-09 12：00：00（当前时间）
Vue.prototype.getNowTime=function (type){
  var date = new Date(),getMonth,getDate,getHours,getMinutes,getSeconds
  function timeFormat(time_format,name_format){
    if(time_format < 10){
      return "0" + time_format
    }else{
      return time_format
    }
  }
  getDate = timeFormat(date.getDate(),getDate)
  // 处理月份时间格式
  if(date.getMonth() + 1 < 10){
    getMonth = "0" + (date.getMonth() + 1)
  }else{
    getMonth = date.getMonth() + 1
  }
  if(type && type == 'y-m'){
    return  date.getFullYear() + "-" + getMonth
  }else if(type && type == 'y-m-d'){
    return  date.getFullYear() + "-" + getMonth + "-" + getDate
  }else if(type && type == 'y-m-d-non-0'){
    return  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + getDate
  }else if(type && type == 'y-m-d-f'){
    return  date.getFullYear() + "-" + getMonth + "-01"
  }else{
    getHours = timeFormat(date.getHours(),getHours)
    getMinutes = timeFormat(date.getMinutes(),getMinutes)
    getSeconds = timeFormat(date.getSeconds(),getSeconds)
    return  date.getFullYear() + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds
  }
}

// 时间戳转为 2020-8-20 20:11:59
Vue.prototype.get_y_m_d_h_m_s = function(value){
  let date = new Date(value)
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}

// date转字符串，格式：2020-8-19 16:41
Vue.prototype.get_y_m_d_h_m = function(date){
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? "0" + MM : MM
  let d = date.getDate()
  d = d < 10 ? "0" + d : d
  let h = date.getHours()
  h = h < 10 ? "0" + h : h
  let m = date.getMinutes()
  m = m < 10 ? "0" + m : m
  return y + "-" + MM + "-" + d + " " + h + ":" + m
}

Vue.prototype.is_allow_read = function(date){
  if(this.$store.state.login_cellphone.name == "" ||
    this.$store.state.login_cellphone.name == undefined ||
    this.$store.state.login_cellphone.name == null ||

    this.$store.state.login_cellphone.organizationName == "" ||
    this.$store.state.login_cellphone.organizationName == undefined ||
    this.$store.state.login_cellphone.organizationName == null ||

    this.$store.state.login_cellphone.gradeName == "" ||
    this.$store.state.login_cellphone.gradeName == undefined ||
    this.$store.state.login_cellphone.gradeName == null ||

    this.$store.state.login_cellphone.className == "" ||
    this.$store.state.login_cellphone.className == undefined ||
    this.$store.state.login_cellphone.className == null
    ){
    return false
  }else{
    return true
  }
}

// 获取以后日期，格式：2020-8-19，
// 参数：increase，增量。例如明天就是1
Vue.prototype.get_tomorrow_y_m_d = function(increase){
  var tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + increase)
  tomorrow = this.get_y_m_d_h_m(tomorrow)
  return tomorrow.substr(0, 10)
}


// 拦截器
Axios.interceptors.request.use(function(config) {

  console.log(config.data)

  config.timeout = 30000
  return config
}, function(error) {
  return Promise.reject(error)
})

Axios.interceptors.response.use(function(response) {
  return response
}, function(error) {
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  Axios,
  store,
  components: { App },
  template: '<App/>'
})
