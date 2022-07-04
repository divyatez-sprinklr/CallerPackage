const EventEmitter = require("events");
const path = require("path");

class CallerPackage {
  constructor() {
    this.callActive = false;
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");
    this.channel.onmessage = (messageEvent) => {
      this.receiveEngine(messageEvent.data);
    };
    this.callObject = {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
    };
  }

  resetCallObject() {
    this.setCallObject({
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
    });
  }
  /**
   * This returns the private call object variable.
   * @returns object
   */
  getCallObject() {
    return this.callObject;
  }

  /**
   * This function handles recieved messege and directs the logic.
   * @param {object} message
   */
  receiveEngine(message) {
    if (message.to == "PARENT") {
      console.log(message);
      if (message.type == "INFORM_SOCKET_CONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_START") {
        this.setCallObject({
          startTime: message.object.startTime,
          sender: message.object.sender,
          receiver: message.object.receiver,
        });
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_END") {
        this.setCallObject({
          hold: false,
          mute: false,
          endTime: message.object.endTime,
        });
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_FAIL") {
        this.setCallObject({
          hold: false,
          mute: false,
          startTime: "-|-",
          endTime: "-|-",
        });
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_HOLD") {
        this.setCallObject({ hold: true });
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNHOLD") {
        this.setCallObject({ hold: false });
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_MUTE") {
        this.setCallObject({ mute: true });
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNMUTE") {
        this.setCallObject({ mute: false });
        this.eventEmitter.emit(message.type);
      } else if (message.type == "POPUP_CLOSED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_SESSION_DETAILS") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_POPUP_ALIVE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_SESSION_DETAILS") {
        this.setCallObject(message.object);
        if (this.callObject.startTime == "") {
          this.setCallActive(false);
        } else if (this.callObject.endTime == "") {
          this.setCallActive(true);
        }
        this.eventEmitter.emit(message.type);
      } else {
        console.log("UNKNOWN TYPE: ", message);
        this.eventEmitter.emit(message.type);
      }
    }
  }

  /**
   * This function helps setup eventlistener on eventEmitter.
   * @param {string} header
   * @param {function} callback
   */

  on(header, callback) {
    this.eventEmitter.on(header, () => {
      callback();
    });
  }

  /**
   * This function sets callActive variable.
   * @param {boolean} ifActive
   */
  setCallActive(ifActive) {
    this.callActive = ifActive;
  }

  /**
   * This function handle send request from Parent to Popup.
   * @param {object} message
   */
  sendEngine(message) {
    console.log("Sending : " + message.type);
    if (message.type == "REQUEST_OUTGOING_CALL_START") {
      if (this.callActive == true) {
        console.log("Call Already Active");
      } else {
        this.setCallActive(true);
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

  /**
   * This function posts message in broadcast channel.
   * @param {object} message
   */
  postHandler(message) {
    this.channel.postMessage(message);
  }

  /**
   * This function :
   *     1) If popup is already active, gets details from them.
   *     2) If popup is not active, then it creates a new popup.
   * @param {function} callback
   */
  connect(callback) {
    if (localStorage.getItem("is_popup_active") === null) {
      const popup_path = path.parse(__filename).dir + "/popup/popup.html";
      window.open(
        popup_path,
        "connection",
        "left=0, top=0, width=200, height=200"
      );
      console.log(popup_path);
    } else {
      console.log("Session details request");
      this.sendEngine({
        to: "WRAPPER",
        from: "PARENT",
        type: "REQUEST_SESSION_DETAILS",
        object: {},
      });
    }
    callback();
  }

  /**
   * This function sets the local call object.
   * @param {object} callObject
   *
   */
  setCallObject(callObject) {
    if (!callObject.receiver) {
      this.callObject.receiver = callObject.receiver;
    }
    if (!callObject.sender) {
      this.callObject.sender = callObject.sender;
    }
    if (!callObject.receiver) {
      this.callObject.receiver = callObject.receiver;
    }
    if (!callObject.startTime) {
      this.callObject.startTime = callObject.startTime;
    }
    if (!callObject.endTime) {
      this.callObject.endTime = callObject.endTime;
    }
    if (!callObject.hold) {
      this.callObject.hold = callObject.hold;
    }
    if (!callObject.mute) {
      this.callObject.mute = callObject.mute;
    }
  }

  /**
   * This function sends the request to popup to start an outgoing call.
   * @param {string} receiver
   */
  call(receiver) {
    this.resetCallObject();
    this.setCallObject({ receiver: receiver });
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_OUTGOING_CALL_START",
      object: this.callObject,
    });
  }
  /**
   * This function sends the request to popup to end the current outgoing call.
   */
  endOut() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_OUTGOING_CALL_END",
      object: {},
    });
  }

  endIn() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_INCOMING_CALL_END",
      object: {},
    });
  }
  /**
   * This function sends the request to popup to put on hold.
   */
  hold() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_CALL_HOLD",
      object: {},
    });
  }
  /**
   * This function sends the request to popup to put on unhold.
   */
  unhold() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_CALL_UNHOLD",
      object: {},
    });
  }
  /**
   * This function sends the request to popup to put on mute.
   */
  mute() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_CALL_MUTE",
      object: {},
    });
  }
  /**
   * This function sends the request to popup to put on unmute.
   */
  unmute() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_CALL_UNMUTE",
      object: {},
    });
  }

  accept() {
    this.sendEngine({
      to: "POPUP",
      from: "PARENT",
      type: "REQUEST_INCOMING_CALL_START",
      object: {},
    });
  }

  ping() {}
}

module.exports = { CallerPackage: CallerPackage };
