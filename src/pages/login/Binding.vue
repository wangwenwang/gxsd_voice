<template>
  <div class="Binding">
	<!-- 头部 -->
    <header_index title='微信登录绑定' :back_icon='true' @back='back'></header_index>
	<div class="container">
	  <div class="prompt"><p>高效速读</p><p class="p-2">首次使用请先绑定账号</p></div>
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
      <div class="btn" @click='bind()'>关联</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
import $ from "jquery"
  export default{
  	name:"Binding",
  	data(){
  	  return{
        cellphone: "",               //手机号
        verificationCode: "",        //验证码
        verCode_click_able: true,    //验证码按钮是否可用
        timer: "",                   //定时器
        verCode_cd: 60               //倒计时
  	  }
  	},
	components:{
      header_index
	},
    beforeDestroy(){

      console.log("对象准备死掉")
      // 去除定时器
      window.clearInterval(this.timer)
    },
    mounted(){

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
	methods:{
    
      onBrowserBack() {
        
        this.back()
      },
  	  // 返回上一页
      back(){
        this.$router.go(-1);
      },
	  // 绑定
      bind(){

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
          "account": this.cellphone, //手机号
          "yzm": this.verificationCode,
          "openId": this.$store.state.WX_Openid,
          "accountType": this.$store.state.role_type,
          // "wxOpenid": "oMs54s4wnXmOUIMnt9lu_sayyalQ"
        }
        this.httpRequest_login("read/readUser/login", postData, function(res){

          var user_info = JSON.stringify(res.data)

          if(user_info != "\"\"") {

            that.$store.state.login_cellphone = res.data
            that.$store.state.token = res.data.token

            that.$router.push("index")
          }else{

            that.$toast({message:"关联成功", type:'', position:'bottom', duration:'2000'})
            that.$router.push("login_cellphone")
          }
        })
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
	}
  }
</script>
<style lang="less" scoped>
  .Binding{
	overflow: hidden;
    .container{
      overflow: hidden;
      padding-left: 60/50rem;
      margin-right: 60/50rem;
      .prompt{
      	p{
      		font-size: 30/50rem;
      		font-weight: 800/50rem;
      	}
      	margin-top: 90/50rem;
      	.p-2{
      		margin-top: 20/50rem;
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
        background-color: #0095f4;
        border-radius: 149/50rem;
        line-height: 86/50rem;
        text-align: center;
        color: white;
        font-size: 33/50rem;
      }
    }
  }	
</style>