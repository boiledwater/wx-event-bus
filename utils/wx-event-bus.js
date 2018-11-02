(function() {
  let __page = Page;
  Page = (function(page) {
    return function() {
      if (arguments.length > 0) {
        let obj = arguments[0];
        ['onLoad', 'onUnload'].forEach(function(item) {
          if (!obj[item]) {
            obj[item] = function() {};
          }
        });
        obj.onLoad = (function(_onload) {
          return function() {
            console.log('--onload--');
            console.log(this);
            WX_EventBus.registerPage(this);
            _onload.apply(this, arguments);
          };
        })(obj.onLoad);
        obj.onUnload = (function(_onUnload) {
          return function() {
            console.log('--onUnload--');
            console.log(this);
            WX_EventBus.unRegisterPage(this);
            _onUnload.apply(this, arguments);
          };
        })(obj.onUnload);
        console.log('----------');
        console.log(obj);
      }
      page.apply(page, arguments);
    }
  })(__page);
})();
var WX_EventBus = {
  init: function(_app) {
    _app.__event_bus = [];
    _app._wx_event_bus = this;
    _app.getWXEventBus = function() {
      return getApp()._wx_event_bus;
    }
    _app.asyncFunction = function(nest_function, callback) {
      this.__set_time_out_id = setTimeout(function() {
        var result = nest_function();
        if (callback) {
          callback(result);
        }
      }, 0);
    };
  },
  registerApp: function(_app_this) {
    console.log('registerApp:');
    _app_this.__event_bus.push({
      'route': 'App',
      'page': _app_this
    });
  },
  registerPage: function(_page_this) {
    console.log('registerPage:' + _page_this.route);
    getApp().__event_bus.push({
      'route': _page_this.route,
      'page': _page_this
    });
  },
  unRegisterPage: function(_page_this) {
    var _event_bus = getApp().__event_bus;
    for (var i = _event_bus.length - 1; i > -1; i--) {
      if (_event_bus[i].page == _page_this) {
        console.log('unRegisterPage:' + _page_this.route);
        _event_bus.splice(i, 1);
        break;
      }
    }
  },
  /**
   * 同步执行
   */
  postRoute: function(_route, _call_back) {
    console.log('post route:' + _route);
    if (Array.isArray(_route)) {
      for (var i = 0, length = _route.length; i < length; i++) {
        this._postRoute(_route[i], _call_back)
      }
    } else {
      this._postRoute(_route, _call_back)
    }
  },
  _postRoute: function(_route, _call_back) {
    var _event_bus = getApp().__event_bus;
    for (var i = _event_bus.length - 1; i > -1; i--) {
      var _page = _event_bus[i].page;
      if (_route && _page.route == _route) {
        _call_back.apply(_page, arguments);
      }
    }
  },
  /**
   * [{name:'',data:''}]
   */
  postEvent: function(_event_obj, _route) {
    console.log('post event:' + JSON.stringify(_event_obj));
    if (Array.isArray(_event_obj)) {
      for (var i = 0, length = _event_obj.length; i < length; i++) {
        this._postEvent(_event_obj[i], _route)
      }
    } else {
      this._postEvent(_event_obj, _route)
    }
  },
  _postEvent: function(_event_obj, _route) {
    var _event_bus = getApp().__event_bus;
    for (var i = _event_bus.length - 1; i > -1; i--) {
      var _page = _event_bus[i].page;
      var _page_event = _page._event;
      if (!_page_event) {
        continue;
      }
      var _event_function = _page_event[_event_obj.name];
      if (typeof _event_function != 'function') {
        continue;
      }

      if (_route && _page.route != _route) {
        continue;
      }
      var _asyn_function = (function(_page, _event_function, _event_data) {
        return function() {
          _event_function.call(_page, _event_data);
        }
      })(_page, _event_function, _event_obj.data);
      getApp().asyncFunction(_asyn_function, (function(_page, _event_obj) {
        return function() {
          console.log(_page.route + ':invoke event success;' + JSON.stringify(_event_obj));
        };
      })(_page, _event_obj));
    }
  },
  /**
   * {'event_name':function(){}}
   */
  registerEvent: function(_page, _event) {
    _page._event = _event;
  }
}
module.exports = {
  WX_EventBus: WX_EventBus
}