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
      wx.showToast({
        title: 'find success',
        complete: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        }
      });
    });
  },
  noFindPageEvent: function() {
    getApp().getWXEventBus().find('pages/page1/index2', {
      success: function() {
        wx.showToast({
          title: 'found',
        })
      },
      fail: function() {
        wx.showToast({
          title: 'No found',
        })
      }
    });
  }
})