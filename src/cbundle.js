(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require("events");

var _require = require("jssip/lib/Constants"),
    MESSAGE = _require.MESSAGE;

var Message = /*#__PURE__*/_createClass(function Message(to, from, type, object) {
  _classCallCheck(this, Message);

  this.to = to;
  this.from = from;
  this.type = type;
  this.object = object;
});

var CallerPackage = /*#__PURE__*/function () {
  function CallerPackage() {
    var _this = this;

    _classCallCheck(this, CallerPackage);

    this.callActive = false;
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");

    this.channel.onmessage = function (messageEvent) {
      _this.receiveEngine(messageEvent.data);
    };

    this.callObject = {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false
    };
  }

  _createClass(CallerPackage, [{
    key: "resetCallObject",
    value: function resetCallObject() {
      this.callObject = {
        sender: "",
        receiver: "",
        startTime: "",
        endTime: "",
        hold: false,
        mute: false
      };
    }
  }, {
    key: "getCallObject",
    value: function getCallObject() {
      return this.callObject;
    }
  }, {
    key: "receiveEngine",
    value: function receiveEngine(message) {
      if (message.to == "PARENT") {
        console.log(message);

        if (message.type == "INFORM_SOCKET_CONNECTED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_OUTGOING_CALL_START") {
          this.callObject.startTime = message.object.startTime;
          this.callObject.sender = message.object.sender;
          this.callObject.receiver = message.object.receiver;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_OUTGOING_CALL_END") {
          this.callObject.hold = false;
          this.callObject.mute = false;
          this.callObject.endTime = message.object.endTime;
          this.callActive = false;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_OUTGOING_CALL_FAIL") {
          this.callObject.hold = false;
          this.callObject.mute = false;
          this.callObject.startTime = '-|-';
          this.callObject.endTime = '-|-';
          this.callActive = false;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_HOLD") {
          this.callObject.hold = true;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_UNHOLD") {
          this.callObject.hold = false;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_MUTE") {
          this.callObject.mute = true;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_UNMUTE") {
          this.callObject.mute = false;
          this.eventEmitter.emit(message.type);
        } else if (message.type == "POPUP_CLOSED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "PING_SESSION_DETAILS") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "PING_POPUP_ALIVE") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_SESSION_DETAILS") {
          this.callObject = message.object;

          if (this.callObject.startTime == "") {
            this.callActive = 0;
          } else if (this.callObject.endTime == "") {
            this.callActive = 1;
          }

          this.eventEmitter.emit(message.type);
        } else {
          console.log("UNKNOWN TYPE: ", message);
          this.eventEmitter.emit(message.type);
        }
      }
    }
  }, {
    key: "sendEngine",
    value: function sendEngine(message) {
      console.log("Sending : " + message.type);

      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        if (this.callActive == true) {
          console.log('Call Already Active');
        } else {
          this.callActive = true;
          this.postHandler(message);
        }
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_CALL_HOLD") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_CALL_UNHOLD") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_CALL_MUTE") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_CALL_UNMUTE") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_SESSION_DETAILS") {
        this.postHandler(message);
      }
    }
  }, {
    key: "postHandler",
    value: function postHandler(message) {
      this.channel.postMessage(message);
    }
  }, {
    key: "connectToServer",
    value: function connectToServer(callback) {
      if (localStorage.getItem("is_popup_active") === null) {
        window.open("./CallerPackage/popup.html", "connection", "left=0, top=0, width=200, height=200");
      } else {
        console.log('Session details request');
        this.sendEngine(new Message("WRAPPER", "PARENT", "REQUEST_SESSION_DETAILS", {}));
      }

      callback();
    }
  }, {
    key: "call",
    value: function call(receiver) {
      this.resetCallObject();
      this.callObject.receiver = receiver;
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_OUTGOING_CALL_START", this.callObject));
    }
  }, {
    key: "endOut",
    value: function endOut() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_OUTGOING_CALL_END", {}));
    }
  }, {
    key: "endIn",
    value: function endIn() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_INCOMING_CALL_END", {}));
    }
  }, {
    key: "hold",
    value: function hold() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_HOLD", {}));
    }
  }, {
    key: "unhold",
    value: function unhold() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_UNHOLD", {}));
    }
  }, {
    key: "mute",
    value: function mute() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_MUTE", {}));
    }
  }, {
    key: "unmute",
    value: function unmute() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_UNMUTE", {}));
    }
  }, {
    key: "accept",
    value: function accept() {
      this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_INCOMING_CALL_START", {}));
    }
  }, {
    key: "ping",
    value: function ping() {// setInterval(() => {
      //   this.sendEngine(new Message('POPUP','PARENT',"REQUEST_SESSION_DETAILS",this.callObject));
      // }, 1000);
    }
  }]);

  return CallerPackage;
}();

