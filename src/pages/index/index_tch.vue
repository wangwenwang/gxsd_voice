<template>
  <div class="index_tch">
    <header>
      <div class="search">
        <div class="search-">
          <div v-if="search_key == ''" class="propmt">   
            <img src="static/img/index/i-search.png">
            <span>书名、作者</span>
          </div>
          <input class="input" v-model="search_key">
        </div>
      </div>
      <div class="history"><img src="static/img/index/i-history.png" @click='toHistory()'></div>
    </header>
    <div class="container">

      <div class="scroll">

        <div class="banner">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item>
              <img style="width: 100%" src="static/img/index/banner-1.png" @click='test'>
            </el-carousel-item>
            <el-carousel-item>
              <img style="width: 100%" src="static/img/index/banner-2.png" @click='test'>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="part-1">
          <div><img style="width: 100%" src="static/img/index/fun-1.jpg" @click='single()'></div>
          <div><img style="width: 100%" src="static/img/index/fun-2.jpg" @click='whole()'></div>
          <div><!-- <img style="width: 100%" src="static/img/index/fun-3.jpg"> --></div>
          <div><img style="width: 100%" src="static/img/index/fun-4.jpg" @click='class_man_click()'></div>
        </div>

        <div class="part-2">
          <div><img style="width: 100%" src="static/img/index/fun-5.jpg" @click='post_task_click()'></div>
          <div><img style="width: 100%" src="static/img/index/fun-6.jpg" @click='to_task_list()'></div>
        </div>

        <div class="part-3">
          <div><!-- <img style="width: 100%" src="static/img/index/part-3.jpg"> --></div>
        </div>

        <div class="kong"></div>

      </div>

    </div>
    <footer_index/>
  </div>
</template>
<script type="text/javascript">
import footer_index from '../../components/footer.vue'
  export default{
    name:"index_tch",
    data(){
      return{
        search_key: '',
        img_default: "static/img/read/book-thum.png"
      }
    },
    components:{
      footer_index
    },
    created(){

    },
    methods:{
		test(){
			this.$router.push("test")
		},
      post_task_click(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("task_pick")
      },
      class_man_click(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("class_man")
      },
      single(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("read_single")
      },
      whole(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("z_read_whole")
      },
      recom_click(){

        this.$router.push("recom_books")
      },
      toHistory(){

        this.$store.state.push_list.push(this.$route.path.substring(1))
        this.$router.push("read_his")
      },
      book_click(index){

        this.$store.state.book_reading = this.$store.state.index_books[index]
        this.$store.state.back_z_catalog = "index"
        this.$router.push("z_catalog")
      },
      to_task_list(){

        this.$router.push("task_tch")
      }
    }
  }
</script>
<style lang="less" scoped>
  .index_tch{
    width: 100%;
    height: 100%;
    overflow: hidden;
    header{
      height: 90/50rem;
      border-bottom: 1/50rem solid #D9D9D9;
      background-color: #1B9BFE;
      &>div{
        height: 100%;
        float: left;
        text-align: center;
        line-height: 122.5/50rem;
        img{
          width: 50%;
        }
      }
      .msg{
        width: 100/50rem;
      }
      .search{
        width: 610/50rem;
        .search-{
          width: 100%;
          height: 60/50rem;
          margin: 0 auto;
          margin-top: 15/50rem;
          border-radius: 100/50rem;
          text-align: left;
          line-height: 60/50rem;
          margin-left: 40/50rem;
          color: #B3B3B3;
          background-color: white;
          .propmt{
            position: absolute;
            font-size: 27/50rem;
            img{
              width: 25/50rem;
              height: 25/50rem;
              margin-left: 16/50rem;
              vertical-align: middle;
              margin-top: -5/50rem;
            }
          }
          .input{
            width: 100%;
            height: 100%;
            padding-left: 16/50rem;
          }
        }
        input::-ms-input-placeholder {
          font-size: 32/50rem;
          color: #999999;
        }
        input{
          outline: none;
          background: transparent;
          border: none;
          height: 100%;
          width: 100%;
        }
        input::-webkit-input-placeholder {
          font-size: 32/50rem;
          color: #999999;
        }
        input::-moz-input-placeholder {
          font-size: 32/50rem;
          color: #999999;
        }
      }
      .history{
        float: right;
        width: 100/50rem;
      }
    }
    .container{
      width: 100%;
      height: 100%;
      background-color: #fbfbfb;
      .scroll{
        height: 100%;
        overflow: scroll;
        .banner{
          width: 100%;
          height: 280/50rem;
          overflow: hidden;
        }
        .part-1{
          width: 700/50rem;
          height: 170/50rem;
          margin: 50/50rem auto;
          &>div{
            width: 175/50rem;
            height: 100%;
            float: left;
          }
        }
        .part-2{
          width: 100%;
          height: 140/50rem;
          margin: 50/50rem auto;
          &>div{
            width: 375/50rem;
            height: 100%;
            float: left;
          }
        }
        .part-3{
          width: 100%;
          height: 560/50rem;
        }
        .kong{
          height: 240/50rem;
        }
      }
    }
  }
</style>