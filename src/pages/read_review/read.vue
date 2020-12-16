<template>
	<div class="content">
		<header>
		  <div class="title">
			{{navtitle}}
		  </div>
		  <div class="timer" v-if="recordtime>5&&(!isrecording)&&is_finish" @click='uploadandise()'>提交</div>
		</header>
		<div class="content1">
			<div class="essay-title">
				{{title}}
			</div>
			<div class="essay">
				<div class="essay-text">
					<p v-html="essay"></p>
				</div>
				<audio :src="fanduwav" style="display:none" @ended="canplay()" ref="fdwav"></audio>
			</div>
			<div class="buttons">
				<div class="Grid">
					<div class="Grid-Item" @click="play" v-if="!isplaying">
						<div class="GSimg"><img class="otherbutton" src="static\img\read_review\fandu.png"></div>
						<div class="GStitle">范读</div>
					</div>
					<div class="Grid-Item" v-else>
						<div class="GSimg"><img class="otherbutton" src="static\img\read_review\fandu.png"></div>
						<div class="GStitle">范读</div>
					</div>
					<div class="Grid-Item" @click="getluy" v-if="!isrecording">
						<!--<div class="GSimg"><text class=" cuIcon-voicefill text-yellow"></text></div>-->
						<div class="GSimg"><img class="recbutton" src="static\img\read_review\record.png"></div>
						<div class="GStitle " v-if="recordtime>0">已朗读 {{recordtime}} 秒</div>
						<div class="GStitle " v-else>建议不超过5分钟</div>
					</div>
					<div class="Grid-Item" @click="getluy" v-else>
						<!--<div class="GSimg"><text class=" cuIcon-roundclosefill text-yellow"></text></div>-->
						<div class="GSimg"><img class="recbutton" src="static\img\read_review\pause.png"></div>
						<div class="GStitle ">{{recordtime}} 秒</div>
					</div>
					<!--<div class="Grid-Item" @click="callise" v-if="recordtime>5&&(!isrecording)">-->
						<!--<div class="GSimg"><text class=" cuIcon-roundcheckfill text-yellow"></text></div>-->
						<!--<div class="GSimg"><img class="otherbutton" src="static\img\read_review\chonglu.png"></div>
						<div class="GStitle ">重录</div>
					</div>-->
					<div class="Grid-Item" @click="rerec">
						<div class="GSimg"><img class="otherbutton" src="static\img\read_review\chonglu.png"></div>
						<div class="GStitle ">重录</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
import axios from 'axios'
import { Loading } from 'element-ui'
import CryptoJS from 'crypto-js'
import '../../../static/js/jquery.js'
import IseRecorder from '../../../static/js/IseRecorder.js'

// ======================开始调用=============================

let countInterval
let getAllResult
let iseRecorder = new IseRecorder()

