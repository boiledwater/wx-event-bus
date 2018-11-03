  (function() {
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
              WX_EventBus.registerPage(this);
              try {
                if (typeof(this.registerEvent) == 'function') {
                  var _register_event = this.registerEvent();
                  WX_EventBus.registerEvent(this, _register_event);
                }
              } catch (e) {
                console.error(e);
              }
              _onload.apply(this, arguments);
            };
          })(obj.onLoad);
          obj.onUnload = (function(_onUnload) {
            return function() {
              WX_EventBus.unRegister(this);
              _onUnload.apply(this, arguments);
            };
          })(obj.onUnload);
        }
        page.apply(page, arguments);
      }
    })(Page);
  })();

  (function() {
    Component = (function(_component) {
      return function() {
        var need_register = arguments.length > 0;
        if (need_register) {
          need_register = arguments[0].methods && typeof(arguments[0].methods.registerEvent) == 'function';
        }
        if (need_register) {
          var _life_times = arguments[0].lifetimes;
          var _attached = null;
          var _detached = null;
          if (_life_times) {
            _attached = _life_times.attached;
            _detached = _life_times.detached;
          }
          if (!_attached) {
            _attached = arguments[0].attached;
          }
          if (!_attached) {
            _attached = function() {};
          }

          if (!_detached) {
            _detached = arguments[0].detached;
          }
          if (!_detached) {
            _detached = function() {};
          }
          if (!_life_times) {
            arguments[0].lifetimes = {};
          }

          arguments[0].lifetimes.attached = (function(_attached) {
            return function() {
              WX_EventBus.registerComponent(this);
              _attached.apply(this, arguments);
              try {
                var _register_event = this.registerEvent();
                WX_EventBus.registerEvent(this, _register_event);
              } catch (e) {
                console.error(e);
              }
            }
          })(_attached, arguments[0]);

          arguments[0].lifetimes.detached = (function(_detached) {
            return function() {
              WX_EventBus.unRegister(this);
              _detached.apply(this, arguments);
            }
          })(_detached);
        }
        _component.apply(_component, arguments);
      };
    })(Component);
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
      this.register({
        name: 'app',
        type: 'page',
        source: _app_this
      });
    },
    registerPage: function(_page_this) {
      this.register({
        name: _page_this.route,
        type: 'page',
        source: _page_this
      });
    },
    registerComponent: function(_component_this) {
      this.register({
        name: _component_this.name ? _component_this.name : 'component',
        type: 'component',
        source: _component_this
      });
    },
    register: function(obj) {
      console.log('registerPage:' + JSON.stringify(obj));
      getApp().__event_bus.push({
        name: obj.name,
        type: obj.type,
        source: obj.source
      });
    },
    unRegister: function(_this) {
      var _event_bus = getApp().__event_bus;
      for (var i = _event_bus.length - 1; i > -1; i--) {
        if (_event_bus[i].source == _this) {
          console.log('unRegisterPage:' + _this);
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
    postEvent: function(_event_obj, _name) {
      console.log('post event:' + JSON.stringify(_event_obj));
      if (Array.isArray(_event_obj)) {
        for (var i = 0, length = _event_obj.length; i < length; i++) {
          this._postEvent(_event_obj[i], _name)
        }
      } else {
        this._postEvent(_event_obj, _name)
      }
    },
    _postEvent: function (_event_obj, _name) {
      var _event_bus = getApp().__event_bus;
      for (var i = _event_bus.length - 1; i > -1; i--) {
        var _source = _event_bus[i].source;
        var __bus_event = _source.__bus_event;
        if (!__bus_event) {
          continue;
        }
        var _event_function = __bus_event[_event_obj.name];
        if (typeof _event_function != 'function') {
          continue;
        }

        if (_name && _source.name != _name) {
          continue;
        }
        var _asyn_function = (function (_source, _event_function, _event_data) {
          return function() {
            _event_function.call(_source, _event_data);
          }
        })(_source, _event_function, _event_obj.data);
        getApp().asyncFunction(_asyn_function, (function (_source, _event_obj) {
          return function() {
            console.log(_source.name + ':invoke event success;' + JSON.stringify(_event_obj));
          };
        })(_source, _event_obj));
      }
    },
    /**
     * {'event_name':function(){}}
     */
    registerEvent: function(_this, _event) {
      _this.__bus_event = _event;
    }
  }
  module.exports = {
    WX_EventBus: WX_EventBus
  }