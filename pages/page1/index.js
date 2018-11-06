//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '点我',    
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