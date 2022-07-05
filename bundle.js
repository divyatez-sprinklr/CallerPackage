(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
"use strict";

var _enums = require("./static/enums");

var _constants = require("./static/constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var EventEmitter = require("events");

var path = require("path");

var EMPTY_CALL_OBJECT = {
  sender: "",
  receiver: "",
  startTime: "",
  endTime: "",
  hold: false,
  mute: false
};

var _callActive = /*#__PURE__*/new WeakMap();

var _eventEmitter = /*#__PURE__*/new WeakMap();

var _channel = /*#__PURE__*/new WeakMap();

var _config_channel = /*#__PURE__*/new WeakMap();

var _callObject = /*#__PURE__*/new WeakMap();

var _popupWindow = /*#__PURE__*/new WeakMap();

var _resetCallObject = /*#__PURE__*/new WeakSet();

var _receiveEngine = /*#__PURE__*/new WeakSet();

var _setCallActive = /*#__PURE__*/new WeakSet();

var _sendEngine = /*#__PURE__*/new WeakSet();

var _postHandler = /*#__PURE__*/new WeakSet();

var _openNewPopup = /*#__PURE__*/new WeakSet();

var _setCallObject = /*#__PURE__*/new WeakSet();

var CallerPackage = /*#__PURE__*/function () {
  function CallerPackage() {
    var _this = this;

    _classCallCheck(this, CallerPackage);

    _classPrivateMethodInitSpec(this, _setCallObject);

    _classPrivateMethodInitSpec(this, _openNewPopup);

    _classPrivateMethodInitSpec(this, _postHandler);

    _classPrivateMethodInitSpec(this, _sendEngine);

    _classPrivateMethodInitSpec(this, _setCallActive);

    _classPrivateMethodInitSpec(this, _receiveEngine);

    _classPrivateMethodInitSpec(this, _resetCallObject);

    _classPrivateFieldInitSpec(this, _callActive, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _eventEmitter, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _channel, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _config_channel, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _callObject, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _popupWindow, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _callActive, false);

    _classPrivateFieldSet(this, _eventEmitter, new EventEmitter());

    _classPrivateFieldSet(this, _channel, new BroadcastChannel(_constants.CLIENT_POPUP_CHANNEL));

    _classPrivateFieldGet(this, _channel).onmessage = function (messageEvent) {
      _classPrivateMethodGet(_this, _receiveEngine, _receiveEngine2).call(_this, messageEvent.data);
    };

    _classPrivateFieldSet(this, _config_channel, new BroadcastChannel(_constants.CONFIG_CHANNEL));

    _classPrivateFieldSet(this, _callObject, {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false
    });

    _classPrivateFieldSet(this, _popupWindow, null);
  }

  _createClass(CallerPackage, [{
    key: "getCallObject",
    value:
    /**
     * This returns the private call object variable.
     * @returns object
     */
    function getCallObject() {
      return _classPrivateFieldGet(this, _callObject);
    }
    /**
     * This function handles recieved messege and directs the logic.
     * @param {object} message
     */

  }, {
    key: "on",
    value:
    /**
     * This function helps setup eventlistener on #eventEmitter.
     * @param {string} event
     * @param {function} callback
     */
    function on(event, callback) {
      _classPrivateFieldGet(this, _eventEmitter).on(event, function () {
        callback();
      });
    }
    /**
     * This function sets #callActive variable.
     * @param {boolean} ifActive
     */

  }, {
    key: "connect",
    value:
    /**
     * This function :
     *     1) If popup is already active, gets details from them.
     *     2) If popup is not active, then it creates a new popup.
     * @param {function} callback
     */
    function connect(config, callback) {
      if (localStorage.getItem(_constants.IS_POPUP_ACTIVE) === null) {
        var popup_path = path.parse(__filename).dir + "/popup/popup.html";
        console.log("popup path: " + popup_path);

        _classPrivateMethodGet(this, _openNewPopup, _openNewPopup2).call(this, popup_path, config);
      } else {
        console.log("Session details request");

        _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
          to: _enums.AGENT_TYPE.WRAPPER,
          from: _enums.AGENT_TYPE.PARENT,
          type: _enums.MESSAGE_TYPE.REQUEST_SESSION_DETAILS,
          object: EMPTY_CALL_OBJECT
        });
      }

      callback();
    }
    /**
     * This function sets the local call object.
     * @param {object} #callObject
     */

  }, {
    key: "call",
    value:
    /**
     * This function sends the request to popup to start an outgoing call.
     * @param {string} receiver
     */
    function call(receiver) {
      _classPrivateMethodGet(this, _resetCallObject, _resetCallObject2).call(this);

      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        sender: null,
        receiver: receiver,
        hold: null,
        mute: null,
        startTime: null,
        endTime: null
      });

      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START,
        object: _classPrivateFieldGet(this, _callObject)
      });
    }
    /**
     * Requests popup to end the current outgoing call.
     */

  }, {
    key: "terminate",
    value: function terminate() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to put on hold.
     */

  }, {
    key: "hold",
    value: function hold() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_CALL_HOLD,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to put on unhold.
     */

  }, {
    key: "unhold",
    value: function unhold() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_CALL_UNHOLD,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to put on mute.
     */

  }, {
    key: "mute",
    value: function mute() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_CALL_MUTE,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to put on unmute.
     */

  }, {
    key: "unmute",
    value: function unmute() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_CALL_UNMUTE,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to accept incoming call.
     */

  }, {
    key: "accept",
    value: function accept() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_INCOMING_CALL_START,
        object: EMPTY_CALL_OBJECT
      });
    }
    /**
     * This function sends the request to popup to decline incoming call.
     */

  }, {
    key: "decline",
    value: function decline() {
      _classPrivateMethodGet(this, _sendEngine, _sendEngine2).call(this, {
        to: _enums.AGENT_TYPE.POPUP,
        from: _enums.AGENT_TYPE.PARENT,
        type: _enums.MESSAGE_TYPE.REQUEST_INCOMING_CALL_DECLINE,
        object: EMPTY_CALL_OBJECT
      });
    }
  }]);

  return CallerPackage;
}();

