
const APPID = '5f9a1b08'
const API_SECRET = '6680a66e29cc20bc480deab66f56e404'
const API_KEY = '031f20bdd09b70e5aec167575bf108fb'
import CryptoJS from 'crypto-js'
import Worker from './transcode.worker.js'
import { Base64 } from './base64js.js'
import parser from 'fast-xml-parser'

const transWorker = new Worker()

var startTime = ""
var endTime = ""


/**
 * 获取websocket url
 * 该接口需要后端提供，这里为了方便前端处理
 */
function getWebSocketUrl() {
  return new Promise((resolve, reject) => {
    // 请求地址根据语种不同变化
    var url = 'wss://ise-api.xfyun.cn/v2/open-ise'
    var host = 'ise-api.xfyun.cn'
    var apiKey = API_KEY
    var apiSecret = API_SECRET
    var date = new Date().toGMTString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/open-ise HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}

const IseRecorder =  class IseRecorder {
  constructor({ language, accent, appId } = {}) {
    let self = this
    this.text_video = '';
    this.status = 'null'
    this.language = language || 'zh_cn'
    this.accent = accent || 'mandarin'
    this.appId = appId || APPID
    // 记录音频数据
    this.audioData = []
    // 记录评测结果
    this.resultText = ''
    //录音使用
    this.audioData_ly = {
            size: 0          //录音文件长度
            , buffer: []     //录音缓存
            , inputSampleRate: 16000    //输入采样率
            , inputSampleBits: 16       //输入采样数位 8, 16
            , outputSampleRate: 16000    //输出采样率
            , oututSampleBits: 16      //输出采样数位 8, 16
    }
    // wpgs下的评测结果需要中间状态辅助记录
    this.resultTextTemp = ''
    transWorker.onmessage = function (event) {
      self.audioData.push(...event.data)
    }
  }

  // 修改文本内容
  setText(text_video) {
    this.text_video = text_video
  }
  //input 录音数据
  setAudioInput(data){
    this.audioData_ly.buffer.push(new Float32Array(data));
    this.audioData_ly.size += data.length;
  }

  // 修改录音评测状态
  setStatus(status) {
    //this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status)
    if(this.status !== status){
      this.status = status

      if (this.status === 'end') {
        this.onWillApiError()
      }
    }
  }

  setResultText(setResultXml = '') {
    //this.onTextChange && this.onTextChange(setResultXml || '')

    this.allResult = setResultXml;
  }
  // 修改评测参数
  setParams({ language, accent } = {}) {
    language && (this.language = language)
    accent && (this.accent = accent)
  }
  // 连接websocket
  connectWebSocket() {
    if (APPID === 'APPID' || !APPID) {
      //alert('请填写APPID、APISecret、APIKey，可从控制台-我的应用-语音评测（流式版）页面获取。')
      return false;
    }
    return getWebSocketUrl().then(url => {
      let iseWS
      if ('WebSocket' in window) {
        iseWS = new WebSocket(url)
      } else if ('MozWebSocket' in window) {
        iseWS = new MozWebSocket(url)
      } else {
        alert('浏览器不支持WebSocket')
        return
      }
      this.webSocket = iseWS
      this.setStatus('init')
      iseWS.onopen = e => {
        this.setStatus('ing')
        // 重新开始录音
        setTimeout(() => {
          this.webSocketSend()
        }, 500)
      }
      iseWS.onmessage = e => {
        this.result(e.data)
      }
      iseWS.onerror = e => {
        this.recorderStop()
      }
      iseWS.onclose = e => {
        this.recorderStop()
      }
    })
  }
  // 初始化浏览器录音
  recorderInit() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    // 创建音频环境
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

      this.audioData_ly.inputSampleRate = this.audioContext.sampleRate
      this.audioContext.resume()
      console.log(this.audioData_ly);
      if (!this.audioContext) {
        alert('浏览器不支持webAudioApi相关接口')
        return
      }
    } catch (e) {
      if (!this.audioContext) {
        alert('浏览器不支持webAudioApi相关接口')
        return
      }
    }

    // 获取浏览器录音权限
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then(stream => {
          getMediaSuccess(stream)
        })
        .catch(e => {
          getMediaFail(e)
        })
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
        stream => {
          getMediaSuccess(stream)
        },
        function(e) {
          getMediaFail(e)
        }
      )
    } else {
      if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
        alert('chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限')
      } else {
        alert('无法获取浏览器录音功能，请升级浏览器或使用chrome')
      }
      this.audioContext && this.audioContext.close()
      return
    }
    // 获取浏览器录音权限成功的回调
    let getMediaSuccess = stream => {
      // 创建一个用于通过JavaScript直接处理音频
      this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1)
      this.scriptProcessor.onaudioprocess = e => {
        // 去处理音频数据
        if (this.status === 'ing') {
          transWorker.postMessage(e.inputBuffer.getChannelData(0))
          this.setAudioInput(e.inputBuffer.getChannelData(0));
        }
      }
      // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
      this.mediaSource = this.audioContext.createMediaStreamSource(stream)
      // 连接 开始录音
      this.mediaSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)

      this.connectWebSocket()
    }

    let getMediaFail = (e) => {
      alert('请求麦克风失败')

      this.audioContext && this.audioContext.close()
      this.audioContext = undefined
      // 关闭websocket
      if (this.webSocket && this.webSocket.readyState === 1) {
        this.webSocket.close()
      }
    }
  }
  recorderStart() {
    this.audioData_ly.size = 0;
    this.audioData_ly.buffer = [];

    if (!this.audioContext) {
      this.recorderInit()
    } else {
      this.audioContext.resume()
      this.connectWebSocket()
    }
  }
  // 暂停录音
  recorderStop() {
    // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
    if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgen))){
      this.audioContext && this.audioContext.suspend()
    }
    this.setStatus('end')
  }

  // 对处理后的音频数据进行base64编码
  toBase64(buffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
  // 向webSocket发送数据
  webSocketSend() {
    if (this.webSocket.readyState !== 1) {
      return
    }
    let audioData = this.audioData.splice(0, 1280)
    var params = {
      common: {
        app_id: this.appId,
      },
      business: {
        category: 'read_sentence', // read_syllable/单字朗读，汉语专有 read_word/词语朗读  read_sentence/句子朗读 http://test.www.xfyun.cn/doc/Ise/IseAPI.html#%E6%8E%A5%E5%8F%A3%E8%B0%83%E7%94%A8%E6%B5%81%E7%A8%8B
        rstcd: 'utf8',
        group: 'pupil',
        sub: 'ise',
        ent: 'cn_vip',
        tte: 'utf-8',
        cmd: 'ssb',
        auf: 'audio/L16;rate=16000',
        aus: 1,
        aue: 'raw',
        text: '\uFEFF '+ this.text_video,
      },
      data: {
        status: 0,
        encoding: 'raw',
        data_type: 1,
        data: this.toBase64(audioData),
      },
    }
    this.webSocket.send(JSON.stringify(params))
    this.handlerInterval = setInterval(() => {
      // websocket未连接
      if (this.webSocket.readyState !== 1) {
        this.audioData = []
        clearInterval(this.handlerInterval)
        return
      }
      // 最后一帧
      if (this.audioData.length === 0) {
        if (this.status === 'end') {
          this.webSocket.send(
            JSON.stringify({
              business: {
                cmd: 'auw',
                aus: 4,
                aue: 'raw'
              },
              data: {
                status: 2,
                encoding: 'raw',
                data_type: 1,
                data: '',
              },
            })
          )
          this.audioData = []
          clearInterval(this.handlerInterval)
        }
        return false
      }
      audioData = this.audioData.splice(0, 1280)
      // 中间帧
      this.webSocket.send(
        JSON.stringify({
          business: {
            cmd: 'auw',
            aus: 2,
            aue: 'raw'
          },
          data: {
            status: 1,
            encoding: 'raw',
            data_type: 1,
            data: this.toBase64(audioData),
          },
        })
      )
    }, 40)
  }
  result(resultData) {
    // 识别结束
    let jsonData = JSON.parse(resultData)
    //console.log("3333", jsonData)
    if (jsonData.data && jsonData.data.data) {
      let data = Base64.decode(jsonData.data.data)
      let grade = parser.parse(data, {
        attributeNamePrefix: '',
        ignoreAttributes: false
      })
      this.setResultText(grade)
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.webSocket.close()
    }
    if (jsonData.code !== 0) {
      this.webSocket.close()
      alert("识别异常，请重新开始");
      console.log(`${jsonData.code}:${jsonData.message}`)
    }
  }
  start() {
    this.recorderStart()
    this.setResultText()
  }
  stop() {
    this.recorderStop()
  }

  //合并压缩
   compress() {
                  //合并
                  var data = new Float32Array(this.audioData_ly.size);
                  var offset = 0;
                  for (var i = 0; i < this.audioData_ly.buffer.length; i++) {
                      data.set(this.audioData_ly.buffer[i], offset);
                      offset += this.audioData_ly.buffer[i].length;
                  }
                  //压缩
                  var compression = parseInt(this.audioData_ly.inputSampleRate / this.audioData_ly.outputSampleRate);
                  var length = data.length / compression;
                  var result = new Float32Array(length);
                  var index = 0, j = 0;
                  while (index < length) {
                      result[index] = data[j];
                      j += compression;
                      index++;
                  }
                  return result;
  }

  encodeWAV() {
                  var sampleRate = Math.min(this.audioData_ly.inputSampleRate, this.audioData_ly.outputSampleRate);
                  var sampleBits = Math.min(this.audioData_ly.inputSampleBits, this.audioData_ly.oututSampleBits);
                  var bytes = this.compress();
                  var dataLength = bytes.length * (sampleBits / 8);
                  var buffer = new ArrayBuffer(44 + dataLength);
                  var data = new DataView(buffer);

                  var channelCount = 1;//单声道
                  var offset = 0;

                  var writeString = function (str) {
                      for (var i = 0; i < str.length; i++) {
                          data.setUint8(offset + i, str.charCodeAt(i));
                      }
                  }

                  // 资源交换文件标识符
                  writeString('RIFF'); offset += 4;
                  // 下个地址开始到文件尾总字节数,即文件大小-8
                  data.setUint32(offset, 36 + dataLength, true); offset += 4;
                  // WAV文件标志
                  writeString('WAVE'); offset += 4;
                  // 波形格式标志
                  writeString('fmt '); offset += 4;
                  // 过滤字节,一般为 0x10 = 16
                  data.setUint32(offset, 16, true); offset += 4;
                  // 格式类别 (PCM形式采样数据)
                  data.setUint16(offset, 1, true); offset += 2;
                  // 通道数
                  data.setUint16(offset, channelCount, true); offset += 2;
                  // 采样率,每秒样本数,表示每个通道的播放速度
                  data.setUint32(offset, sampleRate, true); offset += 4;
                  // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
                  data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
                  // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
                  data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
                  // 每样本数据位数
                  data.setUint16(offset, sampleBits, true); offset += 2;
                  // 数据标识符
                  writeString('data'); offset += 4;
                  // 采样数据总数,即数据总大小-44
                  data.setUint32(offset, dataLength, true); offset += 4;
                  // 写入采样数据
                  if (sampleBits === 8) {
                      for (var i = 0; i < bytes.length; i++, offset++) {
                          var s = Math.max(-1, Math.min(1, bytes[i]));
                          var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                          val = parseInt(255 / (65535 / (val + 32768)));
                          data.setInt8(offset, val, true);
                      }
                  } else {
                      for (var i = 0; i < bytes.length; i++, offset += 2) {
                          var s = Math.max(-1, Math.min(1, bytes[i]));
                          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                      }
                  }

                  return new Blob([data]);

  }

  play_blob_url() {
    // let downRec = document.getElementById("downloadRec");
    // downRec.href = window.URL.createObjectURL(this.encodeWAV());
    // downRec.download = new Date().toLocaleString() + '.mp3';
    return window.URL.createObjectURL(this.encodeWAV());
  }
}


  export default IseRecorder;
