<template>
  <div class="login_cellphone">
    
    <div class="container">
		  <div class="logo">
        <div class="logo-img"><img src="static/img/login/logo.png"></div>
        <!-- <div class="logo-text">新用户登录即可享受3天VIP</div> -->
      </div>
      <div class="i-iphone">
        <div>
          <div><div><img src="static/img/login/i-input-triangle.png"></div><span>+86</span></div>
          <div><input v-model="cellphone" placeholder='请输入手机号'></div>
        </div>
        <div>
          <div><img src="static/img/login/i-input-maill.png"></div>
          <div><input v-model="verificationCode" placeholder='短信验证码'>
            <div class="verCode" @click='getVerificationCode()'>获取动态码</div>
          </div>
        </div>
      </div>
      <div class="protocol">
        <div class="protocol-img" @click='protocol_agree()'><img class="protocol-img-" src="static/img/login/i-protocol-yes.png"></div>
        <div class="protocol-text"><span>登录即同意</span><span  @click='protocol_content()'>《高效速读》用户协议</span> 和<span  @click='to_privacyPolicy()'>《隐私政策》</span></div>
      </div>

      <div v-if="$store.state.role_type == 0" class="btn" @click='login_tch()'>老师登录</div>
      <div v-if="$store.state.role_type == 0" class="btn" @click='login_stu()'>学生登录</div>

      <div v-if="$store.state.role_type == 2" class="btn" @click='login_tch()'>登录</div>
      <div v-if="$store.state.role_type == 1" class="btn" @click='login_stu()'>登录</div>

      <!-- <div class="look" @click='look()'>随便看看</div> -->
      <div class="wechat-d" ref="ThirdPartyLogin" @click='wechat()'>
        <img src="static/img/login/wechat.png">
        <div class="wechat-text">微信登录</div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import $ from "jquery"
  export default{
    name:"login_cellphone",
    data(){
      return{
        cellphone: "",               //手机号
        verificationCode: "",        //验证码
        verCode_click_able: true,    //验证码按钮是否可用
        timer: "",                   //定时器
        verCode_cd: 60,              //倒计时
        protocol: true,              //是否选中协议 
      }
    },
    mounted(){

      window.WXBind_NO_Ajax = this.WXBind_NO_Ajax
      window.WXBind_YES_Ajax = this.WXBind_YES_Ajax
      window.LM_AndroidIOSToVue_userInfo = this.LM_AndroidIOSToVue_userInfo
      window.LM_AndroidIOSToVue_userHabbit = this.LM_AndroidIOSToVue_userHabbit
      window.WXInstall_Check_Ajax = this.WXInstall_Check_Ajax
      window.VersionShow = this.VersionShow
      window.Device_Ajax = this.Device_Ajax;
      this.loginVueMounted()
    },
    created(){

      // 15112666706
      var that = this
      if(this.$store.state.role_type == 0){

        this.cellphone = 13726027405
        this.verificationCode = 999999
      }
    },
    beforeDestroy(){

      console.log("对象准备死掉")
      // 去除定时器
      window.clearInterval(this.timer)
    },
    methods:{

      // App版本号
      VersionShow:function(v) {

        this.$store.state.App_Version = v
      },
      Device_Ajax:function(d) {

        this.$store.state.Device = d
      },
      // 检查手机是否安装微信，以免App Store审核被拒
      WXInstall_Check_Ajax:function(isInstall) {

        if(isInstall == "NO") {

          this.$refs['ThirdPartyLogin'].remove();
        }
      },
      loginVueMounted:function(){

        // 安卓
        try { CallAndroidOrIOS.callAndroid("登录页面已加载", "") } 
        catch(error) { }
        // 苹果
        try { window.webkit.messageHandlers.messageSend.postMessage({a:'登录页面已加载'}) }
        catch(error) { }
      },
      WXBind_NO_Ajax:function(openid) {

        this.$store.state.WX_Openid = openid
        this.$router.push("Binding")
      },
      WXBind_YES_Ajax:function(data) {

        // alert(data)
        var user_info = JSON.parse(data)
        // alert(user_info.token)
        this.tellAndroidIOS_seve_userInfo(user_info)
        this.$store.state.login_cellphone = user_info
        this.$store.state.token = user_info.token
        this.next()
      },
      LM_AndroidIOSToVue_userInfo(userInfo){

        var that = this
        // 有token，表示退出到此页面
        if(this.$store.state.token.length > 0){
          this.cellphone = this.$store.state.login_cellphone.phone
        }else{
          var user_info = JSON.parse(userInfo)
          // 免登录，用帐号+密码
          var postData = {
            "account": user_info.phone, // 手机号
            "password": user_info.prePassword,      // 密码
            "accountType": this.$store.state.role_type,
          }
          this.login_request(postData)
        }
      },
      LM_AndroidIOSToVue_userHabbit(habbitInfo){

        var habbit_info = JSON.parse(habbitInfo)
        this.$store.state.user_habbit = habbit_info
      },
      login_request(postData){

        var that = this
        this.httpRequest_login("read/readUser/login", postData, function(res){

          that.tellAndroidIOS_seve_userInfo(res.data)
          that.$store.state.login_cellphone = res.data
          that.$store.state.token = res.data.token
          that.next()
        })
      },
      // 获取个人资料，跳转到首页
      next(){

        var that = this
        this.httpRequest_token_no_loading("app/user/findUserInfo", {"userId": that.$store.state.login_cellphone.userId}, function(res){
          var accountType = that.$store.state.login_cellphone.accountType
          that.$store.state.login_cellphone = res.data
          that.$store.state.login_cellphone.accountType = accountType
          if(res.data.accountType == 2){
            that.$router.push("index_tch")
          }else{
            that.$router.push("index")
          }
        })
      },
      // 把用户信息发送给原生存起来，用于自动登录
      tellAndroidIOS_seve_userInfo(data){

        var user_info = JSON.stringify(data)
        // 安卓
        try { CallAndroidOrIOS.callAndroid("用户信息", user_info) } 
        catch(error) { }
        // 苹果
        try { window.webkit.messageHandlers.messageSend.postMessage({a:'用户信息', b:user_info}) }
        catch(error) { }
      },
      getVerificationCode(){

        var that = this

        if(this.cellphone == ""){
          this.$toast({message:"手机号不能为空", type:'', position:'bottom', duration:'2000'})
          return
        }

        if(this.verCode_click_able == false){
          return
        }

        var postData = {
          "phone": this.cellphone, //手机号
          "type": "3", //1 注册验证码，2修改密码验证码, 3 验证码登录
        }
        this.httpRequest("app/user/sendPhoneCode", postData, function(res){

          that.$toast({message:"发送成功", type:'', position:'bottom', duration:'2000'})
        })

        this.verCode_cd = 60
        this.timer = window.setInterval(function(){

          that.verCode_cd --
          if(that.verCode_cd == 0){
            window.clearInterval(that.timer)
            $(".verCode").html("获取动态码")
            $(".verCode").css("color", "#4EA3FE")
            that.verCode_click_able = true
          }else{
            $(".verCode").html(that.verCode_cd + "S")
            $(".verCode").css("color", "#999999")
            that.verCode_click_able = false
          }
        }, 1000)

      },
      protocol_agree(){

        if(this.protocol == true){
          $(".protocol-img-").attr("src", "static/img/login/i-protocol-no.png")
          this.protocol = false
        }else{
          $(".protocol-img-").attr("src", "static/img/login/i-protocol-yes.png")
          this.protocol = true
        }
      },
      protocol_content(){

        this.$router.push("protocol")
      },
      to_privacyPolicy(){
        this.$router.push("privacy_policy")
      },
      login_tch(){

        this.login_http(2)
      },
      login_stu(){

        this.login_http(1)
      },
      login_http(accountType){

        if(this.protocol == false){
          this.$toast({message:"请同意《高效速读》用户协议", type:'', position:'bottom', duration:'2000'})
          return
        }
        if(this.cellphone == ""){
          this.$toast({message:"手机号不能为空", type:'', position:'bottom', duration:'2000'})
          return
        }
        if(this.verificationCode == ""){
          this.$toast({message:"验证码不能为空", type:'', position:'bottom', duration:'2000'})
          return
        }

        var that = this

        var postData = {
          "cellphone": this.cellphone, //手机号
          "APPLOGIN": "T",
          "yzm": this.verificationCode,
        }

        postData = {
          "account": "13602553839", //手机号
          "password": "3a4d9bb19633f8693503fa384abb7be2",
          "accountType": "1",
        }

        postData = {
          "account": this.cellphone, //手机号
          "yzm": this.verificationCode,
          "accountType": accountType,
        }

        this.login_request(postData)
      },
      look(){

        this.$store.state.login_cellphone.phone = "游客"
        this.$store.state.login_cellphone.userId = 1001
        this.$router.push("index")
      },
      wechat(){

        // 安卓
        try { CallAndroidOrIOS.callAndroid("微信登录","") } 
        catch(error) { }
        // 苹果
        try { window.webkit.messageHandlers.messageSend.postMessage({a:'微信登录'}) } 
        catch(error) { }

        try{
          plus.plugintest.PluginWechatLoginFunction("", function( result ){
            return
          }, function(result){
            return
          })
        }catch(error){ }
      }
    }
  }
