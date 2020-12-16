import Vue from 'vue'
import Router from 'vue-router'

// 登录
import start from '@/pages/login/start'
import login_cellphone from '@/pages/login/login_cellphone'
import protocol from '@/pages/login/protocol'
import Binding from '@/pages/login/Binding'

// 首页
import index from '@/pages/index/index'
import index_tch from '@/pages/index/index_tch'
// 阅读存折
import read_passbook from '@/pages/read/read_passbook'

// 我的
import my from '@/pages/my/my'
import personal_info from '@/pages/my/personal_info'
import send_lnglat from '@/pages/my/send_lnglat'
import setting from '@/pages/my/setting'
import about from '@/pages/my/about'
import privacy_policy from '@/pages/my/privacy_policy'

// 任务列表 - 老师
import task_tch from '@/pages/task_tch/task_tch'

// 任务列表 - 学生
import task_stu from '@/pages/task_stu/task_stu'

//阅读评测
import read from '@/pages/read_review/read'
import review from '@/pages/read_review/review'
import test from '@/pages/read_review/test'
import share from '@/pages/read_review/share'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: start
    },
    {
      path: '/login_cellphone',
      name: 'login_cellphone',
      component: login_cellphone
    },
    {
      path: '/protocol',
      name: 'protocol',
      component: protocol
    },
    {
      path: '/Binding',
      name: 'Binding',
      component: Binding
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/index_tch',
      name: 'index_tch',
      component: index_tch
    },
    {
      path: '/read_passbook',
      name: 'read_passbook',
      component: read_passbook
    },
    {
      path: '/my',
      name: 'my',
      component: my
    },
    {
      path: '/personal_info',
      name: 'personal_info',
      component: personal_info
    },
    {
      path: '/send_lnglat',
      name: 'send_lnglat',
      component: send_lnglat
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/privacy_policy',
      name: 'privacy_policy',
      component: privacy_policy
    },
    {
      path: '/task_tch',
      name: 'task_tch',
      component: task_tch
    },
    {
      path: '/task_stu',
      name: 'task_stu',
      component: task_stu
    },
	{
      path: '/read',
      name: 'read',
      component: read
    },
    {
      path: '/review',
      name: 'review',
      component: review
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
	    {
      path: '/share',
      name: 'share',
      component: share
    },
  ]
})
