<template>
	<div class="SelectMeng">
	  <div class="SelectWarehouses" >
	    <div class="SelectTitle">请选择{{BouncedName}}</div>
		  <div class="SelectItem">
		    <div v-for='(dataItem,index) in SelectBoxList'  :id="index"  :key='index'  @click="SelectComit(index)">{{dataItem.name}}</div>
		  </div>
		  <div class="cancel"   @click="selectCancel">取消</div>
	  </div>
	</div>
</template>
<script type="text/javascript">
  export default{
  	data(){
  	  return{
  	  	
  	  }
  	},
  	props:{
  	  BouncedName:'',//弹框名称
  	  SelectBoxList:{
  	  type:Array,
    	default: () => {
			return []
		}
	  },//数据
  	},
  	methods:{
  	  // 取消
  	  selectCancel(){
  		this.$emit('selectCancel');
  	  },
  	  // 选中item
  	  SelectComit(index){
  		this.$emit('selectedItem',index);
  	  }
  	}
  }
</script>
<style lang="less" scoped>
// 选择弹出框
.SelectMeng{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.3);
  z-index: 999;
  .SelectWarehouses{
    width: 600/50rem;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%,-50%);
    background-color: #F1F0F1;
    text-align: center;
    border-radius: 10/50rem;
    &>div{
      width: 100%;
    }
    .SelectItem{
      color: #2F84F0;
      font-size: 29/50rem;
      overflow: scroll;
      max-height: 610/50rem;
      // padding:0 20/50rem;
      box-sizing:border-box;
      &>div{
        // height: 80/50rem;
        line-height: 60/50rem;
        padding:10/50rem 20/50rem;
        border-top: 1/50rem solid #D9D7D9;
      }
    }
    .SelectTitle{
      height: 114/50rem;
      line-height: 114/50rem;
      font-weight: 600;
      font-size: 34/50rem;
    }
    .cancel{
      height: 80/50rem;
      line-height: 80/50rem;
      color: #2F84F0;
      font-size: 34/50rem;
      font-weight: 600;
      border-top:  1/50rem solid #D9D7D9;
    }
  }
  .SelectMengContent{
    width: 600/50rem;
    background-color:#fff;
    .SelectMengTitle{
      height: 90/50rem;
      line-height: 90/50rem;
      border-bottom:1/50rem solid #D9D7D9;
    }
    .selectBtn{
      font-size: 30/50rem;
      line-height: 80/50rem;
      display: flex;
      border-top:1/50rem solid #D9D7D9;
      &>div{
        flex-grow: 1;
        &:first-child{
          border-right:1/50rem solid #D9D7D9;
        }
      }
    }
  }
}
</style>
