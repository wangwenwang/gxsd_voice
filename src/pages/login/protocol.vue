<template>
  <div class="protocol">

    <header_index title='用户协议' :back_icon='true' @back='back'></header_index>

    <div class="container">
		  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们重视用户的隐私。您在使用我们的服务时，我们可能会收集和使用您的相关信息。我们希望通过本《隐私政策》向您说明，在使用我们的服务时，我们如何收集、使用、储存和分享这些信息，以及我们为您提供的访问、更新、控制和保护这些信息的方式。本《隐私政策》与您所使用的服务息息相关，希望您仔细阅读，在需要时，按照本《隐私政策》的指引，作出您认为适当的选择。本《隐私政策》中涉及的相关技术词汇，我们尽量以简明扼要的表述，并提供进一步说明的链接，以便您的理解。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您使用或继续使用我们的服务，即意味着同意我们按照本《隐私政策》收集、使用、储存和分享您的相关信息。如对本《隐私政策》或相关事宜有任何问题，请通过高效速读与我们联系。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们提供服务时，可能会收集、储存和使用下列与您有关的信息。如果您不提供相关信息，可能无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。
    </div>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
  export default{
    name:"protocol",
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

        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .protocol{
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