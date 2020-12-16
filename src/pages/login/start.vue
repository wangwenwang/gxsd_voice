<template>
  <div class="start">
    <div class="container">
		  <img class="bg" src="static/img/login/app-start.jpg">
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
    name:"start",
    data(){
      return{

      }
    },
    created(){

      var that = this

      setTimeout(function () {
        
        that.$router.push("login_cellphone")
      }, 3000);
    },
    methods:{

    }
  }
</script>
<style lang="less" scoped>
  .start{
    height: 100%;
    overflow: hidden;
    .container{
      height: 100%;
      overflow: hidden;
      .bg{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>