module.exports = {
  CallerPackage: CallerPackage
};

},{"events":3,"jssip/lib/Constants":4}],2:[function(require,module,exports){
"use strict";

var _require = require("./CallerPackage/client/client.js"),
    CallerPackage = _require.CallerPackage;

var callerPackage = new CallerPackage();
var mute = "Mute State : Unmute";
var hold = "Hold State : Unhold";
var socket = "Socket : Disconnected";
var callActive = "CallActve : Inative";
var callObject = {
  sender: "",
  receiver: "",
  startTime: "",
  endTime: "",
  hold: false,
  mute: false
};
document.getElementById("socket-info").innerText = socket;
document.getElementById("mute-info").innerText = hold;
document.getElementById("hold-info").innerText = mute;
displayCallObject();
var connect_button = document.getElementById("connect");
var call_button = document.getElementById("call");
var hangup_button = document.getElementById("hangup");
var mute_button = document.getElementById("mute");
var unmute_button = document.getElementById("unmute");
var hold_button = document.getElementById("hold");
var unhold_button = document.getElementById("unhold");

var toggleButtonState = function toggleButtonState(value) {
  call_button.disabled = !value;
  hangup_button.disabled = !value;
  mute_button.disabled = !value;
  unmute_button.disabled = !value;
  hold_button.disabled = !value;
  unhold_button.disabled = !value;
};

connect_button.addEventListener("click", function () {
  callerPackage.connectToServer(function () {
    toggleButtonState(true);
  });
});
call_button.addEventListener("click", function () {
  //resetState();
  callerPackage.call(document.getElementById('phone-number').value);
});
hangup_button.addEventListener("click", function () {
  callerPackage.endOut();
});
hold_button.addEventListener("click", function () {
  callerPackage.hold();
});
unhold_button.addEventListener("click", function () {
  callerPackage.unhold();
});
mute_button.addEventListener("click", function () {
  callerPackage.mute();
});
unmute_button.addEventListener("click", function () {
  callerPackage.unmute();
});
callerPackage.eventEmitter.on("INFORM_SOCKET_CONNECTED", function () {
  socket = "Socket : Connected";
  document.getElementById("socket-info").innerText = socket;
});
callerPackage.eventEmitter.on("INFORM_SOCKET_DISCONNECTED", function () {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});
callerPackage.eventEmitter.on("ACK_OUTGOING_CALL_START", function () {
  resetState();
  callActive = "CallActive : Active";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("call-active-info").innerText = callActive;
});
callerPackage.eventEmitter.on("ACK_OUTGOING_CALL_END", function () {
  resetState();
  callActive = "CallActive : Inactive";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
});
callerPackage.eventEmitter.on("ACK_OUTGOING_CALL_FAIL", function () {
  resetState();
  callActive = "CallActive : FAIL";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
});
callerPackage.eventEmitter.on("ACK_CALL_HOLD", function () {
  hold = "Hold State : Hold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
});
callerPackage.eventEmitter.on("ACK_CALL_UNHOLD", function () {
  hold = "Hold State : Unhold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
});
callerPackage.eventEmitter.on("ACK_CALL_MUTE", function () {
  mute = "Mute State : Mute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
});
callerPackage.eventEmitter.on("ACK_CALL_UNMUTE", function () {
  mute = "Mute State : Unmute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
});
callerPackage.eventEmitter.on("ACK_SESSION_DETAILS", function () {
  console.log('Caught session details');
  callObject = callerPackage.getCallObject();
  displayCallObject();

  if (callObject.mute == true) {
    mute = "Mute State : Mute";
    document.getElementById("mute-info").innerText = mute;
  }

  if (callObject.hold == true) {
    hold = "Hold State : Hold";
    document.getElementById("hold-info").innerText = hold;
  }
});

function displayCallObject() {
  console.log('Displaying call obj');
  document.getElementById("call-object-info").innerText = "Call Details: " + JSON.stringify(callObject);
}

function resetHold() {
  hold = "Hold State : Unhold";
  document.getElementById("hold-info").innerText = hold;
}

function resetMute() {
  mute = "Mute State : Unmute";
  document.getElementById("mute-info").innerText = mute;
}

function resetcallActive() {
  callActive = "CallActve : Inative";
  document.getElementById("call-active-info").innerText = callActive;
}

function resetState() {
  callObject = {
    sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false
  };
  displayCallObject();
  resetHold();
  resetMute();
  resetcallActive();
}

},{"./CallerPackage/client/client.js":1}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],4:[function(require,module,exports){
const pkg = require('../package.json');

module.exports = {
  USER_AGENT : `${pkg.title} ${pkg.version}`,

  // SIP scheme.
  SIP  : 'sip',
  SIPS : 'sips',

  // End and Failure causes.
  causes : {
    // Generic error causes.
    CONNECTION_ERROR : 'Connection Error',
    REQUEST_TIMEOUT  : 'Request Timeout',
    SIP_FAILURE_CODE : 'SIP Failure Code',
    INTERNAL_ERROR   : 'Internal Error',

    // SIP error causes.
    BUSY                 : 'Busy',
    REJECTED             : 'Rejected',
    REDIRECTED           : 'Redirected',
    UNAVAILABLE          : 'Unavailable',
    NOT_FOUND            : 'Not Found',
    ADDRESS_INCOMPLETE   : 'Address Incomplete',
    INCOMPATIBLE_SDP     : 'Incompatible SDP',
    MISSING_SDP          : 'Missing SDP',
    AUTHENTICATION_ERROR : 'Authentication Error',

    // Session error causes.
    BYE                      : 'Terminated',
    WEBRTC_ERROR             : 'WebRTC Error',
    CANCELED                 : 'Canceled',
    NO_ANSWER                : 'No Answer',
    EXPIRES                  : 'Expires',
    NO_ACK                   : 'No ACK',
    DIALOG_ERROR             : 'Dialog Error',
    USER_DENIED_MEDIA_ACCESS : 'User Denied Media Access',
    BAD_MEDIA_DESCRIPTION    : 'Bad Media Description',
    RTP_TIMEOUT              : 'RTP Timeout'
  },

  SIP_ERROR_CAUSES : {
    REDIRECTED           : [ 300, 301, 302, 305, 380 ],
    BUSY                 : [ 486, 600 ],
    REJECTED             : [ 403, 603 ],
    NOT_FOUND            : [ 404, 604 ],
    UNAVAILABLE          : [ 480, 410, 408, 430 ],
    ADDRESS_INCOMPLETE   : [ 484, 424 ],
    INCOMPATIBLE_SDP     : [ 488, 606 ],
    AUTHENTICATION_ERROR : [ 401, 407 ]
  },

  // SIP Methods.
  ACK       : 'ACK',
  BYE       : 'BYE',
  CANCEL    : 'CANCEL',
  INFO      : 'INFO',
  INVITE    : 'INVITE',
  MESSAGE   : 'MESSAGE',
  NOTIFY    : 'NOTIFY',
  OPTIONS   : 'OPTIONS',
  REGISTER  : 'REGISTER',
  REFER     : 'REFER',
  UPDATE    : 'UPDATE',
  SUBSCRIBE : 'SUBSCRIBE',

  // DTMF transport methods.
  DTMF_TRANSPORT : {
    INFO    : 'INFO',
    RFC2833 : 'RFC2833'
  },

  /* SIP Response Reasons
   * DOC: https://www.iana.org/assignments/sip-parameters
   * Copied from https://github.com/versatica/OverSIP/blob/master/lib/oversip/sip/constants.rb#L7
   */
  REASON_PHRASE : {
    100 : 'Trying',
    180 : 'Ringing',
    181 : 'Call Is Being Forwarded',
    182 : 'Queued',
    183 : 'Session Progress',
    199 : 'Early Dialog Terminated', // draft-ietf-sipcore-199
    200 : 'OK',
    202 : 'Accepted', // RFC 3265
    204 : 'No Notification', // RFC 5839
    300 : 'Multiple Choices',
    301 : 'Moved Permanently',
    302 : 'Moved Temporarily',
    305 : 'Use Proxy',
    380 : 'Alternative Service',
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Timeout',
    410 : 'Gone',
    412 : 'Conditional Request Failed', // RFC 3903
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Long',
    415 : 'Unsupported Media Type',
    416 : 'Unsupported URI Scheme',
    417 : 'Unknown Resource-Priority', // RFC 4412
    420 : 'Bad Extension',
    421 : 'Extension Required',
    422 : 'Session Interval Too Small', // RFC 4028
    423 : 'Interval Too Brief',
    424 : 'Bad Location Information', // RFC 6442
    428 : 'Use Identity Header', // RFC 4474
    429 : 'Provide Referrer Identity', // RFC 3892
    430 : 'Flow Failed', // RFC 5626
    433 : 'Anonymity Disallowed', // RFC 5079
    436 : 'Bad Identity-Info', // RFC 4474
    437 : 'Unsupported Certificate', // RFC 4744
    438 : 'Invalid Identity Header', // RFC 4744
    439 : 'First Hop Lacks Outbound Support', // RFC 5626
    440 : 'Max-Breadth Exceeded', // RFC 5393
    469 : 'Bad Info Package', // draft-ietf-sipcore-info-events
    470 : 'Consent Needed', // RFC 5360
    478 : 'Unresolvable Destination', // Custom code copied from Kamailio.
    480 : 'Temporarily Unavailable',
    481 : 'Call/Transaction Does Not Exist',
    482 : 'Loop Detected',
    483 : 'Too Many Hops',
    484 : 'Address Incomplete',
    485 : 'Ambiguous',
    486 : 'Busy Here',
    487 : 'Request Terminated',
    488 : 'Not Acceptable Here',
    489 : 'Bad Event', // RFC 3265
    491 : 'Request Pending',
    493 : 'Undecipherable',
    494 : 'Security Agreement Required', // RFC 3329
    500 : 'JsSIP Internal Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Server Time-out',
    505 : 'Version Not Supported',
    513 : 'Message Too Large',
    580 : 'Precondition Failure', // RFC 3312
    600 : 'Busy Everywhere',
    603 : 'Decline',
    604 : 'Does Not Exist Anywhere',
    606 : 'Not Acceptable'
  },

  ALLOWED_METHODS                  : 'INVITE,ACK,CANCEL,BYE,UPDATE,MESSAGE,OPTIONS,REFER,INFO,NOTIFY',
  ACCEPTED_BODY_TYPES              : 'application/sdp, application/dtmf-relay',
  MAX_FORWARDS                     : 69,
  SESSION_EXPIRES                  : 90,
  MIN_SESSION_EXPIRES              : 60,
  CONNECTION_RECOVERY_MAX_INTERVAL : 30,
  CONNECTION_RECOVERY_MIN_INTERVAL : 2
};

},{"../package.json":5}],5:[function(require,module,exports){
module.exports={
  "name": "jssip",
  "title": "JsSIP",
  "description": "the Javascript SIP library",
  "version": "3.9.0",
  "homepage": "https://jssip.net",
  "contributors": [
    "José Luis Millán <jmillan@aliax.net> (https://github.com/jmillan)",
    "Iñaki Baz Castillo <ibc@aliax.net> (https://inakibaz.me)"
  ],
  "types": "lib/JsSIP.d.ts",
  "main": "lib-es5/JsSIP.js",
  "keywords": [
    "sip",
    "websocket",
    "webrtc",
    "node",
    "browser",
    "library"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/versatica/JsSIP.git"
  },
  "bugs": {
    "url": "https://github.com/versatica/JsSIP/issues"
  },
  "dependencies": {
    "@types/debug": "^4.1.5",
    "@types/node": "^14.14.34",
    "debug": "^4.3.1",
    "events": "^3.3.0",
    "sdp-transform": "^2.14.1"
  },
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/preset-env": "^7.13.10",
    "ansi-colors": "^3.2.4",
    "browserify": "^16.5.1",
    "eslint": "^5.16.0",
    "fancy-log": "^1.3.3",
    "gulp": "^4.0.2",
    "gulp-babel": "^8.0.0",
    "gulp-eslint": "^5.0.0",
    "gulp-expect-file": "^1.0.2",
    "gulp-header": "^2.0.9",
    "gulp-nodeunit-runner": "^0.2.2",
    "gulp-plumber": "^1.2.1",
    "gulp-rename": "^1.4.0",
    "gulp-uglify-es": "^1.0.4",
    "pegjs": "^0.7.0",
    "vinyl-buffer": "^1.0.1",
    "vinyl-source-stream": "^2.0.0"
  },
  "scripts": {
    "lint": "gulp lint",
    "test": "gulp test",
    "prepublishOnly": "gulp babel"
  }
}

},{}]},{},[2]);
