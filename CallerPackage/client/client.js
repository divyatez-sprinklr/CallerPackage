//This is parent window
// We need to add communication listeners and emittters for dialer window to listen
// This all need to be done in an object, so that user can instantiate it.
// Later remove constant also.

const EventEmitter = require("events");

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
    }
  }

  receiveEngine(message) {
    console.log(message);
    if (message.to == "ALL") {
      if (message.type == "INFORM_SOCKET_CONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_START") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_END") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_HOLD") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNHOLD") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_MUTE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNMUTE") {
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

  sendEngine(message) {
    console.log("Sending"+message.type);
    if (message.type == "REQUEST_OUTGOING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_CALL_HOLD") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_CALL_UNHOLD") {
      this.postHandler(message);
    }  else if (message.type == "REQUEST_CALL_MUTE") {
      this.postHandler(message);
    }  else if (message.type == "REQUEST_CALL_UNMUTE") {
      this.postHandler(message);
    } else if (message.type == "REQUEST_SESSION_DETAILS") {
      this.postHandler(message);
    }
  }

  postHandler(message) {
    this.channel.postMessage(message);
  }


  call(receiver){
      this.callObject.receiver = receiver;
      this.sendEngine(new Message('ALL','',"REQUEST_OUTGOING_CALL_START",this.callObject));
  }

  endOut(){
    this.sendEngine(new Message('ALL','',"REQUEST_OUTGOING_CALL_END",{}));
  }

  endIn(){
    this.sendEngine(new Message('ALL','',"REQUEST_INCOMING_CALL_END",{}));
  }

  hold(){
    this.sendEngine(new Message('ALL','',"REQUEST_CALL_HOLD",{}));
  }

  unhold(){
    this.sendEngine(new Message('ALL','',"REQUEST_CALL_UNHOLD",{}));
  }


  mute(){
    this.sendEngine(new Message('ALL','',"REQUEST_CALL_MUTE",{}));
  }

  unmute(){
    this.sendEngine(new Message('ALL','',"REQUEST_CALL_UNMUTE",{}));
  }

  accept(){
    this.sendEngine(new Message('ALL','',"REQUEST_INCOMING_CALL_START",{}));
  }


  ping() {
    // setInterval(() => {
    //   this.sendEngine(new Message('ALL','',"REQUEST_SESSION_DETAILS",this.callObject));
    // }, 1000);
   }
}

module.exports = { CallerPackage: CallerPackage };
