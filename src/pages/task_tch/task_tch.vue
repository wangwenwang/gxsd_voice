<template>
  <div class="task_tch">

    <header>
      <div class="title">
        任务
      </div>
      <div class="timer" @click='post_task_click()'>发布任务</div>
    </header>

    <div class="container">

      <div class="part-big-d" v-for='(item, index) in task_list' :id="index" :key='index'>

        <div class="header-prompt">{{ item.tip }}</div>

        <div class="part-little-d" v-for='(it, idx) in item.taskList' :id="idx" :key='idx' @click='goread(index,idx)'>

          <div v-if="it.finishStdQty == 0" class="remove-d" @click='remove_click(index, idx)'><img src="static/img/task_tch/i-delete.png"></div>
          
          <div class="article-title">{{ it.taskDesc }}</div>

          <div class="line-2">
            <div class="grade-class-d">{{ it.teamName }}</div>
            <div class="complete-qty">完成人数{{ it.finishStdQty }}/{{ it.totalStdQty }}</div>
          </div>

          <div class="separator-mini"></div>

          <div class="line-3">
            <div class="end-time">{{ it.endTimePrompt }}结束</div>
            <div class="check-task" @click='check_task_click(index, idx)'>查看任务<img src="static/img/post_task/i-direction-right.png"> </div>
          </div>

        </div>
      </div>

      <div class="kong"></div>
		
    </div>
    <footer_index/>
  </div>
</template>
<script type="text/javascript">
import footer_index from '../../components/footer.vue'
  export default{
    name:"task_tch",
    data(){
      return{
        task_list: []
      }
    },
    components:{
      footer_index
    },
    created(){

      this.request_list()
    },
    methods:{
      request_list(){

        var that = this
        var postData = {
          "distributionUserId": this.$store.state.login_cellphone.userId,
          "startWeek": 0,
          "totalWeek": 4,
        }
        this.httpRequest_body_token("read/task/getTaskListByTeacher", postData, function(res){

          that.task_list = res.data
          for(var i = 0; i < that.task_list.length; i++){
            var item = that.task_list[i]
            for(var j = 0; j < item.taskList.length; j++){
              var it = item.taskList[j]
              var target_y_m_d = it.endTime.substr(0, 10)
              var tail = ''
              it.endTimePrompt = '数据异常'
              if(it.endTime.length > 16){
                it.endTimePrompt = it.endTime.substr(0, 16)
                tail = it.endTime.substr(11, 5)
                if(tail.substr(0, 1) == '0'){
                  tail = tail.substr(1, 4)
                }
              }
              if(it.endTime.length > 10){
                var today_y_m_d = that.get_tomorrow_y_m_d(0)
                var tomorrow_y_m_d = that.get_tomorrow_y_m_d(1)
                var tdat_y_m_d = that.get_tomorrow_y_m_d(2)
                if(target_y_m_d == today_y_m_d){
                  it.endTimePrompt = "今天" + tail
                }else if(target_y_m_d == tomorrow_y_m_d){
                  it.endTimePrompt = "明天" + tail
                }else if(target_y_m_d == tdat_y_m_d){
                  it.endTimePrompt = "后天" + tail
                }
              }
            }
          }
        })
      },
      post_task_click(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("task_pick")
      },
      check_task_click(index, idx){

        var item = this.task_list[index].taskList[idx]
        this.$router.push({
          name:"task_check",
          query:{
            taskId: item.taskId,
          }
        })
      },
	  goread(index, idx){

        var item = this.task_list[index].taskList[idx]
        this.$router.push({
          name:"read",
          query:{
            taskId: item.taskId,
			articleId: item.articleId
          }
        })
      },
      remove_click(index, idx){

        var item = this.task_list[index].taskList[idx]
        this.$confirm('移除后，学生将减少此任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          var that = this
          var postData = {
            "taskId": item.taskId,
          }
          this.httpRequest_body_token("read/task/teacherDeleteTask", postData, function(res){

            that.$message.success("删除成功")
            that.request_list()
          })
        }).catch(() => { })
      }
    }
  }
</script>
<style lang="less" scoped>
  .task_tch{
    overflow: hidden;
    width: 100%;
    height: 100%;
    header{
      height: 90/50rem;
      border-bottom: 1/50rem solid  #D9D9D9;
      .btn{
        position: absolute;
        img{
          width: 80/50rem;
        }
      }
      .title{
        width: 100%;
        height: 90/50rem;
        color: white;
        position: absolute;
        z-index: 0; 
        background-color: #1B9BFE;
        line-height: 90/50rem;
        text-align: center;
      }
      .timer{
        height: 80/50rem;
        top: 5/50rem;
        bottom: 5/50rem;
        right: 25/50rem;
        position: absolute;
        line-height: 80/50rem;
        font-size: 25/50rem;
        color: white;
      }
    }
    .container{
      width: 100%;
      height: calc(100% - 4rem);
      overflow: scroll;
      background-color: #F3F4F5;
      .part-big-d{
        .header-prompt{
          margin-top: 27/50rem;
          margin-left: 50/50rem;
          font-weight: 600;
        }
        .part-little-d{
          width: 690/50rem;
          height: 290/50rem;
          background-color: white;
          margin: 40/50rem auto;
          border-radius: 20/50rem;
          position: relative;
          .remove-d{
            position: absolute;
            width: 40/50rem;
            height: 40/50rem;
            right: -7/50rem;
            top: -7/50rem;
            padding: 15/50rem;
            img{
              width: 100%;
            }
          }
          .article-title{
            padding-top: 35/50rem;
            margin-left: 30/50rem;
            font-weight: 600;
          }
          .line-2{
            overflow: hidden;
            .grade-class-d{
              margin-top: 40/50rem;
              margin-left: 30/50rem;
              color: #999999;
              font-size: 25/50rem;
              float: left;
            }
            .complete-qty{
              font-size: 25/50rem;
              color: #999999;
              margin-top: 40/50rem;
              float: right;
              margin-right: 30/50rem;
            }
          }
          .line-3{
            margin-top: 40/50rem;
            margin-left: 30/50rem;
            .end-time{
              color: #212121;
              font-size: 25/50rem;
              float: left;
            }
            .check-task{
              color: #212121;
              font-size: 25/50rem;
              float: right;
              padding: 20/50rem;
              margin-top: -20/50rem;
              img{
                float: right;
                height: 27/50rem;
                margin-left: 4/50rem;
              }
            }
          }
          .separator-mini{
            height: 2/50rem;
            margin-top: 40/50rem;
            margin-left: 30/50rem;
            margin-right: 30/50rem;
            background-color: #EEEEEE;
          }
        }
      }
      .kong{
        height: 60/50rem;
      }
    }
  }
</style>