export default{
		name:"read",
		data(){
			return{
				title: '',
				essay: '如果\n有那样一个黄昏。\n我们都老了。\n一把木椅。\n靠着另一把木椅。\n一定是。\n右面是我。\n左面是你。',
				fanduwav:'https://ise.yocou.com/yinpin/fandu.m4a',  //
				//apiurl:'https://ise.yocou.com/index.php?type=ejz', //数据流
        apiurl:'https://ise.yocou.com/index.php?type=yp_url', //文件
				//apiurl:'http://java.yocou.com:8082/ise/api/speechAssessment',
				blob: null,
				recordtime:0,
				isrecording:false,
				currentpage:0,
				max: 100,
				min: 20,
				activeColor: '#00E3AB',
				progressVal: 60,
				result:{},
				total_score:0,
				wzd_score:1,
				lld_score:1,
				fyf_score:1,
				starclass:'star1',
				errornumber:0,
				resulttext:'',
				resultwav:'',
				isplaying:false,
				music:null,
				audioObj:null,
				taskid:0,
				navtitle:'',
				articleid:0,
				errorwords:'',
        biaodian: '||<br/>|||||||。<br/>|||||。<br/>||||。<br/>|||||||。<br/>|||。<br/>||||。<br/>||||。',
        is_finish: false
			}
		},
    components:{
    },
    created(){

      var that = this
      var tid=this.$route.query.taskId
      var aid=this.$route.query.articleId
      that.taskid=tid
      that.articleid=aid
      var postData = {
        "articleId": aid
      }

      this.httpRequest_body_token("read/appRead/getArticleById", postData, function(res){
        var result = res.data
        that.title="《"+result.title+"》";
        that.essay=result.content;
        that.navtitle="朗读"+that.title;
			
		console.log("content ",result.content);
        //匹配所有汉字替换｜
		var finestr=that.biaodian
		finestr = result.content.replace(/([\u4E00-\u9FA5])/g, "|");//汉字用|替换
		finestr = finestr.replace(/([0-9])/g, "-");//数字用-替换
		//下方为确保2位以上阿拉伯数字能替换正确
		finestr = finestr.replace(/----------/g, "|||||||||||||||||||");
		finestr = finestr.replace(/---------/g, "|||||||||||||||||");
		finestr = finestr.replace(/--------/g, "|||||||||||||||");
		finestr = finestr.replace(/-------/g, "|||||||||||||");
		finestr = finestr.replace(/------/g, "|||||||||||");
		finestr = finestr.replace(/-----/g, "|||||||||");
		finestr = finestr.replace(/----/g, "|||||||");
		finestr = finestr.replace(/---/g, "|||||");
		finestr = finestr.replace(/--/g, "|||");
		finestr = finestr.replace(/-/g, "|");
		that.biaodian=finestr;
        console.log("格式化全文",that.biaodian);
      })
      iseRecorder.onWillApiError = function(){
         that.isrecording=false;
         clearInterval(countInterval) //清除计时
      }
    },
    methods:{
 			getluy() {
				//录音
				var that=this;
				let senconds = 0
				if (iseRecorder.status === 'ing') {
				  iseRecorder.stop()
				  that.isrecording=false;
				  that.is_finish = true;
				  clearInterval(countInterval)

				} else if(status === 'init') {
				  that.recordtime=0;
				  clearInterval(countInterval)

				} else {
				  //var uptext='\uFEFF'+that.essay.replace(/<\/?.+?>/g,"")
				  //var uptext='​【译文】<br><p>	满怀离愁而对夕阳西下，鸣鞭东指从此浪迹天涯。凋落的花朵仍然有情有意，化作春泥培育出新的鲜花。	</p><br>【原文】<p>浩荡离愁白日斜，吟鞭东指即天涯。</p><p>落红不是无情物，化作春泥更护花。</p>'
				  var uptext=that.essay.replace(/\u200B/g,'') //清除原文中非法字符
				  console.log('试卷',uptext)
				  iseRecorder.setText(uptext) //设定试卷
				  iseRecorder.start()
				  that.recordtime=0;
				  //计数器
				  countInterval = setInterval(()=>{
					senconds++

					let second =  (senconds - Math.floor(senconds / 60) * 60)
					second < 10 ? second = '0' + second : '';
					that.recordtime = senconds;
					if (senconds >= 290) {
					  that.isrecording=false;
					  clearInterval(countInterval)
					}
				  }, 1000)

				  that.isrecording=true;
				}
			},
			play(){
				this.$refs.fdwav.play();
				this.isplaying=true;
			},
			canplay(){
				this.isplaying=false;
			},
			rerec(){
				iseRecorder.stop()
				this.isrecording=false;
				this.recordtime=0;
				this.currentpage=0;
				this.resulttext='';
				this.is_finish = false;
			},
			  uploadandise(){
				//上传音频文件并反馈识别结果
				 var that=this;
				 var loading = Loading.service({
					lock: true,
					text: '评测中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				 })

				//上传音频
				var wav_file = new File([iseRecorder.encodeWAV()],"tmp.mp3",{type:'audio/mp3'}); //构造音频文件
				var formData = new FormData(); // Currently empty
				formData.append('file', wav_file);  //表单
				axios.post(that.apiurl, formData).then((res) => {
				  var result = res.data;
				  console.log(result);
				  if( result.code==1){
					let resultwav='https://ise.yocou.com/'+result.data;
					iseRecorder.audioData_ly.size = 0;
					iseRecorder.audioData_ly.buffer = [];
					
					let select_count = 0
					getAllResult = setInterval(()=>{
					  select_count++;
					  if(select_count > 100) {
						clearInterval(getAllResult)
						loading.close();
						this.recordtime=0;
					  }
					  //console.log('评测中',iseRecorder.allResult);
					 if(iseRecorder.allResult != '') {
					   clearInterval(getAllResult)
					   loading.close();
					   this.recordtime=0;

					   console.log(resultwav);
					   const readSentence =  iseRecorder.allResult.xml_result.read_sentence
					   console.log(readSentence)
					   
					   let wavduration=parseInt(that.recordtime);
					   let total_score=parseInt(readSentence.rec_paper.read_sentence.total_score);
					   let wzd=parseInt(readSentence.rec_paper.read_sentence.integrity_score); //完整度
					   let lld=parseInt(readSentence.rec_paper.read_sentence.fluency_score);  //流利度
					   let fyf=parseInt(readSentence.rec_paper.read_sentence.phone_score);    //发音
					   let dxf=parseInt(readSentence.rec_paper.read_sentence.tone_score);     //调型分
					   let wzd_score=parseInt(wzd/20);
					   let lld_score=parseInt(lld/20);
					   let fyf_score=parseInt(fyf/20);
					   let dxf_score=parseInt(dxf/20);
					   let fivescore =parseInt(total_score/20)
					   let starclass='star'+fivescore.toString();
					   let resulttitle='';
					   let resultdesc='';
					   switch(fivescore){
						case 0:
							resulttitle='请认真朗读';
							resultdesc='0分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
						case 1:
							resulttitle='要加油哦';
							resultdesc='20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
						case 2:
							resulttitle='继续努力';
							resultdesc='40分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
						case 3:
							resulttitle='保持努力';
							resultdesc='60+分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
						case 4:
							resulttitle='表现不错';
							resultdesc='80+分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
						case 5:
							resulttitle='你太棒了';
							resultdesc='100分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，0-20分的评价详情详情，';
							break;
					   }
					   if(readSentence.rec_paper.read_sentence.is_rejected == "true"){
							//识别乱读
						   var allju=readSentence.rec_paper.read_sentence.sentence; //讯飞的返回数据中所有的句子
						   var en=0;
						   var resulttext='';
						   var errw='';

						   for(var i = 0,leni=allju.length; i < leni; i++) {
							var allzi=allju[i].word;
							for(var  j = 0,lenj=allzi.length; j < lenj; j++) {
								var allsil=allzi[j].syll;
								var zistatus=1
								var dpmessage=0;
								var errcount=0; //确定错误
								var norcount=0; //比较正确
								var corcount=0; //完全正确
								if(Array.isArray(allsil)){
									for(var k = 0,lenk=allsil.length; k < lenk; k++) {
										//console.log('sil为数组')
										//根据dpmessage的值判断是否读错
										dpmessage=parseInt(allsil[k].dp_message);
										//同时判断content是否为当前字
										var ct=allsil[k].content
										if(dpmessage==0){
											//正确
											corcount++;
										}else if((dpmessage==16 || dpmessage==32|| dpmessage==128) && ct==allzi[j].content ){
											//错误
											errcount++;
										}else{
											//基本正确
											norcount++;
										}
									}
									if(errcount>0){
										//错误
										zistatus=2;
									}else if(norcount>0){
										//基本正确
										zistatus=1;
									}else{
										//正确
										zistatus=0;
									}
									if(zistatus==2){
										//错字增加
										en=en+1;
									}
								}else{
									//console.log('sil非数组')
									//根据dpmessage的值判断是否读错
									dpmessage=parseInt(allsil.dp_message);
									if(dpmessage==0){
										//正确
										zistatus=0;
									}else if(dpmessage==16 || dpmessage==32 || dpmessage==128){
										//错误
										zistatus=2;
										//错字增加
										en=en+1;
									}else{
										//基本正确
										zistatus=1;
									}
								}
								if(zistatus==0){
									//正确为蓝色
									that.biaodian = that.biaodian.replace("|","<font style='color:blue'>"+allzi[j].content+"</font>")
								}else if(zistatus==2){
									//错误为红色，并保存
									that.biaodian = that.biaodian.replace("|","<font style='color:red'>"+allzi[j].content+"</font>")
									errw+=allzi[j].content;
								}else{
									//基本正确为黑色
									that.biaodian = that.biaodian.replace("|","<font style='color:black'>"+allzi[j].content+"</font>")
								}
							}
						   }
						   that.errorwords=errw;
						   var errornumber=en;
						   //跳转至评测结果
						   that.$router.push({
							name:"review",
							query:{
								name: "none",
								icon:"none",
								zf:0,
								wz:0,
								ll:0,
								fy:0,
								dx:0,
								wzd:0,
								lld:0,
								fyf:0,
								dxf:0,
								err:errornumber,
								wav:resultwav,
								fstr:that.biaodian,
								dr:0,
								sc:'star0',
								scoretitle:'判定为乱读',
								scoretext:'判定为乱读的评价详情详情，判定为乱读的评价详情详情，判定为乱读的评价详情详情，判定为乱读的评价详情详情',
								taskid:that.taskid,
								articleid:that.articleid,
								errorwords:'',
								//xfstr:JSON.stringify(result)
								xfstr:'{}'
							}
						   })
					   }else{
						   //非乱读
						   var allju=readSentence.rec_paper.read_sentence.sentence;  //讯飞的返回数据中所有的句子
						   var en=0;
						   var resulttext='';
						   var errw='';

						   for(var i = 0,leni=allju.length; i < leni; i++) {
							var allzi=allju[i].word;
							for(var  j = 0,lenj=allzi.length; j < lenj; j++) {
								var allsil=allzi[j].syll;
								var zistatus=1
								var dpmessage=0;
								var errcount=0; //确定错误
								var norcount=0; //比较正确
								var corcount=0; //完全正确
								if(Array.isArray(allsil)){
									for(var k = 0,lenk=allsil.length; k < lenk; k++) {
										//console.log('sil为数组')
										//根据dpmessage的值判断是否读错
										dpmessage=parseInt(allsil[k].dp_message);
										//同时判断content是否为当前字
										var ct=allsil[k].content
										if(dpmessage==0){
											//正确
											corcount++;
										}else if((dpmessage==16 || dpmessage==32|| dpmessage==128) && ct==allzi[j].content ){
											//错误
											errcount++;
										}else{
											//基本正确
											norcount++;
										}
									}
									if(errcount>0){
										//错误
										zistatus=2;
									}else if(norcount>0){
										//基本正确
										zistatus=1;
									}else{
										//正确
										zistatus=0;
									}
									if(zistatus==2){
										//错字增加
										en=en+1;
									}
								}else{
									//console.log('sil非数组')
									//根据dpmessage的值判断是否读错
									dpmessage=parseInt(allsil.dp_message);
									if(dpmessage==0){
										//正确
										zistatus=0;
									}else if(dpmessage==16 || dpmessage==32 || dpmessage==128){
										//错误
										zistatus=2;
										//错字增加
										en=en+1;
									}else{
										//基本正确
										zistatus=1;
									}
								}
								if(zistatus==0){
									//正确为蓝色
									that.biaodian = that.biaodian.replace("|","<font style='color:blue'>"+allzi[j].content+"</font>")
								}else if(zistatus==2){
									//错误为红色，并保存
									that.biaodian = that.biaodian.replace("|","<font style='color:red'>"+allzi[j].content+"</font>")
									errw+=allzi[j].content;
								}else{
									//基本正确为黑色
									that.biaodian = that.biaodian.replace("|","<font style='color:black'>"+allzi[j].content+"</font>")
								}

							}
						   }
						   that.errorwords=errw;
						   var errornumber=en;
						   //跳转到评测结果
						   that.$router.push({
							name:"review",
							query:{
								name: "none",
								icon:"none",
								zf:total_score,
								wz:wzd,
								ll:lld,
								fy:fyf,
								dx:dxf,
								wzd:wzd_score,
								lld:lld_score,
								fyf:fyf_score,
								dxf:dxf_score,
								err:errornumber,
								wav:resultwav,
								fstr:that.biaodian,
								dr:wavduration,
								sc:starclass,
								scoretitle:resulttitle,
								scoretext:resultdesc,
								taskid:that.taskid,
								articleid:that.articleid,
								errorwords:that.errorwords,
								//xfstr:JSON.stringify(result)
								xfstr:'{}'
							}
						   })
					   }


					  }
					}, 1000)

				  }
				})
			  }
		}
}
</script>
<style lang="less" scoped>
	.content {
	    overflow: hidden;
		width: 100%;
		display:block;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color:#FFF;
	}
	header{
      height: 90/50rem;
      border-bottom: 1/50rem solid  #D9D9D9;
	  position:fixed;
	  width:100%;
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
	.content1{
		height:auto;
		width:100%;
		margin-top:125/50rem;
	    margin-bottom:290/50rem;
	}
	.essay-title{
		text-align: center;
		height:100/50rem;
		line-height:100/50rem;
		margin-top:50/50rem;
		font-size:44/50rem;
		font-weight:bold;
	}
	.essay{
		height:70%;
		width:80%;
		/*background: #FFFFFF;
		border: 20/50rem solid #C6E6FF;*/
		/*border-radius: 18px;*/
		margin:0/50rem auto;
		padding-right:30/50rem;
	}
	.essay-text{
		font-size:36/50rem;
		margin:20/50rem;
		line-height:54/50rem;
		white-space: pre-wrap;
	}
	.buttons{
		position:fixed;
		width:100%;
		height:240/50rem;
		background: #FFFFFF;
		/*box-sizing: border-box;*/
		/*border: 10/50rem solid #C6E6FF;*/
		/*border: 1/50rem solid #CCC;*/
		border-top-left-radius: 20/50rem;
		border-top-right-radius: 20/50rem;
		bottom: var(--window-bottom,0);
		box-shadow: 0px 20/50rem 20/50rem 20/50rem #CCC;
	}
	.Grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		/*width:75%;
		margin:30/50rem auto;*/
		padding:10/50rem 0;
		font-size: 30/50rem;
	}
	.otherbutton{
			width: 72/50rem;
			height: 72/50rem;
			/*margin-top: 42/50rem;*/
			/*margin-left: 50/50rem;*/
			margin:20/50rem auto;
	}
	.recbutton{
		width: 108/50rem;
		height: 108/50rem;
		/*margin-top: 42/50rem;*/
		/*margin-left: 50/50rem;*/
		margin:0/50rem auto;
	}
	.Grid-Item {
		width: 33%;
		height: 213/50rem;
		text-align: center;
		/*border:1/50rem solid #ccc;*/
		box-sizing:border-box;
	}
	.GSimg {
		width: 96/50rem;
		height: 96/50rem;
		/*margin-top: 42/50rem;*/
		/*margin-left: 50/50rem;*/
		margin:32/50rem auto;
	}
	.Image {
		width: 96/50rem;
		height: 96/50rem;
	}
	.GStitle {
		width: 100%;
		height: 34/50rem;
		line-height: 34/50rem;
		color: #CCC;
		font-size: 30/50rem;
		/*margin-top: 10/50rem;*/
	}
	.text-gray{
		color:#DDD;
		font-size:80/50rem;
	}
	.text-yellow{
		color:#ffaa00;
		font-size:100/50rem;
	}
</style>
