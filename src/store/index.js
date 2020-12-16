import Vue from "vue"
import vuex from "vuex"

Vue.use(vuex);

export default new vuex.Store({
	state:{

		token:"",

		// 用户信息
		login_cellphone:{"id":"","phone":""},

		// 首页书籍
		index_books:[{'title':''}, {'title':''}, {'title':''}, {'title':''}],

		// 消息列表
		msg_list:[],

		// 文章列表
		read_list:[],

		// 请求超时列表
		request_timed_out_list:[],

		// type: 阅读模式 单篇阅读/单篇检测
		record_read: {id:"",type:"",start_time:"",end_time:"",accum_time:{}},

        // 阅读速度
		read_speed_and_range: {speed:200,range:0},

		// 课内/课外
		books: {class_index:2,type:"课内",v_u_d:"上册"},

		// 用户正在阅读的书籍
		book_reading: {},

		// 整本检测，还是单篇检测
		whole_or_single: "",

		// 微信登录 Openid
		WX_Openid:'',

		// z_catalog 上一个vue
		back__z_catalog: "",

		// App版本号
		App_Version:"",

		// poi坐标
		send_lnglat:{"lng":0,"lat":0},

		// 存折汇总，给分享页面用，该页面一闪而过没时间请求接口
		read_passbook: {},

		// push压栈，升级定制路由，支持query
		push_list:[{'name':'', 'query':{}}],

		// 用户习惯
		user_habbit:{"task_pick_sxc_item":{}},    

		// 用户使用的设备（例如iOS, android）
		Device:"",

		// 老师发布任务时，支持多单元发布
		task_pick_chosen_article: [],

		// 角色类型，1 学生，2 老师，0 老师和学生
		role_type: 2,

		// vue版本号
		version: 16,
	}
})