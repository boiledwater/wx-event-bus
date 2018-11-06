//logs.js
const util = require('../../utils/util.js')

Page({
  data: {

  },
  onLoad: function() {

  },
  postComponetEvent: function() {
    getApp().getWXEventBus().postEvent({
      name: 'component_event_test',
      data: 'page2'
    });
    wx.navigateBack({
      delta: 1
    });
  },
  postPageEvent: function() {
    getApp().getWXEventBus().postEvent([{
      name: 'page_event_test',
      data: 'page2'
    }]);
    wx.navigateBack({
      delta: 1
    });
  },
  findPageEvent: function() {
    getApp().getWXEventBus().find('pages/page1/index', function() {
      this.setData({
        text: 'find function'
      });
    });
    wx.navigateBack({
      delta: 1
    });
  }
})