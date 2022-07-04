const EventEmitter = require("events");
const path = require("path");


enum MESSAGE_TYPE {
    INFORM_SOCKET_CONNECTED = 'INFORM_SOCKET_CONNECTED',
    INFORM_SOCKET_DISCONNECTED = 'INFORM_SOCKET_DISCONNECTED',
    ACK_OUTGOING_CALL_START = 'ACK_OUTGOING_CALL_START',
    ACK_OUTGOING_CALL_END = 'ACK_OUTGOING_CALL_END',
    ACK_OUTGOING_CALL_FAIL = 'ACK_OUTGOING_CALL_FAIL',
    ACK_CALL_HOLD = 'ACK_CALL_HOLD',
    ACK_CALL_UNHOLD = 'ACK_CALL_UNHOLD',
    ACK_CALL_MUTE = 'ACK_CALL_MUTE',
    ACK_CALL_UNMUTE = 'ACK_CALL_UNMUTE',
    POPUP_CLOSED = 'POPUP_CLOSED',
    PING_SESSION_DETAILS = 'PING_SESSION_DETAILS',
    PING_POPUP_ALIVE = 'PING_POPUP_ALIVE',
    ACK_SESSION_DETAILS = 'ACK_SESSION_DETAILS',
    REQUEST_OUTGOING_CALL_START = 'REQUEST_OUTGOING_CALL_START',
    REQUEST_OUTGOING_CALL_END = 'REQUEST_OUTGOING_CALL_END',
    REQUEST_CALL_HOLD = 'REQUEST_CALL_HOLD',
    REQUEST_CALL_UNHOLD = 'REQUEST_CALL_UNHOLD',
    REQUEST_CALL_MUTE = 'REQUEST_CALL_MUTE',
    REQUEST_CALL_UNMUTE = 'REQUEST_CALL_UNMUTE',
    REQUEST_SESSION_DETAILS = 'REQUEST_SESSION_DETAILS',
    REQUEST_INCOMING_CALL_END = 'REQUEST_INCOMING_CALL_END',
    REQUEST_INCOMING_CALL_START = 'REQUEST_INCOMING_CALL_START',
    ACK_CALL_MUTE_FAILED = 'ACK_CALL_MUTE_FAILED',
    ACK_CALL_UNMUTE_FAILED = 'ACK_CALL_UNMUTE_FAILED',
    ACK_CALL_UNHOLD_FAILED = 'ACK_CALL_UNHOLD_FAILED', 
    ACK_CALL_HOLD_FAILED = 'ACK_CALL_HOLD_FAILED',
}

enum USER{
    PARENT = 'PARENT',
    POPUP = 'POPUP',
    WRAPPER = 'WRAPPER'
}

enum LOCAL_STORAGE{
    is_popup_active = 'is_popup_active'
}

enum CHANNEL{
    client_popup_channel = 'client_popup_channel'
}

interface MESSAGE {
    to: USER;
    from: USER;
    type: MESSAGE_TYPE;
    object: CALL_OBJECT;
}

interface CALL_OBJECT{
    sender: string,
    receiver: string,
    startTime: string,
    endTime: string,
    hold: boolean,
    mute: boolean,
}

interface CALLBACK { (): void }



const EMPTY_CALL_OBJECT: CALL_OBJECT ={
    sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false,
} 

class CallerPackage {
    callActive: boolean;
    eventEmitter: any;
    channel: any;
    callObject: CALL_OBJECT;

    constructor() {
        this.callActive = false;
        this.eventEmitter = new EventEmitter();
        this.channel = new BroadcastChannel(CHANNEL.client_popup_channel);
        this.channel.onmessage = (messageEvent) => {
            this.receiveEngine(messageEvent.data);
        };
        this.resetCallObject();
        // this.callObject = {
        //     sender: "",
        //     receiver: "",
        //     startTime: "",
        //     endTime: "",
        //     hold: false,
        //     mute: false,
        // };
    }

