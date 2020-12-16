<template>
  <div class="index">
    <header>
      <div class="msg"><img src="static/img/index/i-msg.png"></div>
      <div class="search">
        <div class="search-">
          <div v-if="search_key == ''" class="propmt">   
            <img src="static/img/index/i-search.png">
            <span>搜索</span>
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
              <img style="width: 100%" src="static/img/index/banner-1.png">
            </el-carousel-item>
            <el-carousel-item>
              <img style="width: 100%" src="static/img/index/banner-2.png">
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="single-whole-read">
          <div class="single" @click='single()'><img src="static/img/index/i-single.png"></div>
          <div class="whole" @click='whole()'><img src="static/img/index/i-whole.png"></div>
        </div>

        <div class="temp">
          <div class="recom-img">
            <img src="static/img/index/temp.png">

            <div class="book_base book_left_top" @click='book_click(0)'>
              <div class="book_fm_1">
                <img :src="$store.state.index_books[0].cover?'https://www.gxsd.mobi/'+$store.state.index_books[0].cover:img_default">
              </div>
              <div class="book_title_1">{{ $store.state.index_books[0].title }}</div>
            </div>

            <div class="book_base book_right_top" @click='book_click(1)'>
              <div class="book_fm_1">
                <img :src="$store.state.index_books[1].cover?'https://www.gxsd.mobi/'+$store.state.index_books[1].cover:img_default">
              </div>
              <div class="book_title_1">{{ $store.state.index_books[1].title }}</div>
            </div>

            <div class="book_base book_left_bottom" @click='book_click(2)'>
              <div class="book_fm_1">
                <img :src="$store.state.index_books[2].cover?'https://www.gxsd.mobi/'+$store.state.index_books[2].cover:img_default">
              </div>
              <div class="book_title_1">{{ $store.state.index_books[2].title }}</div>
            </div>

            <div class="book_base book_right_bottom" @click='book_click(3)'>
              <div class="book_fm_1">
                <img :src="$store.state.index_books[3].cover?'https://www.gxsd.mobi/'+$store.state.index_books[3].cover:img_default">
              </div>
              <div class="book_title_1">{{ $store.state.index_books[3].title }}</div>
            </div>

          </div>
          <div class="recom-click" @click='recom_click()'></div>
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
    name:"index",
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

      var that = this

      var postData = {
        "currentPage": 0,
        "pageSize": 20
      }
      if(this.$store.state.index_books[0].title == ""){
        
        this.httpRequest_body_token_no_loading("read/appRead/getBookList", postData, function(res){

          that.$store.state.index_books = res.data
          if(that.$store.state.index_books.length < 3){
            that.$store.state.index_books = [{"title":"","cover":""},{"title":"","cover":""},{"title":"","cover":""},{"title":"","cover":""}]
          }
        })
      }

      postData = {
        "studentId": this.$store.state.login_cellphone.userId,
        "month": this.getNowTime("y-m")
      }
      this.httpRequest_body_token("read/appRead/getReadTotalBook", postData, function(res){

        that.$store.state.read_passbook = res.data
      })
    },
    methods:{
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .index{
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
        width: 550/50rem;
        .search-{
          width: 100%;
          height: 60/50rem;
          margin: 0 auto;
          margin-top: 15/50rem;
          border-radius: 8/50rem;
          text-align: left;
          line-height: 60/50rem;
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
        width: 100/50rem;
      }
    }
    .container{
      width: 100%;
      height: 100%;
      background: linear-gradient(0.5turn, #8CD5F5, #EBF9FD);
      .scroll{
        height: 100%;
        overflow: scroll;
        .banner{
          width: 100%;
          height: 280/50rem;
          overflow: hidden;
        }
        .single-whole-read{
          height: 173/50rem;
          margin-top: 17/50rem;
          margin-left: 15/50rem;
          margin-right: 15/50rem;
          &>div{
            width: 356/50rem;
            height: 100%;
          }
          .single{
            float: left;
            img{
              width: 100%;
            }
          }
          .whole{
            float: right;
            img{
              width: 100%;
            }
          }
        }
        .temp{
          height: 700/50rem;
          margin-top: 18/50rem;
          margin-left: 15/50rem;
          margin-right: 15/50rem;
          position: relative;
          .recom-img{
            float: left;
            img{
              width: 100%;
              position: absolute;
            }
            .book_base{
              width: 303/50rem;
              height: 270/50rem;
              position: absolute;
              .book_fm_1{
                width: 100%;
                height: 207/50rem;
                position: relative;
                img{
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                }
              }
              .book_title_1{
                width: 100%;
                height: (270 - 207)/50rem;
                line-height: (270 - 207)/50rem;
                text-align: center;
                background-color: white;
              }
            }
            .book_left_top{
              top: 87/50rem;
              left: 37/50rem;
            }
            .book_right_top{
              top: 87/50rem;
              right: 37/50rem;
            }
            .book_left_bottom{
              top: 385/50rem;
              left: 37/50rem;
            }
            .book_right_bottom{
              top: 385/50rem;
              right: 37/50rem;
            }
          }
          .recom-click{
            right: 10/50rem;
            position: absolute;
            width: 140/50rem;
            height: 100/50rem;
          }
        }
        .kong{
          height: 240/50rem;
        }
      }
    }
  }
</style>