function _resetCallObject2() {
  _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
    sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false
  });
}

function _receiveEngine2(message) {
  if (message.to == "PARENT") {
    console.log(message);

    if (message.type == _enums.MESSAGE_TYPE.INFORM_SOCKET_CONNECTED) {
      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.INFORM_SOCKET_DISCONNECTED) {
      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_OUTGOING_CALL_START) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        startTime: message.object.startTime,
        endTime: null,
        hold: null,
        mute: null,
        sender: message.object.sender,
        receiver: message.object.receiver
      });

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_OUTGOING_CALL_END) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        hold: false,
        mute: false,
        endTime: message.object.endTime,
        startTime: null,
        sender: null,
        receiver: null
      });

      _classPrivateMethodGet(this, _setCallActive, _setCallActive2).call(this, false);

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        hold: false,
        mute: false,
        startTime: "-|-",
        endTime: "-|-",
        sender: null,
        receiver: null
      });

      _classPrivateMethodGet(this, _setCallActive, _setCallActive2).call(this, false);

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_CALL_HOLD) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        hold: true,
        mute: null,
        startTime: null,
        endTime: null,
        sender: null,
        receiver: null
      });

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_CALL_UNHOLD) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        hold: false,
        mute: null,
        startTime: null,
        endTime: null,
        sender: null,
        receiver: null
      });

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_CALL_MUTE) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        mute: true,
        hold: null,
        startTime: null,
        endTime: null,
        sender: null,
        receiver: null
      });

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_CALL_UNMUTE) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, {
        mute: false,
        hold: null,
        startTime: null,
        endTime: null,
        sender: null,
        receiver: null
      });

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.POPUP_CLOSED) {
      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.PING_SESSION_DETAILS) {
      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.PING_POPUP_ALIVE) {
      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else if (message.type == _enums.MESSAGE_TYPE.ACK_SESSION_DETAILS) {
      _classPrivateMethodGet(this, _setCallObject, _setCallObject2).call(this, message.object);

      if (_classPrivateFieldGet(this, _callObject).startTime == "") {
        _classPrivateMethodGet(this, _setCallActive, _setCallActive2).call(this, false);
      } else if (_classPrivateFieldGet(this, _callObject).endTime == "") {
        _classPrivateMethodGet(this, _setCallActive, _setCallActive2).call(this, true);
      }

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    } else {
      console.log("UNKNOWN TYPE: ", message);

      _classPrivateFieldGet(this, _eventEmitter).emit(message.type);
    }
  }
}

