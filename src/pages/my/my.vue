<template>
  <div class="my">
    
    <div class="container">
		  <div class="bg">
        <img src="static/img/my/my-bg.png">
      </div>
      <div class="top">
        <div class="d-adv" @click="modi_adv()">
          <el-upload
            class="avatar-uploader"
            action= "https://www.gxsd.mobi/gxsd-test/system/upload"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :disabled='$store.state.Device == "iOS" && $store.state.role_type == 1'
            :show-file-list="false">
            <img :src="$store.state.login_cellphone.icon?$store.state.login_cellphone.icon:avatar_default"" class="avatar-content">
          </el-upload>
          <img class="i-vip" src="static/img/my/i-vip.png">
        </div>
        <div class="idx">ID：{{ $store.state.login_cellphone.userId }}</div>
        <div class="tel">{{ $store.state.login_cellphone.phone }}</div>
        <div class="user-sex">{{ $store.state.login_cellphone.name }}<img class="i-vip" :src="'static/img/my/i-sex-' + $store.state.login_cellphone.sex + '.png'" @click="modi_sex_click('name')"></div>
      </div>

       <div class="mid">
        <div @click="share()">
          <div><img src="static/img/my/i-gift.png"></div>
          <div><p>邀请有礼</p><p>得7天VIP</p></div>
        </div>
        <div><div class="fds"></div></div>
        <div>
          <div><img src="static/img/my/i-badge.png"></div>
          <div><p>VIP续费</p><p>2020-03-01到期</p></div>
        </div>
      </div> 

      <div class="bottom">

<!--         <div>
          <div class="left">
            <img src="static/img/my/i-invitation-recordr.png">
          </div>
          <div class="right">
            <span>邀请记录</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div> -->

        <div @click="to_personal_info()">
          <div class="left">
            <img src="static/img/my/i-my-account.png">
          </div>
          <div class="right">
            <span>我的账户</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div>

        <div v-if="$store.state.login_cellphone.accountType == 2" @click="to_class_man()">
          <div class="left">
            <img src="static/img/my/i-my-account.png">
          </div>
          <div class="right">
            <span>班级管理</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div>

<!--         <div>
          <div class="left">
            <img src="static/img/my/i-money.png">
          </div>
          <div class="right">
            <span>已购买订单</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div> -->

<!--         <div>
          <div class="left">
            <img src="static/img/my/i-offline-courses.png">
          </div>
          <div class="right">
            <span>线下课程</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div> -->

        <div @click="to_setting()">
          <div class="left">
            <img src="static/img/my/i-setting.png">
          </div>
          <div class="right">
            <span>设置</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div>

        <div @click="to_userProtocol()">
          <div class="left">
            <img src="static/img/my/i-privacy.png">
          </div>
          <div class="right">
            <span>用户协议</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div>

        <div @click="to_privacyPolicy()">
          <div class="left">
            <img src="static/img/my/i-privacy.png">
          </div>
          <div class="right">
            <span>隐私政策</span>
            <img src="static/img/my/i-push.png">
          </div>
        </div>

      </div>

    </div>
    <footer_index/>
  </div>
