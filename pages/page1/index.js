//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '点我',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    text: '？'
  },
  //事件处理函数
  toPage2: function() {
    wx.navigateTo({
      url: '/pages/page2/index'
    })
  },
  postComponetEvent: function() {
    getApp().getWXEventBus().postEvent({
      name: 'component_event_test',
      data: 'page1'
    });
  },
  postPageEvent: function() {
    getApp().getWXEventBus().postEvent([{
      name: 'page_event_test',
      data: 'page1'
    }]);
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  registerEvent: function() {
    return {
      page_event_test: function() {
        this.setData({
          text: arguments[0]
        });
        console.log('this is test event:' + JSON.stringify(arguments));
      }
    };

  }
})