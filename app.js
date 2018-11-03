import {
  WX_EventBus
} from './utils/wx-event-bus.js'

App({
  onLaunch: function() {
    WX_EventBus.init(this);
  },
  globalData: {

  }
})