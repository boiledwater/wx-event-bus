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

  },
  lifetimes: {
    attached: function() {
      console.log('-------attached1--------');
      console.log(arguments);
      console.log(this);
    },
    detached: function() {
      console.log('-------detached1--------');
      console.log(arguments);
      console.log(this);
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    registerEvent: function () {
      return {
        component_test: function () {
          console.log('this is component test event:' + JSON.stringify(arguments));
        }
      };
    }
  }
})