</script>
<style lang="less" scoped>
  .login_cellphone{
    overflow: hidden;
    .container{
      overflow: hidden;
      padding-left: 60/50rem;
      margin-right: 60/50rem;
      .logo{
        margin-top: 100/50rem;
        .logo-img{
          width: 170/50rem;
          height: 200/50rem;
          margin: 0 auto;
          img{
            height: 100%;
          }
        }
        .logo-text{
          width: 350/50rem;
          margin: 0 auto;
          color: #999999;
          margin-top: 20/50rem;
          font-size: 28/50rem;
        }
      }
      .i-iphone{
        margin-top: 100/50rem;
        &>div{
          border-bottom: 1/50rem solid  #999999;
          input{
            outline: none;
            background: transparent;
            border: none;
            height: 100%;
            width: 100%;
          }
          input::-webkit-input-placeholder {
            font-size: 32/50rem;
            color: #999999;
          }
          input::-moz-input-placeholder {
            font-size: 32/50rem;
            color: #999999;
          }
          input::-ms-input-placeholder {
            font-size: 32/50rem;
            color: #999999;
          }
          &:nth-child(1){
            height: 80/50rem;
            &>div{
              overflow: hidden;
              height: 100%;
              &:nth-child(1){
                font-size: 32/50rem;
                width: 22%;
                float: left;
                line-height: 80/50rem;
                span{
                  float: right;
                  margin-right: 7/50rem;
                  color: #666666;
                }
                &>div{
                  width: 30/50rem;
                  height: 80%;
                  float: right;
                  text-align: center;
                  margin-right: 8/50rem;
                  img{
                    width: 15/50rem;
                    vertical-align: middle;
                  }
                }
              }
              &:nth-child(2){
                float: left;
                width: 78%;
              }
            }
          }
          &:nth-child(2){
            margin-top: 40/50rem;
            height: 80/50rem;
            &>div{
              overflow: hidden;
              height: 100%;
              &:nth-child(1){
                width: 22%;
                float: left;
                line-height: 60/50rem;
                text-align: center;
                img{
                  width: 40/50rem;
                  vertical-align: middle;
                  margin-left: 40/50rem;
                }
              }
              &:nth-child(2){
                float: left;
                width: 78%;
                input{
                  float: left;
                  width: 65%;
                }
                &>div{
                  font-size: 32/50rem;
                  height: 100%;
                  float: left;
                  width: 35%;
                  line-height: 80/50rem;
                  color: #4EA3FE;
                }
              }
            }
          }
          .verCode{
            text-align: center;
          }
        }
      }
      .btn{
        margin-top: 80/50rem;
        height: 86/50rem;
        background-color: red;
        border-radius: 149/50rem;
        line-height: 86/50rem;
        text-align: center;
        color: white;
        background: linear-gradient(0.25turn, #99cafb, #4da4fa);
        font-size: 32/50rem;
      }
      .look{
        width: 130/50rem;
        margin: 0 auto;
        margin-top: 15/50rem;
        font-size: 30/50rem;
        padding: 30/50rem;
        color: #1B9BFE;
      }
      .wechat-d{
        width: 116/50rem;
        height: 130/50rem;
        margin: 30/50rem auto 0 auto;
        padding: 20/50rem;
        img{
          width: 80%;
          margin-left: 12/50rem;
        }
        .wechat-text{
          font-size: 28/50rem;
        }
      }
      .protocol{
        width: (750 - 60 - 60)/50rem;
        height: 50/50rem;
        margin-top: 30/50rem;
        .protocol-img{
          width: 50/50rem;
          height: 100%;
          float: left;
          img{
            width: 70%;
            vertical-align: middle;
          }
        }
        .protocol-text{
          width: 80%;
          height: 100%;
          font-size: 24/50rem;
          line-height: 50/50rem;
          float: left;
          &>span:nth-child(1){
            color: #999999;
          }
          &>span:nth-child(2){
            color: #1B9BFE;
          }
          &>span:nth-child(3){
            color: #1B9BFE;
          }
        }
      }
    }
  }
</style>