<template>
	<div class="content" >
	<div class="top"></div>
	<div class="banner">
		<dl>
			<dt><img src="static\img\read_review\logo.png" mode=""></dt>
		</dl>
		<div class="img">
			<div class="qrcode" ref="qrCodeUrl"></div>
		</div>
		<div class="sharbuttn">
			<div class="btn">立即下载注册</div>
		</div>
		
		<!-- <button class="btn" @click="share">分享</button> -->
		<div class="shartitle"><div>分享</div></div>
		
		
		<div class="bottom">
			<ul>
				<li>1、分享规则规则规则</li>
				<li>2、分享规则规则规则分享规则规则规则</li>
				<li>3、分享规则规则规则分享规则规则规则</li>
			</ul>
		</div>
	</div>
	
	</div>
</template>

<script>
import QRCode from 'qrcodejs2'
	export default {
		data(){
			return {
				providerList:[],				
				sourceLink: 'http://www.sozao.com/',		
				type:0,
			}
		},
		onLoad() {
			//this.creatQrCode();
		},
		methods:{
			creatQrCode() {
				var qrcode = new QRCode(this.$refs.qrCodeUrl, {
					text: 'https://ise.yocou.com/wap.html?userId='+this.$store.state.login_cellphone.userId, // 需要转换为二维码的内容
					width: 100,
					height: 100,
					colorDark: '#000000',
					colorLight: '#ffffff',
					correctLevel: QRCode.CorrectLevel.H
				})
			},

		},
		mounted() {
			this.creatQrCode();
		}
	}
	
	
</script>
<style lang="less">
	.tugurl{
		color: #999;
	}
	.sharbuttn{
		display: flex;
		justify-content: center;
	}
	.shartitle{
		    width: 80%;
			text-align: center;
			margin-left: 10%;
			border-bottom: 1px solid #dddddd;
			position: relative;
			height: 60/50rem;
	}
	.tgtit{
		text-align: center;
	}
	.shartitle div{
		    height: 50/50rem;
			line-height: 50/50rem;
			font-size: 28/50rem;
			color: #999;
			width: 120/50rem;
			margin: 32/50rem auto;
			position: absolute;
			background: #fff;
			left: 50%;
			margin-left: -60/50rem;
	}
	.sharapk{
	 display: flex;
	 justify-content: center;
	 margin: 20/50rem auto
	}
	.sharapk div{
		margin: 40/50rem;
	}
	.sharapk div image{
		height: 80/50rem;
		width: 80/50rem;
	}
	.content{
		width: 100%;
		background-color: #ffffff;
	}
	.top{
		width: 100%;
		height:550/50rem;
		background: url(/static/img/read_review/app-start.jpg) no-repeat ;
		background-size:100% ;
		background-position:top center;
	}
	.banner{
		width: 100% ;
		background-color: #FFFFFF;
		border-radius: 60/50rem 60/50rem 0 0;
		margin-top: -60/50rem;
	}
	.banner dl{
		margin-top: -80/50rem;
	}
	.banner dl dt{
		text-align: center;
	}
	.banner dl dt img{
		width: 160/50rem;
		height: 160/50rem;
		/*border-radius:50% ;*/
		margin-top:60/50rem;
	}
	.banner dl dd{
		text-align: center;
	}
	.img{
		width: 300/50rem;
		height: 300/50rem;
		margin: 0 auto;
		margin-top: 60/50rem;

	}
	.qrcode{
		display: inline-block;
		img {
			width: 300/50rem;
			height: 300/50rem;
			background-color: #fff; //设置白色背景色
			padding: 10/50rem; // 利用padding的特性，挤出白边
			box-sizing: border-box;
		}
	}
	.img img{
		/*width: 100%;
		height: 100%;*/
	}
	.btn{
		width: 260/50rem;
		height: 60/50rem;
		line-height: 60/50rem;
		margin: 0 auto;
		margin-top: 60/50rem;
		border-radius: 40/50rem;
		border: 0;
		font-size: 26/50rem;
		outline: 0;
		background: #33b17b;
		color: #FFFFFF;
		text-align: center;
	}
	.bottom{
		width: 100%;
		height: 400/50rem;
	/* 	background: url(/static/img/read_review/beij.png) no-repeat; */
		background-position:left bottom;/* 设置背景图片位置 */
		background-size: 20%;
		margin-top:50/50rem;
	}
	.bottom ul{
		padding-left: 40/50rem;
		box-sizing: border-box;
	}
	.bottom ul li{
		width: 100%;
		height: 60/50rem;
	}
</style>