function _setCallActive2(ifActive) {
  _classPrivateFieldSet(this, _callActive, ifActive);
}

function _sendEngine2(message) {
  console.log("Sending : " + message.type);

  if (message.type == _enums.MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START) {
    if (_classPrivateFieldGet(this, _callActive) == true) {
      console.log("Call Already Active");
    } else {
      _classPrivateMethodGet(this, _setCallActive, _setCallActive2).call(this, true);

      _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
    }
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_CALL_HOLD) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_CALL_UNHOLD) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_CALL_MUTE) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  } else if (message.type == _enums.MESSAGE_TYPE.REQUEST_SESSION_DETAILS) {
    _classPrivateMethodGet(this, _postHandler, _postHandler2).call(this, message);
  }
}

function _postHandler2(message) {
  _classPrivateFieldGet(this, _channel).postMessage(message);
}

function _openNewPopup2(popup_path, config) {
  var _this2 = this;

  if (_classPrivateFieldGet(this, _popupWindow)) _classPrivateFieldGet(this, _popupWindow).close();

  _classPrivateFieldSet(this, _popupWindow, window.open(popup_path, "connection", "left=".concat(_constants.POPUP_WINDOW_LEFT, ", top=").concat(_constants.POPUP_WINDOW_TOP, ", width=").concat(_constants.POPUP_WINDOW_WIDTH, ", height=").concat(_constants.POPUP_WINDOW_HEIGHT)));

  setTimeout(function () {
    _classPrivateFieldGet(_this2, _config_channel).postMessage(config);
  }, 1000);
}

function _setCallObject2(callObject) {
  if (callObject.sender) {
    _classPrivateFieldGet(this, _callObject).sender = callObject.sender;
  }

  if (callObject.receiver) {
    _classPrivateFieldGet(this, _callObject).receiver = callObject.receiver;
  }

  if (callObject.startTime) {
    _classPrivateFieldGet(this, _callObject).startTime = callObject.startTime;
  }

  if (callObject.endTime) {
    _classPrivateFieldGet(this, _callObject).endTime = callObject.endTime;
  }

  if (callObject.hold) {
    _classPrivateFieldGet(this, _callObject).hold = callObject.hold;
  }

  if (callObject.mute) {
    _classPrivateFieldGet(this, _callObject).mute = callObject.mute;
  }
}

