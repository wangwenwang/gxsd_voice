<template>
	<div class="content">
		<header>
		  <div class="title">
			{{navtitle}}
		  </div>
		  <div class="timer" v-if="recordtime>5&&(!isrecording)" @click='uploadandise()'>提交</div>
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
					<div class="Grid-Item" @click="delluy" v-else>
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