</template>
<script type="text/javascript">
import footer_index from '../../components/footer.vue'
  export default{
    name:"my",
    data(){
      return{

        avatar_default: "static/img/my/i-adv.png",  // 默认头像
      }
    },
    components:{
      footer_index
    },
    created(){

    },
    methods:{
      to_personal_info(){

        this.$router.push("personal_info")
      },
	  share(){

        this.$router.push("share")
      },
      modi_adv(){

        if(this.$store.state.Device == "iOS" && this.$store.state.role_type == 1){

          this.$message.success("苹果端正在审核，请稍等...")
        }
      },
      uploadSuccess(res, file, fileList){

        this.update_usrinfo("icon", res.data)
      },
      beforeAvatarUpload(file) {

        var that = this;
        return new Promise(function(resolve, reject){

          var image = new Image();
          image.src = URL.createObjectURL(file);

          image.onload = function(){
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            var initSize = image.src.length
            var { width } = image, { height } = image
            if(width > 1500 || height > 1500){
              width = width / 2
              height = height / 2
            }
            canvas. width = width
            canvas.height = height
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(image, 0, 0, width, height)
            
            // 进行最小压缩0.1
            var compressData = canvas.toDataURL('image/jpeg', 0.1)
            
            // 压缩后调用方法进行base64转Blob，方法写在下边
            var byteString;
            if(compressData.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(compressData.split(',')[1])
            }else {
                byteString = unescape(compressData.split(',')[1])
            }
            var mimeString = compressData
                .split(',')[0]
                .split(':')[1]
                .split(';')[0];
            var ia = new Uint8Array(byteString.length)
            for( var i = 0; i < byteString.length; i += 1) {
                ia[i] = byteString.charCodeAt(i)
            }

            console.log(new Blob([ia], {type: mimeString}))
            var qwe = new Blob([ia], {type: mimeString});

            resolve(qwe)
          }
        })
      },
      to_class_man(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("class_man")
      },
      to_setting(){

        this.$router.push("setting")
      },
      to_userProtocol(){
        this.$router.push("protocol")
      },
      to_privacyPolicy(){
        this.$router.push("privacy_policy")
      },
      modi_sex_click(){

        this.$createActionSheet({
          title: '请选择性别',
          data: [
            {
              content: '男',
              value: '1',
            },
            {
              content: '女',
              value: '2',
            }
          ],
          onSelect: (item, index) => {

            this.update_usrinfo("sex", item.value)
          }
        }).show()
      },
      update_usrinfo(key, value){

        var that = this

        var postData = {
          [key]: value,
          "userId": this.$store.state.login_cellphone.userId,
        }
        this.httpRequest_token("app/user/updateUserInfo", postData, function(res){

          that.request_info()
          that.$message.success("修改成功")
        })
      },
      request_info(){

        var that = this
        var postData = {
          "userId": this.$store.state.login_cellphone.userId
        }
        this.httpRequest_token_no_loading("app/user/findUserInfo", postData, function(res){

          that.$store.state.login_cellphone = res.data
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .my{
    height: 100%;
    overflow: hidden;
    .container{
      height: 100%;
      overflow: hidden;
      background: linear-gradient(0.5turn, #8CD5F5, #EBF9FD);
      position: relative;
      z-index: 0;
      .bg{
        height: 432/50rem;
        width: 100%;
        position: fixed;
        z-index: -1;
        background-color: white;
        img{
          width: 100%;
          height: 230/50rem;
        }
      }
      .top{
        width: 100%;
        height: 332/50rem;
        margin-top: 100/50rem;
        .d-adv{
          width: 200/50rem;
          height: 200/50rem;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          .i-adv{
            width: 200/50rem;
            position: absolute;
            border-radius: 100/50rem;
          }
          .i-vip{
            width: 50/50rem;
            position: absolute;
            right: 20/50rem;
            bottom: 0;
          }
          .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
          .avatar-content{
            width: 200/50rem;
            height: 200/50rem;
            display: block;
            border-radius: 100/50rem;
          }
        }
        .idx{
          margin-top: -120/50rem;
          margin-right: 27/50rem;
          float: right;
          color: white;
          font-size: 24/50rem;
        }
        .tel{
          width: 100%;
          height: 50/50rem;
          line-height: 50/50rem;
          color: #333333;
          text-align: center;
          margin-top: 7/50rem;
          font-size: 29/50rem;
        }
        .user-sex{
          width: 100%;
          height: 50/50rem;
          line-height: 50/50rem;
          text-align: center;
          color: #333333;
          font-size: 29/50rem;
          img{
            height: 80%;
            vertical-align: middle;
            margin-left: 10/50rem;
            margin-top: -6/50rem;
          }
        }
      }
      .mid{
        height: 140/50rem;
        margin-top: 24/50rem;
        background: rgba(255, 255, 255, 0.85);
        &>div{
          height: 100%;
          line-height: 136/50rem;
          &:nth-child(1){
            float: left;
            width: 49%;
          }
          &:nth-child(2){
            float: left;
            width: 2%;
            &>div{           
              width: 1/50rem;
              height: 100%;
              background-color: #DDDDDD;
              position: relative;
            }
          }
          &:nth-child(3){
            float: right;
            width: 49%;
          }
          &>div:not(.fds){
            height: 100%;
            &:nth-child(1){
              float: left;
              width: (25 + 78 + 25)/50rem;
              img{
                margin-left: 25/50rem;
                width: 78/50rem;
                vertical-align: middle;
              }
            }
            &:nth-child(2){
              float: left;
              p{
                line-height:  37/50rem;
                &:nth-child(1){
                  padding-top: 34/50rem;
                  font-size: 40/60rem;
                  font-weight: bold;
                }
                &:nth-child(2){
                  margin-top: 9/50rem;
                  font-size: 30/60rem;
                  color: #666666;
                }
              }
            }
          }
        }
      }
      .bottom{
        margin-top: 25/50rem;
        background: rgba(255, 255, 255, 0.85);
        &>div{
          width: 100%;
          height: 90/50rem;
          .left{
            width: 120/50rem;
            height: 100%;
            float: left;
            text-align: center;
            img{
              width: 50/50rem;
              height: 50/50rem;
              margin-top: 25/50rem;
            }
          }
          .right{
            width: (750 - 120)/50rem;
            height: 100%;
            float: right;
            border-bottom: 1/50rem solid #DDDDDD;
            line-height: 90/50rem;
            img{
              height: 100%;
              float: right;
              margin-right: 40/50rem;
            }
          }
        }
      }
    }
  }
</style>