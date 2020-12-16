<template>
  <div class="task_stu">
    <div class="container">

      <div class="top-bg"><img src="static\img\task_stu\bg-task-stu.png"></div>

      <div class="header-title">任务</div>

      <div class="top-d">
        <div><div class="p-value p-margin-left"><span class="p-qty">{{ task_list.total }}</span><span class="p-uom">次</span></div><div class="p-prompt p-margin-left">任务次数</div></div>
        <div><div class="p-value p-margin-right"><span class="p-qty">{{ task_list.goodQty }}</span><span class="p-uom">次</span></div><div class="p-prompt p-margin-right">优秀次数</div></div>
      </div>
		
      <div class="scroll-d">
        
        <div class="part-big-d" v-for='(item, index) in task_list.taskList' :id="index" :key='index'>

          <div class="header-prompt">{{ item.date }}</div>

          <div class="part-little-d" v-for='(it, idx) in item.detailList' :id="idx" :key='idx'>

            <img v-if="it.result == 'NOT_PASS'" class="is-pass" src="static\img\task_stu\i-no-pass.png">
            <img v-if="it.result == 'NOT_START' && friendlyDate(it.endTime) == ''" class="is-pass" src="static\img\task_stu\i-expired.png">
            <img v-if="it.result == 'PASS' && it.score < 90" class="is-pass" src="static\img\task_stu\i-pass.png">
            <img v-if="it.result == 'PASS' && it.score >= 90" class="is-pass" src="static\img\task_stu\i-excellence.png">
            
            <div class="article-title"><span>{{ it.taskDesc }}</span><span v-if="it.score!=null">{{ it.score }}分</span></div>

            <div v-if="it.articleType == '课内'" class="line-2">
              <div class="grade-class-d">阅读速度：{{ it.readSpeed }}字每分钟</div>
            </div>

            <div class="line-2">
              <div class="grade-class-d">达标分数：{{ it.passScore }}分</div>
            </div>

            <div class="line-3">
              <div v-if="item.date == '未完成' " class="end-time">剩余时间：{{ friendlyDate(it.endTime) }}</div>
              <div v-if="item.date != '未完成' " class="end-time">截至时间：{{ deal_endtime(it.endTime) }}</div>
              <div v-if="item.date == '未完成' && (it.result == null || it.result == 'NOT_START')" class="check-task" @click='start_task_click(index, idx)'>阅读答题</div>
              <div v-if="item.date == '未完成' && it.result && it.result != 'NOT_START'" class="check-task" @click='start_task_click(index, idx)'>重读答题</div>
            </div>

          </div>
        </div>

      </div>

    </div>
    <footer_index/>
  </div>
</template>
<script type="text/javascript">
import footer_index from '../../components/footer.vue'
  export default{
    name:"task_stu",
    data(){
      return{
        task_list: {}
      }
    },
    components:{
      footer_index
    },
    created(){

      var that = this
      var postData = {
        "studentId": this.$store.state.login_cellphone.userId,
        "taskDateStart": "2020-08-08 12:10:00",
        "currentPage": 0,
        "pageSize": 20,
        "queryUnFinishTask": "queryUnFinishTask",
      }
      this.httpRequest_body_token("read/task/getTaskListByStudent", postData, function(res){
        
        that.task_list = res.data
      })
    },
    methods:{
      start_task_click(index, idx){
        
        if(!this.is_allow_read()){
          this.$toast({"message":"请完善个人资料", type:'', position:'bottom', duration:'2000'})
          var that = this
          setTimeout(function () {
            that.$router.push("personal_info")
          }, 2000)
          return
        }

        var item = this.task_list.taskList[index].detailList[idx]
        this.$store.state.push_list.push(this.$route.path.substring(1))
        if(item.articleType == "课内"){
          var that = this
          var postData = {
            "speed": item.readSpeed
          }
          this.httpRequest_body_token_no_loading("read/appRead/getSpeedWordNumber", postData, function(res){

            var query = {
              title: item.articleTitle,
              articleId: item.articleId,
              wordCount: 0,
              word_per_minute: item.readSpeed,
              word_per_line: res.data.wordNumber,
              task_stu: item,
            }
            that.$store.state.push_list.push({'name':that.$route.path.substring(1), 'query':query})
            that.$router.push({
              name:"read_preview_topic",
              query:query,
            })
          })
        }else{
          this.$store.state.push_list.push(this.$route.path.substring(1))
          this.$router.push({
            name:"read_preview_topic",
            query:{
              title: item.articleTitle,
              articleId: item.articleId,
              task_stu: item,
            }
          })
        }
      },
      deal_endtime(time){
        if(time.length > 3){
          return time.substring(0, time.length - 3)
        }
        return time
      },
      friendlyDate(timestamp_str) {
        var timestamp = new Date(Date.parse(timestamp_str.replace(/-/g,  "/")))
        var now = Date.now()
        var seconds = Math.floor(( timestamp - now) / 1000)
        var minutes = Math.floor(seconds / 60)
        var hours = Math.floor(minutes / 60)
        var days = Math.floor(hours / 24)
        var months = Math.floor(days / 30)
        var years = Math.floor(months / 12)
        var p = ''
        if (days > 0) {
          p += days + "天"
        }
        if (hours > 0) {
          p += (hours % 24) + "小时"
        }
        if (minutes > 0) {
          p += (minutes % 60) + "分钟"
        }
        return p
      }
    }
  }
