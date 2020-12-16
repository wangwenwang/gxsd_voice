
const APPID = '5f9a1b08'
const API_SECRET = '6680a66e29cc20bc480deab66f56e404'
const API_KEY = '031f20bdd09b70e5aec167575bf108fb'
import CryptoJS from 'crypto-js'
import Worker from './transcode.worker.js'
const transWorker = new Worker()
console.log(transWorker)
var startTime = ""
var endTime = ""

function getWebSocketUrl(){
  return new Promise((resolve, reject) => {
 // �����ַ�������ֲ�ͬ�仯
 var url = 'wss://iat-api.xfyun.cn/v2/iat'
 var host = 'iat-api.xfyun.cn'
 var apiKey = API_KEY
 var apiSecret = API_SECRET
 var date = new Date().toGMTString()
 var algorithm = 'hmac-sha256'
 var headers = 'host date request-line'
 var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
 var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
 var signature = CryptoJS.enc.Base64.stringify(signatureSha)
 var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
 var authorization = btoa(authorizationOrigin)
 url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
 resolve(url)
 })
}
const IatRecorder = class  {
    constructor({ language, accent, appId } = {}) {
      let self = this
      this.status = 'null'
      this.language = language || 'zh_cn'
      this.accent = accent || 'mandarin'
      this.appId = appId || APPID
      // ��¼��Ƶ����
      this.audioData = []
      // ��¼��д���
      this.resultText = ''
      // wpgs�µ���д�����Ҫ�м�״̬������¼
      this.resultTextTemp = ''
      transWorker.onmessage = function (event) {
        // console.log("���췽����",self.audioData)
        self.audioData.push(...event.data)
      }
    }

    // �޸�¼����д״̬
    setStatus(status) {
      this.onWillStatusChange && this.status !== status && this.onWillStatusChange(this.status, status)
      this.status = status
    }
    setResultText({ resultText, resultTextTemp } = {}) {
      this.onTextChange && this.onTextChange(resultTextTemp || resultText || '')
      resultText !== undefined && (this.resultText = resultText)
      resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp)
    }
    // �޸���д����
    setParams({ language, accent } = {}) {
      language && (this.language = language)
      accent && (this.accent = accent)
    }
    // ����websocket
    connectWebSocket() {
      return getWebSocketUrl().then(url => {
        let iatWS
        if ('WebSocket' in window) {
          iatWS = new WebSocket(url)
        } else if ('MozWebSocket' in window) {
          iatWS = new MozWebSocket(url)
        } else {
          alert('�������֧��WebSocket')
          return
        }
        this.webSocket = iatWS
        this.setStatus('init')
        iatWS.onopen = e => {
          this.setStatus('ing')
          // ���¿�ʼ¼��
          setTimeout(() => {
            this.webSocketSend()
          }, 500)
        }
        iatWS.onmessage = e => {
          this.result(e.data)
        }
        iatWS.onerror = e => {
          this.recorderStop()
        }
        iatWS.onclose = e => {
          endTime = Date.parse(new Date())
          console.log("����ʱ��",endTime-startTime)
          this.recorderStop()
        }
      })
    }
    // ��ʼ�������¼��
    recorderInit() {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

      // ������Ƶ����
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.audioContext.resume()
        if (!this.audioContext) {
          alert('�������֧��webAudioApi��ؽӿ�')
          return
        }
      } catch (e) {
        if (!this.audioContext) {
          alert('�������֧��webAudioApi��ؽӿ�')
          return
        }
      }

      // ��ȡ�����¼��Ȩ��
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
          alert('chrome�»�ȡ�����¼�����ܣ���Ϊ��ȫ�����⣬��Ҫ��localhost��127.0.0.1��https�²��ܻ�ȡȨ��')
        } else {
          alert('�޷���ȡ�����¼�����ܣ��������������ʹ��chrome')
        }
        this.audioContext && this.audioContext.close()
        return
      }
      // ��ȡ�����¼��Ȩ�޳ɹ��Ļص�
      let getMediaSuccess = stream => {
        // ����һ������ͨ��JavaScriptֱ�Ӵ�����Ƶ
        this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1)
        this.scriptProcessor.onaudioprocess = e => {
          // ȥ������Ƶ����
           if (this.status === 'ing') {
             transWorker.postMessage(e.inputBuffer.getChannelData(0))
            //  this.audioData.push(e.inputBuffer.getChannelData(0))
           }
        }
        // ����һ���µ�MediaStreamAudioSourceNode ����ʹ����MediaStream����Ƶ���Ա����źͲ���
        this.mediaSource = this.audioContext.createMediaStreamSource(stream)
        // ����
        this.mediaSource.connect(this.scriptProcessor)
        this.scriptProcessor.connect(this.audioContext.destination)
        this.connectWebSocket()
      }

      let getMediaFail = (e) => {
        this.audioContext && this.audioContext.close()
        this.audioContext = undefined
        // �ر�websocket
        if (this.webSocket && this.webSocket.readyState === 1) {
          this.webSocket.close()
        }
      }
    }
    recorderStart() {
      if (!this.audioContext) {
        this.recorderInit()
      } else {
        this.audioContext.resume()
        this.connectWebSocket()
      }
    }
    // ��ͣ¼��
    recorderStop() {
      // safari��suspend���ٴ�resume¼�����ݽ��ǿհף�����safari�²���suspend
      if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgen))){
        this.audioContext && this.audioContext.suspend()
      }
      this.setStatus('end')
    }
    // ������Ƶ����
    // transAudioData(audioData) {
    //   audioData = transAudioData.transaction(audioData)
    //   this.audioData.push(...audioData)
    // }
    // �Դ�������Ƶ���ݽ���base64���룬
    toBase64(buffer) {
      var binary = ''
      var bytes = new Uint8Array(buffer)
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    }
    // ��webSocket��������
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
          language: this.language, //С���ֿ��ڿ���̨--������д����ʽ��--����/���ִ��������
          domain: 'iat',
          accent: this.accent, //���ķ��Կ��ڿ���̨--������д����ʽ��--����/���ִ��������
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: this.toBase64(audioData),
        },
      }
      console.log("����language��",this.language)
      console.log("����accent��",this.accent)
      this.webSocket.send(JSON.stringify(params))
      startTime = Date.parse(new Date())
      this.handlerInterval = setInterval(() => {
        // websocketδ����
        if (this.webSocket.readyState !== 1) {
          console.log("websocketδ����")
          this.audioData = []
          clearInterval(this.handlerInterval)
          return
        }
        if (this.audioData.length === 0) {
          console.log("�Զ��ر�",this.status)
          if (this.status === 'end') {
            this.webSocket.send(
              JSON.stringify({
                data: {
                  status: 2,
                  format: 'audio/L16;rate=16000',
                  encoding: 'raw',
                  audio: '',
                },
              })
            )
            this.audioData = []
            clearInterval(this.handlerInterval)
          }
          return false
        }
        audioData = this.audioData.splice(0, 1280)
        // �м�֡
        this.webSocket.send(
          JSON.stringify({
            data: {
              status: 1,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: this.toBase64(audioData),
            },
          })
        )
      }, 40)
    }
    result(resultData) {
      // ʶ�����
      let jsonData = JSON.parse(resultData)

      if (jsonData.data && jsonData.data.result) {
        let data = jsonData.data.result
        let str = ''
        let resultStr = ''
        let ws = data.ws
        for (let i = 0; i < ws.length; i++) {
          str = str + ws[i].cw[0].w
        }
        //console.log("shi bei jie guo",str)
        // ����wpgs���д��ֶ�(ǰ�᣺�ڿ���̨��ͨ��̬��������)
        // ȡֵΪ "apd"ʱ��ʾ��Ƭ�����׷�ӵ�ǰ������ս����ȡֵΪ"rpl" ʱ��ʾ�滻ǰ��Ĳ��ֽ�����滻��ΧΪrg�ֶ�
        if (data.pgs) {
          if (data.pgs === 'apd') {
            // ��resultTextTempͬ����resultText
            this.setResultText({
              resultText: this.resultTextTemp,
            })
          }
          // ������洢��resultTextTemp��
          this.setResultText({
            resultTextTemp: this.resultText + str,
          })
        } else {
          this.setResultText({
            resultText: this.resultText + str,
          })
        }
      }
      if (jsonData.code === 0 && jsonData.data.status === 2) {
        this.webSocket.close()
      }
      if (jsonData.code !== 0) {
        this.webSocket.close()
        console.log(`${jsonData.code}:${jsonData.message}`)
      }
    }
    start() {
      this.recorderStart()
      this.setResultText({ resultText: '', resultTextTemp: '' })
    }
    stop() {
      this.recorderStop()
    }
  }

  export default IatRecorder;