module.exports = {
  CallerPackage: CallerPackage
};

}).call(this)}).call(this,"/CallerPackage/client.js")
},{"./static/constants":2,"./static/enums":3,"events":5,"path":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POPUP_WINDOW_WIDTH = exports.POPUP_WINDOW_TOP = exports.POPUP_WINDOW_LEFT = exports.POPUP_WINDOW_HEIGHT = exports.IS_POPUP_ACTIVE = exports.CONFIG_CHANNEL = exports.CLIENT_POPUP_CHANNEL = void 0;
var IS_POPUP_ACTIVE = "IS_POPUP_ACTIVE";
exports.IS_POPUP_ACTIVE = IS_POPUP_ACTIVE;
var CLIENT_POPUP_CHANNEL = "CLIENT_POPUP_CHANNEL";
exports.CLIENT_POPUP_CHANNEL = CLIENT_POPUP_CHANNEL;
var CONFIG_CHANNEL = "CONFIG_CHANNEL";
exports.CONFIG_CHANNEL = CONFIG_CHANNEL;
var POPUP_WINDOW_LEFT = 0;
exports.POPUP_WINDOW_LEFT = POPUP_WINDOW_LEFT;
var POPUP_WINDOW_TOP = 0;
exports.POPUP_WINDOW_TOP = POPUP_WINDOW_TOP;
var POPUP_WINDOW_WIDTH = 200;
exports.POPUP_WINDOW_WIDTH = POPUP_WINDOW_WIDTH;
var POPUP_WINDOW_HEIGHT = 200;
exports.POPUP_WINDOW_HEIGHT = POPUP_WINDOW_HEIGHT;

},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.MESSAGE_TYPE = exports.AGENT_TYPE = void 0;
var AGENT_TYPE;

(function (AGENT_TYPE) {
  AGENT_TYPE["PARENT"] = "PARENT";
  AGENT_TYPE["POPUP"] = "POPUP";
  AGENT_TYPE["WRAPPER"] = "WRAPPER";
})(AGENT_TYPE = exports.AGENT_TYPE || (exports.AGENT_TYPE = {}));

var MESSAGE_TYPE;

(function (MESSAGE_TYPE) {
  MESSAGE_TYPE["INFORM_SOCKET_CONNECTED"] = "INFORM_SOCKET_CONNECTED";
  MESSAGE_TYPE["INFORM_SOCKET_DISCONNECTED"] = "INFORM_SOCKET_DISCONNECTED";
  MESSAGE_TYPE["ACK_OUTGOING_CALL_START"] = "ACK_OUTGOING_CALL_START";
  MESSAGE_TYPE["ACK_OUTGOING_CALL_END"] = "ACK_OUTGOING_CALL_END";
  MESSAGE_TYPE["ACK_OUTGOING_CALL_FAIL"] = "ACK_OUTGOING_CALL_FAIL";
  MESSAGE_TYPE["ACK_CALL_HOLD"] = "ACK_CALL_HOLD";
  MESSAGE_TYPE["ACK_CALL_UNHOLD"] = "ACK_CALL_UNHOLD";
  MESSAGE_TYPE["ACK_CALL_MUTE"] = "ACK_CALL_MUTE";
  MESSAGE_TYPE["ACK_CALL_UNMUTE"] = "ACK_CALL_UNMUTE";
  MESSAGE_TYPE["POPUP_CLOSED"] = "POPUP_CLOSED";
  MESSAGE_TYPE["PING_SESSION_DETAILS"] = "PING_SESSION_DETAILS";
  MESSAGE_TYPE["PING_POPUP_ALIVE"] = "PING_POPUP_ALIVE";
  MESSAGE_TYPE["ACK_SESSION_DETAILS"] = "ACK_SESSION_DETAILS";
  MESSAGE_TYPE["REQUEST_OUTGOING_CALL_START"] = "REQUEST_OUTGOING_CALL_START";
  MESSAGE_TYPE["REQUEST_OUTGOING_CALL_END"] = "REQUEST_OUTGOING_CALL_END";
  MESSAGE_TYPE["REQUEST_CALL_HOLD"] = "REQUEST_CALL_HOLD";
  MESSAGE_TYPE["REQUEST_CALL_UNHOLD"] = "REQUEST_CALL_UNHOLD";
  MESSAGE_TYPE["REQUEST_CALL_MUTE"] = "REQUEST_CALL_MUTE";
  MESSAGE_TYPE["REQUEST_CALL_UNMUTE"] = "REQUEST_CALL_UNMUTE";
  MESSAGE_TYPE["REQUEST_SESSION_DETAILS"] = "REQUEST_SESSION_DETAILS";
  MESSAGE_TYPE["REQUEST_INCOMING_CALL_START"] = "REQUEST_INCOMING_CALL_START";
  MESSAGE_TYPE["REQUEST_INCOMING_CALL_DECLINE"] = "REQUEST_INCOMING_CALL_DECLINE";
  MESSAGE_TYPE["REQUEST_INCOMING_CALL_END"] = "REQUEST_INCOMING_CALL_END";
  MESSAGE_TYPE["ACK_CALL_MUTE_FAILED"] = "ACK_CALL_MUTE_FAILED";
  MESSAGE_TYPE["ACK_CALL_UNMUTE_FAILED"] = "ACK_CALL_UNMUTE_FAILED";
  MESSAGE_TYPE["ACK_CALL_UNHOLD_FAILED"] = "ACK_CALL_UNHOLD_FAILED";
  MESSAGE_TYPE["ACK_CALL_HOLD_FAILED"] = "ACK_CALL_HOLD_FAILED";
})(MESSAGE_TYPE = exports.MESSAGE_TYPE || (exports.MESSAGE_TYPE = {}));

},{}],4:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("./CallerPackage/client"),
    CallerPackage = _require.CallerPackage;

