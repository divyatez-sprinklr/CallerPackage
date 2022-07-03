const EventEmitter = require("events");
const { MESSAGE } = require("jssip/lib/Constants");

class Message {
  constructor(to, from, type, object) {
    this.to = to;
    this.from = from;
    this.type = type;
    this.object = object;
  }
}

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


  resetCallObject(){
    this.callObject = {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
    };
  }

  getCallObject(){
    return this.callObject;
  }

  receiveEngine(message) {
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
        if(this.callObject.startTime==""){
          this.callActive = 0;
        }
        else if(this.callObject.endTime==""){
          this.callActive = 1;
        }
        this.eventEmitter.emit(message.type);
      } else {
        console.log("UNKNOWN TYPE: ", message);
        this.eventEmitter.emit(message.type);
      }
    }
  }



  on(header,callback){
          this.eventEmitter.on(header,()=>{
            callback();
          })
  }
  

  sendEngine(message) {
    console.log("Sending : " + message.type);
    if (message.type == "REQUEST_OUTGOING_CALL_START") {
      if(this.callActive == true)
      {
        console.log('Call Already Active');
      }
      else{
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

  postHandler(message) {
    this.channel.postMessage(message);
  }

  connectToServer(callback) {
    if (localStorage.getItem("is_popup_active") === null) {
      
      window.open(
        "./CallerPackage/popup.html",
        "connection",
        "left=0, top=0, width=200, height=200"
      );
    }
    else{
      console.log('Session details request');
      this.sendEngine(
        new Message("WRAPPER", "PARENT", "REQUEST_SESSION_DETAILS", {})
      );
    }
    callback();
  }

  call(receiver) {
    this.resetCallObject();
    this.callObject.receiver = receiver;
    this.sendEngine(
      new Message(
        "POPUP",
        "PARENT",
        "REQUEST_OUTGOING_CALL_START",
        this.callObject
      )
    );
  }

  endOut() {
    this.sendEngine(
      new Message("POPUP", "PARENT", "REQUEST_OUTGOING_CALL_END", {})
    );
  }

  endIn() {
    this.sendEngine(
      new Message("POPUP", "PARENT", "REQUEST_INCOMING_CALL_END", {})
    );
  }

  hold() {
    this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_HOLD", {}));
  }

  unhold() {
    this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_UNHOLD", {}));
  }

  mute() {
    this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_MUTE", {}));
  }

  unmute() {
    this.sendEngine(new Message("POPUP", "PARENT", "REQUEST_CALL_UNMUTE", {}));
  }

  accept() {
    this.sendEngine(
      new Message("POPUP", "PARENT", "REQUEST_INCOMING_CALL_START", {})
    );
  }

  ping() {
    // setInterval(() => {
    //   this.sendEngine(new Message('POPUP','PARENT',"REQUEST_SESSION_DETAILS",this.callObject));
    // }, 1000);
  }
}

module.exports = { CallerPackage: CallerPackage };
