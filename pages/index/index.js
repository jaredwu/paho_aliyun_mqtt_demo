//index.js
//获取应用实例
var app = getApp()

var Paho = require('../../utils/paho-mqtt.js')
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

    // var topic = 'LEMONHALL_TEST';//MQTT topic
    // var accessKey = "LTAIjhtH2OmNPgen";
    // var username = accessKey;
    // var secretKey = "xxxxxxxxxxxxxxxxxxx";
    // var groupid = 'GID_LemonGroup';
    // var host = 'mqtt.lemonhall.com';
    // var port = 80;

    var topic = 'LEMONHALL_TEST';//MQTT topic
    var accessKey = "LTAIjhtH2OmNPgen";
    var username = accessKey;
    var secretKey = "5euxRgpGLlrAet1lGihkG2vyFb1cZA";
    var groupid = 'GID_LemonGroup';
    var host = 'post-cn-0pp093hfs0a.mqtt.aliyuncs.com';
    var port = 80;

    var clientId = groupid + '@@@' + 'PID-HAC-ADD_EVENT';

    var password = Crypto.util.bytesToBase64(Crypto.HMAC(Crypto.SHA1, groupid, secretKey, { asBytes: true }));

    var client = new Paho.Client(host,port, clientId);

    client.connect({
      useSSL: true,
      userName : username,
      password : password,
      cleanSession: true,
      keepAliveInterval: 60,
      onSuccess: function () {
        console.log('connected');
        that.globalData.client = client

        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })

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
      },
      onFailure: function (res) {
        wx.showToast({
          title: res.errorCode + " | " + res.errorMessage,
          icon: 'success',
          duration: 200000
        })
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
