主要是用于小程序组件间通信；包括:page之间通信,component之间通信,page与component之间通信;
<pre><code>  
使用场景：
B页面跳转到A界面；在A页面执行了某个操作后，B界面要有相应的变化；
此时，你需要在B界面注册相关事件，在A界面发布相应事件；
</code></pre>
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
    //setDebug(true)输出相关日志;默认为false;
    WX_EventBus.setDebug(true).init(this);//初始化event bus
  },
  globalData: {

  }
})
</code></pre>
## 注册事件
支持App,Page,Component注册事件；
### 一、App注册事件
在app里重写registerEvent方法:
<pre><code>
registerEvent: function() {
    return {
      refreshData: function(v) {
        this.setData(v);//this为当前app对象
      }
    }
  }
</code></pre>
以上就在App对象里注册了refreshData事件;当收到相应事件的时候，就调用相应的方法；
### 二、Page注册事件
在page里重写registerEvent方法:
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

### 三、Component注册事件
在component methods里重写registerEvent方法,类似page里注册事件.
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
或者如下发布多个事件。
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
## find方法;
1)方式1
<pre><code>
getApp().getWXEventBus().find(['pages/page1/index'], {
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
</code></pre>
如果找到"pages/page1/index" page的话，就执行success方法,否则执行fail方法；
<br/>
1)方式2
<pre><code>
getApp().getWXEventBus().find(['pages/page1/index'],function() {
        wx.showToast({
          title: 'found',
        })
      });
</code></pre>
如果找到"pages/page1/index" page的话，就执行相应方法;