  resetCallObject(): void {
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
  receiveEngine(message: MESSAGE): void{
    if (message.to == "PARENT") {
      console.log(message);
      if (message.type == MESSAGE_TYPE.INFORM_SOCKET_CONNECTED) {
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.INFORM_SOCKET_DISCONNECTED) {
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_OUTGOING_CALL_START) {
        this.setCallObject({
          startTime: message.object.startTime,
          endTime: null,
          hold: null,
          mute: null,
          sender: message.object.sender,
          receiver: message.object.receiver,
            
        });
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_OUTGOING_CALL_END) {
        this.setCallObject({
          hold: false,
          mute: false,
          endTime: message.object.endTime,
          startTime: null,
          sender: null,
          receiver: null,
        });
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL) {
        this.setCallObject({
          hold: false,
          mute: false,
          startTime: "-|-",
          endTime: "-|-",
          sender: null,
          receiver: null,
        });
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_CALL_HOLD) {
        this.setCallObject({ hold: true , mute: null,  startTime: null,endTime: null,sender: null,receiver: null});
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_CALL_UNHOLD) {
        this.setCallObject({ hold: false , mute: null,  startTime: null,endTime: null,sender: null,receiver: null});
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_CALL_MUTE) {
        this.setCallObject({ mute: true , hold: null,  startTime: null,endTime: null,sender: null,receiver: null});
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_CALL_UNMUTE) {
        this.setCallObject({ mute: false , hold: null,  startTime: null,endTime: null,sender: null,receiver: null});
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.POPUP_CLOSED) {
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.PING_SESSION_DETAILS) {
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.PING_POPUP_ALIVE) {
        this.eventEmitter.emit(message.type);
      } else if (message.type ==  MESSAGE_TYPE.ACK_SESSION_DETAILS) {
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

  on(event:string, callback: CALLBACK) {
    this.eventEmitter.on(event, () => {
      callback();
    });
  }

  /**
   * This function sets callActive variable.
   * @param {boolean} ifActive
   */
  setCallActive(ifActive: boolean):void {
    this.callActive = ifActive;
  }

  /**
   * This function handle send request from Parent to Popup.
   * @param {object} message
   */
  sendEngine(message: MESSAGE): void {
    console.log("Sending : " + message.type);
    if (message.type == MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START) {
      if (this.callActive == true) {
        console.log("Call Already Active");
      } else {
        this.setCallActive(true);
        this.postHandler(message);
      }
    } else if (message.type == MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END) {
      this.postHandler(message);
    } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_HOLD) {
      this.postHandler(message);
    } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNHOLD) {
      this.postHandler(message);
    } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_MUTE) {
      this.postHandler(message);
    } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
      this.postHandler(message);
    } else if (message.type == MESSAGE_TYPE.REQUEST_SESSION_DETAILS) {
      this.postHandler(message);
    }
  }

  /**
   * This function posts message in broadcast channel.
   * @param {object} message
   */
  postHandler(message: MESSAGE):void {
    this.channel.postMessage(message);
  }

  /**
   * This function :
   *     1) If popup is already active, gets details from them.
   *     2) If popup is not active, then it creates a new popup.
   * @param {function} callback
   */
  connect(callback: CALLBACK):void {
    if (localStorage.getItem(LOCAL_STORAGE.is_popup_active) === null) {
      const popup_path = path.parse(__filename).dir + "/popup/popup.html";
      window.open(
        popup_path,
        "connection",
        "left=0, top=0, width=300, height=325"
      );
      console.log("popup path: " + popup_path);
    } else {
      console.log("Session details request");
      this.sendEngine({
        to: USER.WRAPPER,
        from: USER.PARENT,
        type: MESSAGE_TYPE.REQUEST_SESSION_DETAILS,
        object: EMPTY_CALL_OBJECT,
      });
    }
    callback();
  }

  /**
   * This function sets the local call object.
   * @param {object} callObject
   *
   */
  setCallObject(callObject: CALL_OBJECT):void {
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
  call(receiver: string):void {
    this.resetCallObject();
    this.setCallObject({ sender: null , receiver: receiver , hold: null, mute:null ,startTime: null,endTime: null});
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START,
      object: this.callObject,
    });
  }
  /**
   * This function sends the request to popup to end the current outgoing call.
   */
  endOut():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END,
      object: EMPTY_CALL_OBJECT,
    });
  }

  endIn():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_INCOMING_CALL_END,
      object: EMPTY_CALL_OBJECT,
    });
  }
  /**
   * This function sends the request to popup to put on hold.
   */
  hold():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_CALL_HOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }
  /**
   * This function sends the request to popup to put on unhold.
   */
  unhold():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_CALL_UNHOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }
  /**
   * This function sends the request to popup to put on mute.
   */
  mute():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_CALL_MUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }
  /**
   * This function sends the request to popup to put on unmute.
   */
  unmute():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_CALL_UNMUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }

  accept():void {
    this.sendEngine({
      to: USER.POPUP,
      from: USER.PARENT,
      type: MESSAGE_TYPE.REQUEST_INCOMING_CALL_START,
      object: EMPTY_CALL_OBJECT,
    });
  }

  ping() {}
}

module.exports = { CallerPackage: CallerPackage };