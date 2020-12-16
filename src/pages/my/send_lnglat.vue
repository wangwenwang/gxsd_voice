<template>
  <div class="ChooseAddress">
  

    <header>
      <div class="title">选择学校</div>
      <div class="btn">
        <img @click='back()' src="static/img/header/i-back.png">
      </div>
      <div class="timer" @click='confirm()'>确定</div>
    </header>

    <header_index title='选择学校' :back_icon='true' @back='back'></header_index>

    <div class="container" id="container"></div>

    <div id="panel"></div>

    <div id="pickerBox">
      <input id="pickerInput" placeholder="输入关键字选取地点" />
      <div id="poiInfo"></div>
    </div>

    <div id="allowSearch_NearBy">false</div>

  </div>
</template>
<script type="text/javascript">
  import header_index from '../../components/header.vue'
  import $ from "jquery"
  export default{
    data(){
      return{
        name: "",
        placeSearch: "",
        regeocode: {},   //学校相关的信息，省、市、区县等
      }
    },
    components:{
      header_index
    },
    created(){

      this.TelliOSORAndroid_GetCurrentLocMounted()
    },
    mounted(){

      var that = this

      var map = new AMap.Map('container', {
        resizeEnable: true,
      })

      // 获取当前位置
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition:'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)、
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
          convert: false, //是否使用坐标偏移，取值true:为高德地图坐标，取值false:为浏览器定位坐标
          useNative: true, //是否使用安卓定位sdk用来进行定位，默认：false
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition(function(status,result){
          if(status=='complete'){
            that.onComplete(result, map)
          }else{
            that.onError(result, map)
          }
        })
      })
      $(".amap-geolocation-con").click(function(){
        $("#allowSearch_NearBy").text("true")
      })

      window.SetCurrAddress = this.SetCurrAddress

      window.history.pushState(null, null, document.URL)
      window.addEventListener("popstate", this.onBrowserBack, false)
    },
    destroyed() {

      window.removeEventListener("popstate", this.onBrowserBack, false)
    },
    methods:{
    
      onBrowserBack() {
        
        this.back()
      },
      // 返回上一页
      back(){

        this.clearVuex()
        this.$router.push("personal_info")
      },
      // iOS/Android原生传过来的当前位置
      SetCurrAddress:function(address, lng, lat, bdcode) {

        this.V_ADDRESS = address;
      },
      clearVuex(){

        this.$store.state.send_lnglat.lng = 0
        this.$store.state.send_lnglat.lat = 0
      },
      // 确定
      confirm(){

        this.clearVuex()
        var poi = ""
        try{
          poi = $(".poi-name")[0].innerText
        }catch(e){}
        var input = $("#pickerInput").val()
        if(poi == ""){
          this.$toast({message:"学校不能为空", type:'', position:'bottom', duration:'2000'})
          return
        }
        var that = this
        var postData = {
          "userId": this.$store.state.login_cellphone.userId,
          "organizationName": poi,
          "province": this.regeocode.addressComponent.province,
          "city": this.regeocode.addressComponent.city,
          "area": this.regeocode.addressComponent.district,
          "address": this.regeocode.formattedAddress,
        }
        this.httpRequest_token("app/user/updateUserInfo", postData, function(res){
          that.$router.push("personal_info")
        })
      },
      onComplete(data, map){

        var that = this;
        console.log("获取【当前位置】成功", data)
        that.loadMap(map, data.position)
      },
      onError(data){

        this.$message.error("获取【当前位置】失败，请打开GPS，返回后重试")
        this.$message.error(data)
        this.$message.error(data)
      },
      loadMap(map, p){

        console.log(p)

        var that = this

        AMap.service(["AMap.PlaceSearch"], function() {
          //构造地点查询类
          that.placeSearch = new AMap.PlaceSearch({ 
            type: '小学,中学', // 兴趣点类别
            pageSize: 10, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "", // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            map: map, // 展现结果的地图实例
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          })
          var cpoint 
          if(that.$store.state.send_lnglat.lng > 0){
            cpoint = [that.$store.state.send_lnglat.lng, that.$store.state.send_lnglat.lat]
          }else{
            cpoint = [p.lng, p.lat]  //中心点坐标
          }
          that.placeSearch.searchNearBy('', cpoint, 2000, function(status, result) { })
        })

        AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function(PositionPicker, PoiPicker) {

          var positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map,
          })
          positionPicker.start([p.lng, p.lat])

          var poiPicker = new PoiPicker({
            input: 'pickerInput'
          })
          positionPicker.on('success', function(positionResult) {

            that.regeocode = positionResult.regeocode
            console.log(positionResult)

            var a_n = $("#allowSearch_NearBy").html()

            that.$store.state.send_lnglat.lng =  positionResult.position.lng
            that.$store.state.send_lnglat.lat =  positionResult.position.lat

            if(a_n == "true"){

              that.$router.push("personal_info")
              $("#allowSearch_NearBy").text("false")
              var a_n_b = $("#allowSearch_NearBy").html()
            }
          })
          //初始化poiPicker
          poiPickerReady(poiPicker)
        })
        function poiPickerReady(poiPicker) {

          var that = this

          window.poiPicker = poiPicker

          var marker = new AMap.Marker()

          var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
          })
          //选取了某个POI
          poiPicker.on('poiPicked', function(poiResult) {
            $("#allowSearch_NearBy").text("true")
            var s = poiResult.item.name
            $("#pickerInput").val(s)
            $("#panel").css("display","none")
            var source = poiResult.source,
            poi = poiResult.item,
            info = {
              source: source,
              id: poi.id,
              name: poi.name,
              location: poi.location.toString(),
              address: poi.address
            }
            marker.setMap(map)
            infoWindow.setMap(map)
            marker.setPosition(poi.location)
            infoWindow.setPosition(poi.location)
            infoWindow.open(map, marker.getPosition())
            map.setCenter(marker.getPosition())
          })
        }
      },
    }
  }
</script>
<style lang="less" scoped>
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
      width: 90/50rem;
      height: 80/50rem;
      top: 18/50rem;
      bottom: 5/50rem;
      right: 10/50rem;
      color: white;
      position: absolute;
    }
  }
  .ChooseAddress{
    width: 100%; 
    height: 100%;
    #container{
      width: 100%; 
      height: calc(60% - 1.8rem);
      margin-top: 90/50rem;
    }
    #pickerBox {
      position: absolute;
      z-index: 2;
      top: 50px;
      right: 30px;
      width: 300px;
    }
    #pickerInput {
      width: 200px;
      padding: 5px 5px;
    }
    #panel {
      position: fixed;
      background-color: white;
      max-height: 40%;
      overflow-y: auto;
      bottom: 0;
      width: 100%;
    }
  }
</style>