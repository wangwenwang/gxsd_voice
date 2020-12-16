<template>
  <header>
    <div class="title">{{ title }}</div>
    <div class="btn">
      <img v-if="back_icon" @click="back" src="static/img/header/i-back.png">
      <img v-if="!back_icon" src="static/img/header/i-back-.png">
    </div>
  </header>
</template>
<script type="text/javascript">
  export default{
    data(){
      return{

      }
    },
    props:{
      title: '',        //标题
      back_icon: false  //返回图标是否显示
    },
    methods:{
      // 返回上一页
      back(){
        this.$emit('back');
      }
    }
  }
</script>
<style lang="less" scoped>
  header{
    height: 90/50rem;
    .btn{
      img{
        width: 80/50rem;
      }
    }
    .title{
      width: 100%;
      height: 90/50rem;
      color: white;
      position: absolute;
      z-index: -1;
      background-color: #1B9BFE;
      line-height: 90/50rem;
      text-align: center;
    }
  }
</style>