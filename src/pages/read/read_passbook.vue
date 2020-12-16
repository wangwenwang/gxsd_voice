<template>
  <div class="read_passbook">

    <header_index title='阅读存折'></header_index>

    <div class="container">

      <div class="bottom">

        <div class="top-bg"></div>

        <div class="top-menu">
          <div class="menu-container">
            <div class="one right-line" @click="selected('one')">学习存折</div>
            <div class="two right-line" @click="selected('two')">训练存折</div>
            <div class="three" @click="selected('three')">检测存折</div>
          </div>
        </div>

        <div class="accum">
          <div>
            <img src="static/img/read/i-a-time.png">
            <div class="t1">{{ accum_one.value }}</div>
            <div class="t2">{{ accum_one.key }}</div>
          </div>
          <div>
            <img src="static/img/read/i-a-list.png">
            <div class="t1">{{ accum_two.value }}</div>
            <div class="t2">{{ accum_two.key }}</div>
          </div>
          <div>
            <img src="static/img/read/i-a-list-.png">
            <div class="t1">{{ accum_three.value }}</div>
            <div class="t2">{{ accum_three.key }}</div>
          </div>
        </div>

        <div class="list-header">
          <div>日期</div>
          <div>时长</div>
          <div>{{ col_three_title }}</div>
          <div>{{ col_four_title }}</div>
        </div>

        <div class="list-content">
          <div class="v-for" v-for='(item, index) in list' :id="index" :key='index'>
            <div>{{ item.readDate.substring(0, 10) }}</div>
            <div>{{ get_read_cost_time_of_day(item) }}</div>
            <div>{{ get_read_accum_word_count_of_day(item) }}字</div>
            <div>{{ get_checkTopic(item) }}</div>
          </div>
          <div class="blank_"></div>
        </div>

      </div>

      <div class="float">

        <div class="f-left">
          <div class="adv-l">
            <div class="adv-d">
              <img class="i-adv" src="static/img/my/i-adv.png">
              <img class="i-vip" src="static/img/my/i-vip.png">
            </div>
            <div class="username">{{ $store.state.login_cellphone.name }}</div>
          </div>
        </div>
        
        <div class="f-right">
          <div class="rank-i">
            <img class="i-crown" src="static/img/passbook/i-crown.png">
          </div>
          <div class="rank-t">排行榜</div>
        </div>

        <div class="o-t-h">
          <div>
            <div class="key">累计阅读</div>
            <div class="value">{{ data.readDate }}天</div>
          </div>
          <div>
            <div class="key">阅读字数排行</div>
            <div class="value">{{ data.totalWordCountPX }}</div>
          </div>
          <div>
            <div class="key">阅读速度排行</div>
            <div class="value">{{ data.readSpeedPX }}</div>
          </div>
        </div>

      </div>

    </div>
    <footer_index/>
  </div>
