<template>
  <div class="setting">

    <header_index title='设置' :back_icon='true' @back='back'></header_index>

    <div class="container">

      <div class="mid bottom">

        <div class="cell" @click="to_about()">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">关于高效速读</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right"></div>
          </div>
          <div class="right"></div>
        </div>

<!--         <div class="cell">
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">清除缓存</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t mar-right"></div>
          </div>
          <div class="right"></div>
        </div> -->

        <div class="cell" @click='updateAppVersion'>
          <div class="left"></div>
          <div class="mid-">
            <div class="left-t">当前版本</div>
            <img class="nav" src="static/img/my/i-push.png">
            <div class="right-t">{{ $store.state.App_Version }}.{{$store.state.version}}</div>
          </div>
          <div class="right"></div>
        </div>

      </div>

      <div class="logout-" @click="logou_t_click()">
        <img class="nav" src="static/img/my/i-logout.png">
      </div>
		
    </div>
    <footer_index_no_menu/>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
import footer_index_no_menu from '../../components/footer_no_menu.vue'
  export default{
    name:"setting",
    data(){
      return{

      }
    },
    components:{
      header_index, 
      footer_index_no_menu
    },
    mounted(){

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
    created(){

    },
    methods:{
    
      onBrowserBack() {
        
        this.back()
      },
      back(){

        this.$router.push("my")
      },
      // App版本更新
      updateAppVersion(){
      try { CallAndroidOrIOS("检查APP和VUE版本更新") } catch(error) { }
        try { CallAndroidOrIOS.callAndroid("检查APP和VUE版本更新") } catch(error) { }
          
          try { window.webkit.messageHandlers.messageSend.postMessage({a:'检查APP和VUE版本更新'}) } 
          catch(error) { }
      },
      to_about(){
        this.$router.push("about")
      },
      logou_t_click(){
        
        this.$router.push("login_cellphone")
      }
    }
  }
</script>
<style lang="less" scoped>
  .setting{
    height: 100%;
    overflow: hidden;
    .container{
      height: 100%;
      overflow: hidden;
      background: linear-gradient(0.5turn, #8CD5F5, #EBF9FD);
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
      .logout-{
        width: 260/50rem;
        height: 96/50rem;
        margin-top: 480/50rem;
        margin: 176/50rem auto 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>