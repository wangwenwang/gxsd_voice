<template>
  <div v-show="showToast" class="toast" :class="position">
    <div class="toast_container" v-if="type == 'success'">
      <div><i class="iconfont icon-check icon"></i></div>
      <div class="msg_container">{{ message }}</div>
    </div>
    <div class="toast_container" v-else-if="type == 'wrong'">
      <div><i class="iconfont icon-warning-circle icon"></i></div>
      <div class="msg_container">{{ message }}</div>
    </div>
    <div class="toast_container" v-else-if="type == 'loading'">
      <!-- <div><loading10></loading10></div> -->
      <div class="msg_container">{{ message }}</div>
    </div>
  </div>
</template>
<script>
// import loading10 from '../loading/spiner'
export default{
  props:{
    message: String,
    type:{
      validator: function(value){
      // 值必须是这些字符串中的一个
      return ['success', 'wrong', 'loading'].indexOf(value) !== -1
    },
      default: 'success'
    },
    duration:{
      type: Number,
      default: 3000
    },
    position:{
      type: String,
      default: 'middle'
    }
  },
   // components:{
   //  loading10
   // },
  data(){
    return{
      showToast:false
    }
  }
}
</script>
<style scoped>
  .toast{
    width:100%;
  }
  .toast_container{
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8px;
    color:#fff;
    margin-left:88px;
    margin-right:88px;
    text-align:center;
    padding-top:15px;
    padding-bottom: 15px; 
  }
  .top{
    position:absolute;
    top:10%;
  }
  .middle{
    position:absolute;
    top:40%;
  }
  .bottom{
    position:absolute;
    top:70%;
  }
  .msg_container{
    margin-top:8px;
    margin-left:15px;
    margin-right:15px;
    line-height: 22px;
    font-size: 16px;
    word-wrap: break-word;
  }
  .icon{
    font-size:30px;
  }
</style>