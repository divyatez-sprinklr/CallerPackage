(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//This is parent window
// We need to add communication listeners and emittters for dialer window to listen
// This all need to be done in an object, so that user can instantiate it.
// Later remove constant also.
var EventEmitter = require("events");

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
    key: "receiveEngine",
    value: function receiveEngine(message) {
      if (message.to == "ALL") {
        console.log(message);

        if (message.type == "INFORM_SOCKET_CONNECTED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "INFORM_CONNECTION_ONLINE") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "INFORM_CONNECTION_OFFLINE") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_OUTGOING_CALL_START") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_OUTGOING_CALL_END") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "INFORM_INCOMING_CALL") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_INCOMING_CALL_START") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_INCOMING_CALL_END") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_HOLD") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_CALL_MUTE") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "POPUP_CLOSED") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "PING_SESSION_DETAILS") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "PING_POPUP_ALIVE") {
          this.eventEmitter.emit(message.type);
        } else if (message.type == "ACK_SESSION_DETAILS") {
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
      console.log("Sending");
      this.channel.postMessage("Posting from obj");

      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_INCOMING_CALL_START") {
        this.postHandler(message);
      } else if (message.type == "REQUEST_INCOMING_CALL_END") {
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
    key: "call",
    value: function call(receiver) {
      this.callObject.receiver = receiver;
      this.sendEngine(new Message(to, '', "REQUEST_OUTGOING_CALL_START", {}));
    }
  }, {
    key: "endOut",
    value: function endOut() {
      this.sendEngine(new Message(to, '', "REQUEST_OUTGOING_CALL_END", {}));
    }
  }, {
    key: "endIn",
    value: function endIn() {
      this.sendEngine(new Message(to, '', "REQUEST_INCOMING_CALL_END", {}));
    }
  }, {
    key: "hold",
    value: function hold() {
      this.sendEngine(new Message(to, '', "REQUEST_CALL_HOLD", {}));
    }
  }, {
    key: "unhold",
    value: function unhold() {
      this.sendEngine(new Message(to, '', "REQUEST_CALL_UNHOLD", {}));
    }
  }, {
    key: "mute",
    value: function mute() {
      this.sendEngine(new Message(to, '', "REQUEST_CALL_MUTE", {}));
    }
  }, {
    key: "unmute",
    value: function unmute() {
      this.sendEngine(new Message(to, '', "REQUEST_CALL_UNMUTE", {}));
    }
  }, {
    key: "accept",
    value: function accept() {
      this.sendEngine(new Message(to, '', "REQUEST_INCOMING_CALL_START", {}));
    }
  }, {
    key: "ping",
    value: function ping() {
      var _this2 = this;

      setInterval(function () {
        console.log("client: pinging...");

        _this2.channel.postMessage(new Message("ALL", "CLIENT", "DEBUG", "sending from client"));
      }, 1000);
    }
  }]);

  return CallerPackage;
}();

module.exports = {
  CallerPackage: CallerPackage
};

},{"events":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

var CallerPackage = require("../../CallerPackage/client/client.js").CallerPackage;

var cp = new CallerPackage(); //cp.ping();
// cp.eventEmitter.on('DEBUG', function () {
//     console.log('Listened on parent using listener-emit');
// });
// class ConnectionChannel{
//     constructor(func){
//         this.connection;
//         this.textChannelStream;
//         this.exchange = [];
//         this.offer={description:"",candidate:""};
//         this.answer={description:"",candidate:""};
//         this.state =0;
//         this.startWebRTC();
//         this.setTimeout(()=>{
//             submitOffer_Answer();
//         },2000);
//     }
//     onSuccess() {}
//     onError(error) {console.error(error);};
//     str(obj){return JSON.stringify(obj);};
//     ustr(obj){return JSON.parse(obj);}
//     startWebRTC(func) {
//         this.connection = new RTCPeerConnection({
//         iceServers: [
//         {
//                 urls: 'stun:stun.l.google.com:19302'
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:80",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:443",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:443?transport=tcp",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//         url: 'turn:numb.viagenie.ca',
//         credential: 'muazkh',
//         username: 'webrtc@live.com'
//         },
//         {
//         url: 'turn:192.158.29.39:3478?transport=udp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//         },
//         {
//         url: 'turn:192.158.29.39:3478?transport=tcp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//         },
//         {
//         url: 'turn:turn.bistri.com:80',
//         credential: 'homeo',
//         username: 'homeo'
//         },
//         {
//         url: 'turn:turn.anyfirewall.com:443?transport=tcp',
//         credential: 'webrtc',
//         username: 'webrtc'
//         }
//         ],
//         });
//         this.textChannelStream = this.connection.createDataChannel('dataChannel');
//     this.connection.ondatachannel= e => {
//         const receiveChannel = e.channel;
//         receiveChannel.onmessage =e => {
//             func();
//         } 
//         receiveChannel.onopen = e => {
//                 console.log('Established data channel');
//         }
//         receiveChannel.onclose =e => console.log("Closed Text Channel.");
//     }
//     this.connection.onicecandidate = (event) => {
//         if (event.candidate) {
//         this.exchange.push(str(event.candidate));
//         }
//     };
//     }
//     sentOverDataStream(message){
//         this.textChannelStream.send(message);
//     }
//     addIce(candidates){
//     let messege = ustr(candidates);
//     messege.forEach((item) =>{
//         let candidate = JSON.parse(item);
//         this.connection.addIceCandidate(
//         new RTCIceCandidate(candidate), onSuccess, onError
//         );
//     }); 
//     }
//     createIceOffer(){
//         this.offer.candidate = str(exchange); 
//         localStorage.setItem('sdp-webrtc-offer', str(this.offer));
//         console.log('Created Ice Offer :'+str(offer));
//     }
//     createIceAnswer(){
//         this.answer.candidate = str(exchange);
//         localStorage.setItem('sdp-webrtc-answer', str(this.answer));
//         console.log('Create Ice Answer:'+str(answer));
//     }
//     handleLocalDescription(description) {
//         this.connection.setLocalDescription(description);
//         if(description.type==='offer'){
//             this.offer.description = str(description); 
//         }
//         else{
//             this.answer.description = str(description);
//         }
//     } 
//     submitOffer_Answer(){
//         let message;
//         message = ustr(localStorage.getItem('sdp-webrtc-offer'));
//         if(ustr(message.description).type=='offer'&&state===0)
//         {
//             console.log('Got offer, submitting it');
//               state = 2;
//               this.connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
//                     this.connection.createAnswer().then(this.handleLocalDescription).then(this.addIce(message.candidate));
//                     setTimeout(this.createIceAnswer,1000);
//               });
//         }
//     }
//     startOfferCreation(){
//         console.log('Creating offer');
//         state =1;
//         this.connection.createOffer().then(this.handleLocalDescription).catch(onError);
//         setTimeout(this.createIceOffer,1000);
//     }
// }
// function callFromParent(message){
//     console.log("Received"+message);
// }
// const channel = new ConnectionChannel(callFromParent);
// channel.sentOverDataStream('Hahah From Popup');

},{"../../CallerPackage/client/client.js":1}]},{},[3]);
