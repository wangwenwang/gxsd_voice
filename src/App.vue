<template>
  <div id="app" type="primary">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      loading: false,//是否加载
      loadingText:"拼命加载中",//加载时显示的文字
    }
  },
  methods:{
    fullscreenLoading(isLoad,loadingText){

      // this.Loading = isLoad;

      // if(loadingText){
      //     this.loadingText = loadingText;
      // }
    }
  }
}
</script>

<style lang="less">
@import url("https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css");
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, legend, input, textarea, button, p, blockquote, th, td
{
  margin: 0;
  padding: 0;
  font-size: 32/50rem;
}
.statusBar{
  width: 100%;
  height: 40/50rem;
  position: fixed;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
ul,ol,li{ list-style: none;}
a{text-decoration: none;}
img{border: none;}
#app,body,html{
  width: 100%;
  height: 100%;
}
// #app {
//   // font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   // -webkit-font-smoothing: antialiased;
//   // -moz-osx-font-smoothing: grayscale;
//   position: relative;
// }
.container{
  overflow: scroll;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
   background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
   background-color: #d3dce6;
}

/*//element 提示框 样式 开始*/
.el-message-box__wrapper .el-message-box{
  width:600/50rem;
}
.el-message-box__headerbtn{
  display: none;
}
// 不显示详情图标，不然APP里跳转到详情页面，回不去vue了
.poi-more{
  visibility: hidden;
}
</style>