var callerPackage = new CallerPackage();
var onMute = false;
var onHold = false;
var onActiveCall = false;
var receiver = "";
var timerInterval;
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
var connect_button = document.getElementById("configure");
var call_button = document.getElementById("call");
connect_button.addEventListener("click", function () {
  callerPackage.connect({
    sip: document.getElementById("username").value,
    password: document.getElementById("password").value,
    server_address: document.getElementById("server-address").value,
    port: document.getElementById("port").value
  }, function () {
    connect_button.disabled = true;
  });
});
call_button.addEventListener("click", function () {
  //resetState();
  callerPackage.call(document.getElementById("phone-number").value);
  updateInitiateCallUI();
}); // hangup_button.addEventListener("click", () => {
//   callerPackage.endOut();
// });
// hold_button.addEventListener("click", () => {
//   callerPackage.hold();
// });
// unhold_button.addEventListener("click", () => {
//   callerPackage.unhold();
// });
// mute_button.addEventListener("click", () => {
//   callerPackage.mute();
// });
// unmute_button.addEventListener("click", () => {
//   callerPackage.unmute();
// });

document.getElementById("mute-call").addEventListener("click", function () {
  handleMute();
});
document.getElementById("hold-call").addEventListener("click", function () {
  handleHold();
});
document.getElementById("end-call").addEventListener("click", function () {
  callerPackage.terminate();
});
callerPackage.on("INFORM_SOCKET_CONNECTED", function () {
  socket = "Socket : Connected";
  document.getElementById("socket-info").innerText = socket;
  call_button.disabled = false;
  connect_button.disabled = false;
});
callerPackage.on("INFORM_SOCKET_DISCONNECTED", function () {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});
callerPackage.on("ACK_OUTGOING_CALL_START", function () {
  resetState();
  callActive = "CallActive : Active";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("call-active-info").innerText = callActive;
  updateConfirmCallUI();
});
callerPackage.on("ACK_OUTGOING_CALL_END", function () {
  resetState();
  callActive = "CallActive : Inactive";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
  closeCallUI();
});
callerPackage.on("ACK_OUTGOING_CALL_FAIL", function () {
  resetState();
  callActive = "CallActive : FAIL";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
  closeCallUI();
});
callerPackage.on("ACK_CALL_HOLD", function () {
  hold = "Hold State : Hold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
  onHold = true;
  updateMuteUI(onHold);
});
callerPackage.on("ACK_CALL_UNHOLD", function () {
  hold = "Hold State : Unhold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
  onHold = false;
  updateMuteUI(onHold);
});
callerPackage.on("ACK_CALL_MUTE", function () {
  mute = "Mute State : Mute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
  onMute = true;
  updateMuteUI(onMute);
});
callerPackage.on("ACK_CALL_UNMUTE", function () {
  mute = "Mute State : Unmute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
  onMute = false;
  updateMuteUI(onMute);
});
callerPackage.on("ACK_SESSION_DETAILS", function () {
  console.log("Caught session details");
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
callerPackage.on("POPUP_CLOSED", function () {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});

function displayCallObject() {
  console.log("Displaying call obj");
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
} //// Dialpad Float ///


var start_time = 0;

var secondsPassed = function secondsPassed(start_time) {
  return Math.round((Date.now() - start_time) / 1000);
};

var h = 0,
    m = 0,
    s = 0,
    call_timer = null;

function toggleTimer(start) {
  if (start) {
    call_timer = setInterval(function () {
      s = secondsPassed(start_time);
      h = Math.floor(s / 3600);
      s = s - 3600 * h;
      m = Math.floor(s / 60);
      s = s - 60 * m;
      var current_time = "";
      current_time = (s < 10 ? "0" + s : s) + current_time;
      current_time = (m < 10 ? "0" + m : m) + current_time;
      current_time = (h < 10 ? "0" + h : h) + current_time;
      document.getElementById("dialpad-timer").innerHTML = "".concat(current_time);
    }, 1000);
  } else {
    console.log("Call duration: ".concat(h, ":").concat(m, ":").concat(s));
    clearInterval(call_timer);
    document.getElementById("dialpad-timer").innerHTML = "";
    h = 0;
    m = 0;
    s = 0;
    call_timer = null;
  }
}

function getHMS(raw_time) {
  raw_time = String(raw_time);

  var _raw_time$match$0$spl = raw_time.match(/\d+:\d+:\d+/)[0].split(":"),
      _raw_time$match$0$spl2 = _slicedToArray(_raw_time$match$0$spl, 3),
      h = _raw_time$match$0$spl2[0],
      m = _raw_time$match$0$spl2[1],
      s = _raw_time$match$0$spl2[2];

  return {
    h: h,
    m: m,
    s: s
  };
}

function startTimer() {
  start_time = getHMS(callObject.startTime);
  toggleTimer(true);
}

function endTimer() {
  toggleTimer(false);
}

function closeCallUI() {
  document.getElementById("dialpad-box").style.visibility = "hidden";
  endTimer();
}

function updateInitiateCallUI() {
  document.getElementById("dialpad-box").style.visibility = "inherit";
  document.getElementById("user-number").innerHTML = "".concat(callObject.receiver);
  document.getElementById("dialpad-timer").innerHTML = "Ringing..";
}

function updateConfirmCallUI() {
  startTimer();
}

function handleHold() {
  if (!onHold) {
    callerPackage.hold();
  } else {
    callerPackage.unhold();
  }
}

function updateHoldUI(putOnHold) {
  if (putOnHold) {
    document.getElementById("hold-call").classList.remove("control-btn-inactive");
    document.getElementById("hold-call").classList.add("control-btn-active");
  } else {
    document.getElementById("hold-call").classList.remove("control-btn-active");
    document.getElementById("hold-call").classList.add("control-btn-inactive");
  }
}

function handleMute() {
  if (!onMute) {
    callerPackage.mute();
  } else {
    callerPackage.unmute();
  }
}

function updateMuteUI(putOnHold) {
  if (putOnHold) {
    document.getElementById("mute-call").classList.remove("control-btn-inactive");
    document.getElementById("mute-call").classList.add("control-btn-active");
  } else {
    document.getElementById("mute-call").classList.remove("control-btn-active");
    document.getElementById("mute-call").classList.add("control-btn-inactive");
  }
} // function updateConfirmCallUI(){
//   startTimer();
// }
// updateInitiateCallUI();
// updateHoldUI(true);
// updateMuteUI(false);

},{"./CallerPackage/client":1}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

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

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":7}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[4]);
