<template>
  <div class="about">

    <header_index title='关于我们' :back_icon='true' @back='back'></header_index>

    <div class="container">
		  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关于高效速读，关于高效速读文字文字。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你是否有过买了书却没有读下去的经历？<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你是否因为读书速度慢而错过了很多好书？<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你是否也在读完书后却想不起书中的好内容？<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;——如何克服阅读畏惧心理，让自己高效阅读，并且活用书本知识？<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Read For Action读书会创始人、日本速读大师渡边康弘创立的“共振阅读法”，教你学会高效阅读。不用经过特别训练，你只需要拿起1张纸和1支笔，还有这本书，就能体会到超越以往的阅读体验。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你是否也在读完书后却想不起书中的好内容？<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;——如何克服阅读畏惧心理，让自己高效阅读，并且活用书本知识？
    </div>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
  export default{
    name:"about",
    data(){
      return{

      }
    },
    components:{
      header_index
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

        this.$router.push("setting")
      }
    }
  }
</script>
<style lang="less" scoped>
  .about{
    overflow: hidden;
    .container{
      overflow: hidden;
      padding: 40/50rem;
      line-height: 55/50rem;
      letter-spacing: 3/50rem;
      font-size: 29/50rem;
    }
  }
</style>