</template>
<script type="text/javascript">
import header_index from '../../components/header.vue'
import footer_index from '../../components/footer.vue'
import $ from "jquery"
  export default{
    name:"read_passbook",
    data(){
      return{
        data: {},
        list: [],
        read_accum_word_of_day: 0, // 阅读量（字数）/天
        accum_one: {},             // 菜单1
        accum_two: {},             // 菜单2
        accum_three: {"key":""},   // 菜单3
        col_three_title: "",       // 第三列抬头
        col_four_title: ""         // 第四列抬头
      }
    },
    components:{
      header_index,
      footer_index
    },
    created(){

      var that = this
      var postData = {
        "studentId": this.$store.state.login_cellphone.userId,
        "month": this.getNowTime("y-m")
      }
      this.httpRequest_body_token("read/appRead/getReadTotalBook", postData, function(res){

        that.data = res.data ? res.data : ""
        that.selected("one")
      })

      postData = {
        "studentId": this.$store.state.login_cellphone.userId,
        "currentPage": 1,
        "pageSize": 15
      }
      this.httpRequest_body_token("read/appRead/getReadDayBookList", postData, function(res){

        that.list = res.data
        for(var i = 0; i < that.list; i++){
          var item = that.list[i]
          item.read_cost_time_of_day = item.trainTime + item.checkTime
          that.read_accum_word_of_day = item.trainWordCount + item.checkWordCount
        }
      })
    },
    methods:{

      selected(class_){

        this.menu_class = class_

        $(".one").css({"background-color":"transparent", "color":"#157EFB"})
        $(".two").css({"background-color":"transparent", "color":"#157EFB"})
        $(".three").css({"background-color":"transparent", "color":"#157EFB"})
        $("." + class_).css({"background-color":"#1B9BFE", "color":"white"})
        // 汇总
        if(class_ == "one"){

          this.accum_one.key = "累计学习时间"
          this.accum_one.value = this.dealTime_c( parseFloat(this.data.totalTime / 1000).toFixed(0))
          this.accum_two.key = "累计阅读字数"
          this.accum_two.value = this.data.totalWordCount ? this.data.totalWordCount : 0 + "字"
          this.accum_three.key = "累计答题数"
          this.accum_three.value = this.data.checkTopic ? this.data.checkTopic : 0 + "题"

          this.col_three_title = "阅读量"
          this.col_four_title = "答题数"
        }
        // 阅读训练
        else if(class_ == "two"){

          this.accum_one.key = "累计训练时间"
          this.accum_one.value = this.dealTime_c( parseFloat(this.data.trainTime / 1000).toFixed(0)) 
          this.accum_two.key = "累计训练字数"
          this.accum_two.value = this.data.twtrainWordCount + "字"
          this.accum_three.key = "训练文章数"
          this.accum_three.value = this.data.trainArticle + "章"

          this.col_three_title = "字数"
          this.col_four_title = "文章数"
        }
        // 阅读检测
        else if(class_ == "three"){

          this.accum_one.key = "累计检测时间"
          this.accum_one.value = this.dealTime_c( parseFloat(this.data.checkTime / 1000).toFixed(0)) 
          this.accum_two.key = "累计检测字数"
          this.accum_two.value = this.data.checkWordCount + "字"
          this.accum_three.key = "检测文章数"
          this.accum_three.value = this.data.checkArticle + "章"

          this.col_three_title = "文章数"
          this.col_four_title = "答题数"
        }
      },
      get_read_cost_time_of_day(item){

        if(this.menu_class == "one"){

          return  this.dealTime(parseFloat((item.trainTime + item.checkTime) / 1000).toFixed(0))
        }else if(this.menu_class == "two"){

          return  this.dealTime(parseFloat(item.trainTime / 1000).toFixed(0))
        }else{

          return this.dealTime(parseFloat(item.checkTime / 1000).toFixed(0))
        }
      },
      get_read_accum_word_count_of_day(item){
        
        if(this.menu_class == "one"){

          return  item.trainWordCount + item.checkWordCount
        }else if(this.menu_class == "two"){

          return  item.trainWordCount
        }else if(this.menu_class == "three"){

         return  item.checkWordCount
        }
      },
      get_checkTopic(item){

        if(this.menu_class == "one"){

          return  item.checkTopic + "题"
        }else if(this.menu_class == "two"){

          return  item.trainArticle
        }else{

         return  item.checkTopic + "题"
        }
      },
      // 36001秒 转换为 01:00:01
      dealTime(s){

        var min = s / 60
        var hour = min / 60
        hour = Math.floor(hour)
        min = Math.floor(min)
        if(hour < 10){
          hour = "0" + hour
        }
        min -= hour * 60
        if(min < 10){
          min = "0" + min
        }
        s -= (hour * 3600 + min * 60)
        if(s < 10){
          s = "0" + s
        }
        var st = hour + ":" + min + ":" + s
        return st
      },
      // 36001秒 转换为 01时00分01秒
      dealTime_c(s){

        if(s == "NaN"){
          return "0时0分钟"
        }
        var min = s / 60
        var hour = min / 60
        hour = Math.floor(hour)
        min = Math.floor(min)
        min -= hour * 60
        var st = hour + "时" + min + "分钟"
        return st
      }
    }
  }
