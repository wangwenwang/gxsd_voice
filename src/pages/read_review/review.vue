<template>
	<div class="content">
		<header>
		  <div class="title">
			{{ $store.state.login_cellphone.name }}口语评测报告
		  </div>
		</header>
		<div class="content2">
			<div :class="starclass">
				<div class="logo"><img :src="$store.state.login_cellphone.icon?$store.state.login_cellphone.icon:avatar_default"" class="avatar-content"></div>
			</div>
			<div class="c2middle">
				<div class="mdrow" v-if="total_score>80">
					<div class="mdtitle">{{total_score}}，{{resulttitle}}</div>
				</div>
				<div class="mdrownozan" v-else>
					<div class="mdtitle">{{total_score}}，{{resulttitle}}</div>
				</div>
			</div>
			<div class="c2footer">
		
				<div class="fttext">{{resultdesc}}</div>
				<div class ="rate">
					<div class="ratetext">完整度：</div>
					<div class="rateicon"><img :src="wzdpic" /></div>
				</div>
				<div class ="rate">
					<div class="ratetext">流利度：</div>
					<div class="rateicon"><img :src="lldpic" /></div>
				</div>
				<div class ="rate">
					<div class="ratetext">声韵分：</div>
					<div class="rateicon"><img :src="fyfpic" /></div>
				</div>
				<div class ="rate">
					<div class="ratetext">调型分：</div>
					<div class="rateicon"><img :src="dxfpic" /></div>
				</div>
				<div class ="errortexttitle">错字：{{errornumber}}个</div>
				<div class ="errortext">
					<div class="textblue">蓝色：完全正确</div>
					<div class="textblack">黑色：基本正确</div>
					<div class="textred">红色：完全错误</div>
				</div>
				<div class="voicebox">
					
					<div class="voicebutton" @click="startPlayOrPause">
						<img src="static\img\read_review\play.png" v-if="!audio.playing">
						<img src="static\img\read_review\stop.png" v-else><!-- 暂停-->
					</div>

					<div class="voicelefttext">{{ audio.currentTime | formatSecond}}</div>
					<div class="voiceslider">
						<audio ref="audio" 
							@pause="onPause"
							@play="onPlay"
							@timeupdate="onTimeupdate" 
							@loadedmetadata="onLoadedmetadata"
							:src="wavdata.asrc" controls="none" style="display:none">
						</audio>
						<el-slider v-model="sliderTime" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider"></el-slider>
					</div>
					<div class="voicerighttext">{{ audio.maxTime | formatSecond}}</div>			
				</div>
				<div class="oldtext">
					<div v-html="resulttext"></div>
				</div>
			</div>
			<div class="footerend">
			</div>
			<div class="mainbutton">
				<div class="leftbutton">
					<button class="buttonagain" @click="rerec">再来一次</button>
				</div>
				<div class="rightbutton">
					<button class="buttonshare" @click="share">分享报告</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	// 将整数转换成 时：分：秒的格式
	function realFormatSecond(second) {
	  var secondType = typeof second

	  if (secondType === 'number' || secondType === 'string') {
		second = parseInt(second)

		var hours = Math.floor(second / 3600)
		second = second - hours * 3600
		var mimute = Math.floor(second / 60)
		second = second - mimute * 60

		return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
	  } else {
		return '00:00'
	  }
	}
	export default{
		name:"review",
		data(){
			return{
				wavdata: 
				{
				    duration: 1,
				    asrc: ''
				},
				title: '',
				essay: '',
				blob: null,
				result:{},
				total_score:0,
				wzd_score:0,
				lld_score:0,
				fyf_score:0,
				dxf_score:0,
				wzd:0,
				lld:0,
				fyf:0,
				dxf:0,
				starclass:'star1',
				errornumber:0,
				resulttext:'',
				resultwav:'',
				icon:'',
				wzdpic:'',
				lldpic:'',
				fyfpic:'',
				dxfpic:'',
				sliderTime:0,
				audio: {
					// 该字段是音频是否处于播放状态的属性
					playing: false,
					// 音频当前播放时长
					currentTime: 0,
					// 音频最大播放时长
					maxTime: 0
				},
				taskid:0,
				articleid:0,
				xfstr:'',
				errorwords:''
			}
		},
		components:{
		},
		created(){
			//接收页面参数
			var that = this
	  		console.log(that.$route.query);
			that.title=that.$route.query.name;
			that.icon=that.$route.query.icon;
			that.total_score=that.$route.query.zf;
			that.wzd_score=that.$route.query.wzd;
			that.lld_score=that.$route.query.lld;
			that.fyf_score=that.$route.query.fyf;
			that.dxf_score=that.$route.query.dxf;
			that.wzd=that.$route.query.wz;
			that.lld=that.$route.query.ll;
			that.fyf=that.$route.query.fy;	
			that.dxf=that.$route.query.dx;				
			that.errornumber=that.$route.query.err;
			that.wavdata.duration=that.$route.query.dr;
			that.wavdata.asrc=that.$route.query.wav;
			that.resulttext=that.$route.query.fstr;
			that.starclass=that.$route.query.sc;
			that.resulttitle=that.$route.query.scoretitle;
			that.resultdesc=that.$route.query.scoretext;
			that.wzdpic="static/img/read_review/s"+that.$route.query.wzd+".jpg";
			that.lldpic="static/img/read_review/s"+that.$route.query.lld+".jpg";
			that.fyfpic="static/img/read_review/s"+that.$route.query.fyf+".jpg";
			that.dxfpic="static/img/read_review/s"+that.$route.query.dxf+".jpg";
			that.taskid=that.$route.query.taskid
			that.articleid=that.$route.query.articleid
			that.xfstr=that.$route.query.xfstr
			that.errorwords=that.$route.query.errorwords
			console.log(that.resulttext);
			//console.log(that.resulttext.indexOf('\t'))
			that.resulttext = that.resulttext.replace(/\t/g, "　　"); //将tab转为两个中文空格
		},
		mounted: function () {
			var that=this
			var postData = {
				"taskStudentId": this.taskid,
				"articleId": this.articleid,
				"aticleSegmentId": 123,
				"sounds": this.wavdata.asrc,
				"reciteType": "TEST",
				"zhpf":this.total_score,
				"zhpj":this.resultdesc,
				"wzdpf":this.wzd,
				"lldpf":this.lld,
				"fypf":this.fyf,
				"xffhJson":this.xfstr,
				"reciteDate":this.getNowTime()
			}
			//调用增加朗读接口
			this.httpRequest_body_token("read/information/addRecite", postData, function(res){
				console.log(res.data.id)
				if(that.errornumber>0 && res.success && res.data.id>0){
					console.log("有错字")
					var postData1 = {
						"reciteId": res.data.id,
						"words": that.errorwords
					}
					that.httpRequest_body_token("read/information/addPronunciationError", postData1, function(res1){
						console.log(res1.data)
					})
				}
			})
		},
		methods:{
			share(){
				this.$router.push("share")
			},
			startPlayOrPause () {
			  return this.audio.playing ? this.pause() : this.play()
			},
			// 播放音频
			play () {
			  this.$refs.audio.play()
			},
			// 暂停音频
			pause () {
			  this.$refs.audio.pause()
			},
			// 当音频播放
			onPlay () {
			  this.audio.playing = true
			},
			// 当音频暂停
			onPause () {
			  this.audio.playing = false
			},
			// 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
			onTimeupdate(res) {
			  console.log('timeupdate')
			  console.log(res)
			  this.audio.currentTime = res.target.currentTime.toFixed(1)
			},
			// 当加载语音流元数据完成后，会触发该事件的回调函数
			// 语音元数据主要是语音的长度之类的数据
			onLoadedmetadata(res) {
			  console.log('loadedmetadata')
			  console.log(res)
			  this.audio.maxTime = parseInt(res.target.duration)
			},
			changeCurrentTime(index) {
			  this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime).toFixed(1)
			},
			// 当音频当前时间改变后，进度条也要改变
			onTimeupdate(res) {
			  console.log('timeupdate')
			  console.log(res)
			  this.audio.currentTime = res.target.currentTime.toFixed(1)
			  this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
			},

			// 进度条格式化toolTip
			formatProcessToolTip(index = 0) {
			  index = parseInt(this.audio.maxTime / 100 * index)
			  return '进度条: ' + realFormatSecond(index)
			},
			rerec(){
				this.$router.push({
					name:"read",
					query:{
						taskId:this.taskid,
						articleId:this.articleid
					}
				})
			}
		},
		filters: {
			// 使用组件过滤器来动态改变按钮的显示
			transPlayPause(value) {
				return value ? 'pause' : 'play'
			},
			// 将整数转化成时分秒
			formatSecond(second = 0) {
				return realFormatSecond(second)
			}
		}
	}
