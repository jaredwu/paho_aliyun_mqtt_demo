//index.js
//获取应用实例
var app = getApp()

var Paho = require('../../utils/paho-mqtt-min.js')
var Crypto = require('../../utils/cryptojs/cryptojs.js').Crypto;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    //===============
    //================

    // var topic = 'HAC-ADD_EVENT';//MQTT topic
    // var tag = 'HAC-ADD_EVENT';//MQTT tag
    // var accessKey = 'LTAICHZNM08qwsF1';//MQTT accessKey
    // var username = accessKey;
    // var secretKey = 'GcGKhlT34MsMD1FkbVlP8EtXDbi7mL';//MQTT  secretKey
    // var groupid = 'GID-HAC-ADD_EVENT';
    // var host = 'post-cn-45908degu01.mqtt.aliyuncs.com';
    // var port = 80;
    // var clientId = groupid + '@@@' + 'PID-HAC-ADD_EVENT';

    var topic = 'HHHHHH_TEST';//MQTT topic
    var accessKey = "xxxxxxxxxxxx";
    var username = accessKey;
    var secretKey = "xxxxxxxxxxxxxxxxxxx";
    var groupid = 'GID-HAC-ADD_EVENT111';
    var host = 'xxxxxxxxxxx.mqtt.aliyuncs.com';
    var port = 80;
    var clientId = groupid + '@@@' + 'PID-HAC-ADD_EVENT';

    var password = Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, groupid, secretKey, { asBytes: true }));

    var client = new Paho.Client(host,port, clientId);

    client.connect({
      useSSL: false,
      userName : username,
      password : password,
      cleanSession: true,
      keepAliveInterval: 60,
      onSuccess: function () {
        console.log('connected');
        that.globalData.client = client

        client.onMessageArrived = function (msg) {
          if (typeof that.globalData.onMessageArrived === 'function') {
            return that.globalData.onMessageArrived(msg)
          }

          wx.showModal({
            title: msg.destinationName,
            content: msg.payloadString
          })
        }

        client.onConnectionLost = function (responseObject) {
          if (typeof that.globalData.onConnectionLost === 'function') {
            return that.globalData.onConnectionLost(responseObject)
          }
          if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
          }
        }
      }
    });
    setTimeout(function(){

      var message = new Paho.Message("Hello World");
      var qos = 0;
      var retained = false;
      message.destinationName = topic;
      message.qos = qos;
      message.retained = retained;

      client.send(message);
      console.log("I send a message");
    },5000)
  },
  globalData: {
    userInfo: null,
    client: null,
    onMessageArrived: null
  }
})