</script>
<style lang="less" scoped>
  .task_stu{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #F3F4F5;
    .container{
      width: 100%;
      height: 100%;
      overflow: hidden;
      .top-bg{
        width: 100%;
        position: absolute;
        img{
          width: 100%;
        }
      }
      .header-title{
        position: absolute;
        width: 100%;
        margin: 106/50rem auto 0 auto;
        z-index: 3;
        color: white;
        font-size: 36/50rem;
        text-align: center;
      }
      .top-d{
        width: 690/50rem;
        height: 169/50rem;
        background-color: white;
        margin-top: 190/50rem;
        margin-left: 30/50rem;
        border-radius: 20/50rem;
        text-align: center;
        position: absolute;
        z-index: 4;
        &>div{
          width: 50%;
          height: 100%;
          float: left;
          .p-prompt{
            color: #666666;
            margin-top: 26/50rem;
            font-size: 28/50rem;
          }
          .p-value{
            margin-top: 30/50rem;
            .p-qty{
              font-size: 50/50rem;
            }
            .p-uom{
              font-size: 25/50rem;
              margin-left: 8/50rem;
            }
          }
          .p-margin-left{
            margin-left: 80/50rem;
          }
          .p-margin-right{
            margin-right: 80/50rem;
          }
        }
      }
      .scroll-d{
        width: 100%;
        height: calc(100% - 9.2rem);
        margin-top: 370/50rem;
        overflow: scroll;
        .part-big-d{
          .header-prompt{
            margin-top: 27/50rem;
            margin-left: 50/50rem;
            font-weight: 600;
          }
          .part-little-d{
            width: 690/50rem;
            background-color: white;
            margin: 40/50rem auto;
            border-radius: 20/50rem;
            position: relative;
            overflow: hidden;
            .is-pass{
              position: absolute;
              width: 90/50rem;
              height:  90/50rem;
              top: 0/50rem;
              right: 0/50rem;
            }
            .article-title{
              padding-top: 30/50rem;
              margin-left: 30/50rem;
              position: relative;
              &>span{
                &:nth-child(1){
                  font-size: 30/50rem;
                  font-weight: 600;
                }
                &:nth-child(2){
                  position: absolute;
                  right: 117/50rem;
                  color: #ED6B47;
                  font-family: 'MuYaoSoftbrush';
                }
              }
            }
            .line-2{
              overflow: hidden;
              .grade-class-d{
                margin-top: 35/50rem;
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
              margin-top: 30/50rem;
              margin-left: 30/50rem;
              .end-time{
                color: #9A9A9A;
                font-size: 25/50rem;
                float: left;
                padding-bottom: 30/50rem;
              }
              .check-task{
                width: 150/50rem;
                height: 60/50rem;
                margin-top: -30/50rem;
                margin-right: 30/50rem;
                line-height: 60/50rem;
                text-align: center;
                border-radius: 100/50rem;
                color: white;
                background-color: #2bd5d0;
                font-size: 25/50rem;
                float: right;
                img{
                  float: right;
                  height: 27/50rem;
                  margin-left: 4/50rem;
                  margin-right: 20/50rem;
                }
              }
            }
          }
        }
      }
    }
  }
</style>