</script>
<style lang="less" scoped>
	.content {
	    overflow: hidden;
		width: 100%;
		height: auto;
		/*display: flex;*/
		display:block;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #1B9BFE;
	}
	header{
      height: 90/50rem;
	  position: fixed;
	  width: 100%;
      //border-bottom: 1/50rem solid  #D9D9D9;
    }
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
        height: 50/50rem;
        top: 20/50rem;
        bottom: 5/50rem;
        right: 25/50rem;
        position: absolute;
        line-height: 50/50rem;
        font-size: 32/50rem;
        color: white;
		background-color: #81c8ff;
		padding: 1/50rem 25/50rem;
		border-radius: 10/50rem;
      }
	.content2{
		height:auto;
		width:100%;
		font-size:30/50rem;
		margin-top: 90/50rem;
	}
	.star0{
		height:300/50rem;
		background-image: url(/static/img/read_review/star0.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.star1{
		height:300/50rem;
		background-image: url(/static/img/read_review/star1.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.star2{
		height:300/50rem;
		background-image: url(/static/img/read_review/star2.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.star3{
		height:300/50rem;
		background-image: url(/static/img/read_review/star3.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.star4{
		height:300/50rem;
		background-image: url(/static/img/read_review/star4.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.star5{
		height:300/50rem;
		background-image: url(/static/img/read_review/star5.jpg);
		background-position: top;
		background-size:100% 100%;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
	}
	.logo {
		height: 135/50rem;
		width: 135/50rem;
		padding-top: 150/50rem;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50/50rem;
	}
	.avatar-content {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 50%;
		border:7/50rem solid #F9DB49;
		box-sizing: border-box;
	}
	.c2middle {
		height:80/50rem;
		line-height:80/50rem;
		background-image: url(/static/img/read_review/bg2.jpg);
		background-position: top;
		/*background-repeat-x: inherit;*/
		background-size:100% 100%;
		/*margin:0 auto;*/
	}
	.mdrow{
		width:360/50rem;
		height:80/50rem;
		line-height:80/50rem;
		margin:0 auto;
		background-image: url(/static/img/read_review/zan.jpg);
		background-position: right;
		background-size:100%;
		ackground-repeat:no-repeat;
	}
	.mdrownozan{
		width:360/50rem;
		height:80/50rem;
		line-height:80/50rem;
		margin:0 auto;
		background-position: right;
		background-size:100%;
		ackground-repeat:no-repeat;
	}
	.mdtitle{
		width:360/50rem;
		height:100/50rem;
		font-size:40/50rem;
		line-height:80/50rem;
		vertical-align:middle;
		text-align:center;
		font-weight: bold;
		/*float:left;*/
	}
	.c2footer {
		height:auto;
		background-image: url(/static/img/read_review/bg2.jpg);
		//background-position: bottom;
		/*background-repeat-x: inherit;*/
		background-size:100% auto;
		background-repeat:x;
		/*margin:0 auto;*/

		
	}
	.fttext{
		font-size:30/50rem;
		padding:30/50rem 70/50rem;
		line-height:40/50rem;
	}
	.rate{
		height:50/50rem;
		line-height:50/50rem;
		font-size:36/50rem;
		margin:10/50rem 70/50rem;
		color:#808080;
	}
	.ratetext{
		width:25%;float:left;font-size:27/50rem;
	}
	.rateicon{
		width:75%;float:left;height:50/50rem;
	}
	.rateicon img{
		width:250/50rem;
		height:50/50rem;
		float:left;
		margin-left:0/50rem;
	}
	.errortexttitle{
		height:40/50rem;
		line-height:50/50rem;
		font-size:36/50rem;
		margin:30/50rem 70/50rem;
		color:#000;
	}
	.errortext{
		height:40/50rem;
		line-height:50/50rem;
		font-size:26/50rem;
		margin:30/50rem 70/50rem;
		
	}
	.spanred{
		color:#ff0000;
	}
	.spanblue{
		color:#0000ff;
	}
	.spanblack{
		color:#000000;
	}
	.textred{
		color:#ff0000;
		width:33%;
		float:left;
		text-align: right;
		font-size:27/50rem;
	}
	.textblue{
		color:#0000ff;
		width:33%;
		float:left;
		text-align: left;
		font-size:27/50rem;
	}
	.textblack{
		color:#000000;
		width:33%;
		float:left;
		text-align: center;
		font-size:27/50rem;
	}
	.voicebox{
		margin:20/50rem auto;
		text-align: center;
		height:110/50rem;
		line-height:110/50rem;
		width:86%;
		background: #f1f5f8;
		/*border: 10px solid #f1f5f8;*/
		border-radius: 18/50rem;
	}
	.voicebutton{
		width:55/50rem;
		height:55/50rem;
		float:left;
		margin:18/50rem 20/50rem;
	}

	.voicebutton img{
		width:55/50rem;
		height:55/50rem;
	}
	.voicelefttext{
		color:#808080;
		text-align: center;
		float:left;
		width:80/50rem;
		font-size:28/50rem;
		height:110/50rem;
		line-height:110/50rem;
		
	}
	.voicerighttext{
		color:#808080;
		text-align: center;
		float:left;
		width:80/50rem;
		font-size:28/50rem;
		height:110/50rem;
		line-height:110/50rem;
		margin-left:20/50rem;
	}
	.voiceslider{
		width:320/50rem;
		float:left;
		margin-top:16/50rem;
		margin-left:25/50rem;
		/*background-color: #CCC;*/
	}
	.x-mp3-progress{
		width: 100%;
		position: absolute;
		height: 6px;
		overflow: hidden;
		bottom: 0;
		left: 0;
	}
    .x-now-progress{
		position: relative;
		/*@extend %transition;*/
		height: 6px;
		background-color: #1B9BFE;
    }
	.oldtext{
		margin:auto 70/50rem;
		font-size:30/50rem;
		height:auto;
		line-height:40/50rem;
	}

	.footerend {
		height:30/50rem;
		background-image: url(/static/img/read_review/bg3.jpg);
		background-position: bottom;
		/*background-repeat-x: inherit;*/
		background-size:100% auto;
		background-repeat:no-repeat;
		/*margin:0 auto;*/
		margin-bottom:150/50rem;
		padding-bottom:50/50rem;
		
	}
	.mainbutton{
		width:100%;
		height:150/50rem;
		background-color: #FFF;
		margin:0 auto;
		/*margin-top:20/50rem;*/
		position:fixed;
		bottom:0
	}
	.leftbutton{
		width:40%;
		height:100/50rem;
		float:left;
		margin-left:28/50rem;
		margin-top:25/50rem;
	}
	.rightbutton{
		width:50%;
		height:100/50rem;
		float:left;
		margin-left:20/50rem;
		margin-top:25/50rem;
	}
	.buttonagain{
		color:#1B9CFF;
		background-color: #FFF;
		border-color:#1B9CFF;
		border-width: 5/50rem;
		border-radius: 50/50rem;
		height:100%;
		width:100%;
		
	}
	.buttonshare{
		color:#FFF;
		background-color: #1B9CFF;
		border-radius: 50/50rem;
		height:100%;
		width:100%;
		border:none;
	}
</style>