主要是用于小程序组件间通信；包括:page之间通信,component之间通信,page与component之间通信;
实现思路来源于android开发常用的event bus第三方工具包;
## 如何引用event bus
   #### 1)把wx-event-bus.js拷贝到相应utils目录
   #### 2)App.js里引用并初始化
<pre><code>   
import {
  WX_EventBus
} from './utils/wx-event-bus.js'

App({
  onLaunch: function() {
    WX_EventBus.init(this);//初始化event bus
  },
  globalData: {

  }
})
</code></pre>
## 注册事件
### 一、Page注册事件
再page里重写registerEvent方法:
<pre><code>
registerEvent: function() {
    return {
      refreshData: function(v) {
        this.setData(v);//this为当前page对象
      }
    }
  }
</code></pre>
以上就在page对象里注册了refreshData事件;当收到相应事件的时候，就调用相应的方法；

### 二、Component注册事件
再component methods里重写registerEvent方法,类似page里注册事件.
<pre><code>
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
  </code></pre>
 ## 发布事件;
 支持一次发布多个事件；
 
<pre><code>
 getApp().getWXEventBus().postEvent({
          name: 'refreshData',
          data:{
             text:'hello world'
          }//该数据将作为参数传递给该注册事件的回调方法;
        });
</code></pre>
 <pre><code>
 getApp().getWXEventBus().postEvent([{
          name: 'refreshData',
          data:{
             text:'hello world'
          }//该数据将作为参数传递给该注册事件的回调方法;
        },
        {name:'getData',}
        ]);
</code></pre>
