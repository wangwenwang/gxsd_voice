<template>
  <div class="personal_info">

    <header_index title='个人资料' :back_icon='true' @back='back'></header_index>

    <div class="container">

      <div class="d-adv">
        <span><span>&nbsp;&nbsp;</span>头像</span>
        <!-- <img class="nav" src="static/img/my/i-push.png"> -->
        <img class="i-adv" :src="$store.state.login_cellphone.icon?$store.state.login_cellphone.icon:avatar_default">
      </div>

      <div class="mid">

<!--         <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">用户ID</div>
            <div class="right-t">{{ $store.state.login_cellphone.userId }}</div>
          </div>
          <div class="right"></div>
        </div> -->
        
        <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t"><span>&nbsp;&nbsp;</span>账号</div>
            <div class="right-t">{{ $store.state.login_cellphone.phone }}</div>
          </div>
          <div class="right"></div>
        </div>

        <div class="cell" @click="modi_y_click('name')">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t"><span>* </span>姓名</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right">{{ na_me }}</div>
          </div>
          <div class="right"></div>
        </div>

        <div class="cell" @click="modi_school_click()">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t"><span>* </span>学校</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right">{{ schoo_l }}</div>
          </div>
          <div class="right"></div>
        </div>

        <div class="cell" @click="modi_grade_click()">
          <div class="left"></div>
          <div class="mid-">  
            <div class="left-t"><span>* </span>年级</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right">{{ grad_e }}</div>
          </div>
          <div class="right"></div>
        </div>

        <div class="cell" @click="modi_class_click()">
          <div class="left"></div>
          <div class="mid-">  
            <div class="left-t"><span>* </span>班级</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right">{{ className }}</div>
          </div>
          <div class="right"></div>
        </div>

      </div>

      <div class="mid bottom">

<!--         <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">会员类型</div>
            <div class="right-t">VIP</div>
          </div>
          <div class="right"></div>
        </div>

        <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">VIP到期日</div>
            <div class="right-t">2020-03-01</div>
          </div>
          <div class="right"></div>
        </div> -->

<!--         <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">微信号</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right">未设置</div>
          </div>
          <div class="right"></div>
        </div> -->

      </div>
		
    </div>

    <componentSelectBox v-if="SelectBoxFlag" v-bind:SelectBoxList='variable_list' @selectedItem='selectedItem' :BouncedName="BouncedName" @selectCancel="selectCancel"></componentSelectBox>

    <footer_index_no_menu/>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
