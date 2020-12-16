<template>
  <div>
    <footer>
      <img class="bg" src="static/img/footer/bg-tarbar.png">
    </footer>
  </div>
</template>

<script>
export default {
  name:"footer_index_no_menu",
  data(){
    return{

    }
  },
  created(){

  },
  methods:{

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
}
</style>