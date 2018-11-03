// components/demo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '？'
  },
  lifetimes: {
    attached: function() {

    },
    detached: function() {

    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    registerEvent: function() {
      return {
        component_event_test: function() {
          this.setData({
            text: arguments[0]
          });
          console.log('this is component event:' + JSON.stringify(arguments));
        }
      };
    }
  }
})