</script>
<style lang="less" scoped>
  .read_passbook{
    height: 100%;
    overflow: hidden;
    .container{
      height: 100%;
      overflow: hidden;
      .bottom{
        width: 100%;
        height: calc(100% - 2.78rem);
        position: absolute;
        overflow: hidden;
        .top-bg{
          width: 100%;
          height: 230/50rem;
          background-color: #1B9BFE;
        }
        .top-menu{
          width: 100%;
          height: 230/50rem;
          background-color: #EBF9FD;
          overflow: hidden;
          .menu-container{
            width: 600/50rem;
            height: 58/50rem;
            margin: 135/50rem auto 0 auto;
            border-radius: 7/50rem;
            border: 2/50rem solid #1B9BFE;
            &>div{
              width: 33%;
              height: 100%;
              float: left;
              color: #157EFB;
              font-size: 26/50rem;
              text-align: center;
              line-height: 58/50rem;
            }
            .right-line{
              border-right: 2/50rem solid #1B9BFE;
            }
            .one{
              background-color: #1B9BFE;
              color: white;
            }
          }
        }
        .accum{
          width: 100%;
          height: 200/50rem;
          text-align: center;
          &>div{
            width: 33.3%;
            height: 100%;
            float: left;
            img{
              width: 53/50rem;
              margin-top: 36/50rem;
            }
            .t1{
              margin-top: 16/50rem;
              font-size: 24/50rem;
              color: #1B9BFE;
            }
            .t2{
              font-size: 24/50rem;
              color: #333333;
            }
          }
        }
        .list-header{
          width: 100%;
          height: 80/50rem;
          background-color: #EBF9FD;
          &>div{
            width: 25%;
            height: 100%;
            float: left;
            text-align: center;
            line-height: 80/50rem;
            color: #666666;
            font-size: 29/50rem;
          }
        }
        .list-content{
          width: 100%;
          height: calc(100% - 15.7rem);
          overflow: scroll;
          .v-for{
            height: 84/50rem;
            &>div{
              width: 25%;
              height: 84/50rem;
              float: left;
              line-height: 80/50rem;
              font-size: 24/50rem;
              color: #333333;
              text-align: center;
              background-color: white;
            }
          }
          .blank_{
            width: 100%;
            height: 40/50rem;
          }
        }
      }
      .float{
        width: (750 - 48)/50rem;
        height: 262/50rem;
        background-color: white;
        position: absolute;
        margin: 74/50rem 24/50rem 0 24/50rem;
        border-radius: 20/50rem;
        .f-left{
          float: left;
          .adv-l{
            width: 100%;
            height: 150/50rem;
            margin-left: 40/50rem;
            position: absolute;
            .adv-d{
              width: 150/50rem;
              height: 150/50rem;
              margin-top: -75/50rem;
              position: relative;
              .i-adv{
                width: 100%;
                position: absolute;
              }
              .i-vip{
                width: 37/50rem;
                position: absolute;
                right: 8/50rem;
                bottom: 0;
              }
            }
            .username{
              font-size: 34/50rem;
              margin-top: 20/50rem;
              margin-left: 20/50rem;
            }
          }
        }
        .f-right{
          float: right;
          .rank-i{
            width: 114/50rem;
            height: 80/50rem;
            margin-top: 20/50rem;
            margin-right: 28/50rem;
            .i-crown{
              width: 100%;
              height: 100%;
            }
          }
          .rank-t{
            font-size: 24/50rem;
            text-align: center;
            margin-top: 8/50rem;
            margin-right: 28/50rem;
          }
        }
        .o-t-h{
          width: 100%;
          height: (262 - 150)/50rem;
          float: left;
          text-align: center;
          &>div{
            width: 33.3%;
            height: 100%;
            float: left;
            .key{
              font-size: 24/50rem;
              line-height: 90/50rem;
              color: #666666;
            }
            .value{
              font-size: 30/50rem;
              line-height: 0/50rem;
            }
            &:nth-child(1){
              .key{
                margin-right: 20/50rem;
              }
              .value{
                margin-right: 20/50rem;
              }
            }
            &:nth-child(3){
              .key{
                margin-left: 20/50rem;
              }
              .value{
                margin-left: 20/50rem;
              }
            }
          }
        }
      }
    }
  }
</style>