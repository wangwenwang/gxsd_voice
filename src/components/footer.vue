<template>
  <div>
    <footer>
      <img class="bg" src="static/img/footer/bg-tarbar.png">
      <div :class="{active : active == item.title}" v-for='(item,index) in footList' :id="index" :key='index' @click="toggle(index)" >
        <img :src="item.icon">
        <div>{{ item.title }}</div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name:"footer_index",
  data(){
    return{
      footList : [],
      active: '首页',
    }
  },
  created(){

    if(this.$store.state.login_cellphone.accountType == 1){
      // 学生
      this.footList = [
        {
          path: "index",
          title: "高效速读",
          icon: "static/img/footer/i-footer-msg"
        },
        {
          path: "task_stu",
          title: "任务",
          icon: "static/img/footer/i-footer-msg"
        },
        {
          path: "read_passbook",
          title: "阅读存折",
          icon: "static/img/footer/i-footer-read"
        },
        {
          path: "my",
          title: "我的",
          icon: "static/img/footer/i-footer-my"
        }
      ]
    }

    if(this.$store.state.login_cellphone.accountType == 2){
      // 老师
      this.footList = [
        {
          path: "index_tch",
          title: "高效速读",
          icon: "static/img/footer/i-footer-msg"
        },
        {
          path: "task_tch",
          title: "任务",
          icon: "static/img/footer/i-footer-read"
        },
        {
          path: "my",
          title: "我的",
          icon: "static/img/footer/i-footer-my"
        }
      ]
    }

    for(var i = 0; i < this.footList.length; i++){
      if(this.footList[i].path == this.$route.name){
        this.footList[i].icon += "-.png"
        this.active =  this.footList[i].title
      }else{
        this.footList[i].icon += ".png"
      }
    }
  },
  methods:{
    toggle(index){

      if(this.$route.query.active ==  this.footList[index].title){
        return
      }
      
      this.$router.push({
        name:this.footList[index].path,
        query:{
          active:this.footList[index].title
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

footer{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 139/50rem;
  width: 100%;
  display: flex;
  .bg{
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  div{
    color: #444;
    flex-grow: 1;
    text-align: center;
    img{
      width: 88/50rem;
      height: 86/50rem;
      margin-top: 20/50rem;
    }
    &>div{
      color: white;
      font-size: 20/50rem;
      margin-top: -8/50rem;
    }
  }
  div.active{
    &>div{
      // color: #4ea3fe;
    }
  }
}
</style>