import footer_index_no_menu from '../../components/footer_no_menu.vue'
import componentSelectBox from '@/components/componentSelectBox'
  export default{
    name:"personal_info",
    data(){
      return{

        na_me: "请填写您的姓名",
        schoo_l: "请选择所在学校",
        grad_e: "请选择所在年级",
        grad_list: [],
        class_list: [],
        variable_list: [],    　　  // 可变列表
        SelectBoxFlag: false,  　　 // 弹出选择框是否显示
        BouncedName: "",        // 弹框名字
        className: "请选择所在班级",
        avatar_default: "static/img/my/i-default-adv.png", //默认头像
      }
    },
    components:{
      header_index, 
      footer_index_no_menu,
      componentSelectBox
    },
    mounted(){

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
    created(){

      var that = this

      if(this.$store.state.send_lnglat.lng > 0){

        this.$router.push("send_lnglat")
      }

      this.httpRequest_token("app/user/findGrades", "", function(res){

        that.grad_list = res.data
        for(var i = 0; i < that.grad_list.length; i++){
          var item = that.grad_list[i]
          item.name = item.gradeName
        }
      })

      this.request_info()
    },
    methods:{
    
      onBrowserBack() {
        
        this.back()
      },
      back(){

        this.$router.push("my")
      },
      // 选中某个业务代码
      selectedItem(index){

        this.SelectBoxFlag = false
        if(this.BouncedName == "年级"){

          this.grad_e = this.variable_list[index].name
          this.modify("gradeId", this.variable_list[index].gradeId)
        }else if(this.BouncedName == "班级"){

          this.className = this.variable_list[index].name
          this.modify("classId", this.variable_list[index].classId)
        }
      },
      // 取消选择业务代码
      selectCancel(){
        this.SelectBoxFlag = false
      },
      modi_school_click(){

        this.$router.push("send_lnglat")
      },
      modi_grade_click(){

        this.variable_list = this.grad_list
        this.BouncedName = "年级"
        this.SelectBoxFlag = true
      },
      modi_class_click(){

        this.variable_list = this.class_list
        this.BouncedName = "班级"
        this.SelectBoxFlag = true
      },
      modi_y_click(key){

        var prompt_name
        if(key == "name"){
          prompt_name = "姓名"
        }
        this.$prompt('请输入' + prompt_name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {

          this.modify(key, value)
        }).catch(() => { })
      },
      request_info(){

        var that = this

        var postData = {
          "userId": this.$store.state.login_cellphone.userId
        }
        this.httpRequest_token_no_loading("app/user/findUserInfo", postData, function(res){

          that.$store.state.login_cellphone = res.data
          if(res.data.name.length > 0){

            that.na_me = res.data.name
          }
          if(res.data.organizationName.length > 0){
            
            that.schoo_l = res.data.organizationName
          }
          if(res.data.gradeName.length > 0){
            
            that.grad_e = res.data.gradeName
          }
          if(res.data.className.length > 0){
            
            that.className = res.data.className
          }
          // 根据年级id获取班级
          if(res.data.gradeId){

            that.httpRequest_token("organization/class/findBaseClassInfos", {"classQueryDTO": res.data.gradeId}, function(res){

              that.class_list = res.data
              for(var i = 0; i < that.class_list.length; i++){
                var item = that.class_list[i]
                item.name = item.className
              }
            })
          }
        })
      },
      modify(key, value){

        var that = this

        var postData = {
          [key]: value,
          "userId": this.$store.state.login_cellphone.userId,
        }
        this.httpRequest_token("app/user/updateUserInfo", postData, function(res){

          that.request_info()
            that.$message.success("修改成功")
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .personal_info{
    height: 100%;
    overflow: hidden;
    .container{
      height: 100%;
      overflow: hidden;
      background: linear-gradient(0.5turn, #8CD5F5, #EBF9FD);
      .d-adv{
        width: 100%;
        height: 160/50rem;
        background: rgba(255, 255, 255, 0.85);
        line-height: 160/50rem;
        color: #666666;
        font-size: 29/50rem;
        padding-left: 30/50rem;
        .nav{
          height: 100%;
          float: right;
          margin-right: 60/50rem;
        }
        .i-adv{
          width: 100/50rem;
          height: 100/50rem;
          float: right;
          margin-top: 30/50rem;
          margin-right: 60/50rem;
          border-radius: 100/50rem;
        }
      }
      .mid{
        margin-top: 20/50rem;
        .cell{
          width: 100%;
          height: 90/50rem;
          background: rgba(255, 255, 255, 0.85);
          .left{
            width: 30/50rem;
            height: 100%;
            float: left;
          }
          .mid-{
            width: 690/50rem;
            height: 89/50rem;
            color: #666666;
            line-height: 90/50rem;
            border-bottom: 1/50rem solid #DDDDDD;
            float: left;
            span{
              color: red;
            }
            .left-t{
              float: left;
              font-size: 29/50rem;
            }
            .right-t{
              float: right;
              color: #BBBBBB;
              font-size: 29/50rem;
            }
            .mar-right{
              margin-right: 20/50rem;
            }
            .nav{
              height: 100%;
              float: right;
            }
          }
          .right{
            width: 30/50rem;
            float: right;
          }
        }
      }
      .bottom{
        margin-top: 28/50rem;
      }
    }
  }
</style>