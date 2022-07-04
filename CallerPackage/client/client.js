const EventEmitter = require("events");
const { MESSAGE } = require("jssip/lib/Constants");
const { urlToHttpOptions } = require("url");


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
    this.setCallObject({sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false,
  });
    // this.callObject = {
    //   sender: "",
    //   receiver: "",
    //   startTime: "",
    //   endTime: "",
    //   hold: false,
    //   mute: false,
    // };
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
        this.setCallObject({startTime: message.object.startTime,sender: message.object.sender,receiver: message.object.receiver});
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_END") {
        this.setCallObject({hold: false, mute: false, endTime: message.object.endTime});
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_OUTGOING_CALL_FAIL") {
        this.setCallObject({hold: false, mute: false, startTime: '-|-', endTime:  '-|-'});
        this.setCallActive(false);
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_HOLD") {
        this.setCallObject({hold: true});
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNHOLD") {
        this.setCallObject({hold: false});
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_MUTE") {
        this.setCallObject({mute: true});
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_CALL_UNMUTE") {
        this.setCallObject({mute: false});
        this.eventEmitter.emit(message.type);
      } else if (message.type == "POPUP_CLOSED") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_SESSION_DETAILS") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "PING_POPUP_ALIVE") {
        this.eventEmitter.emit(message.type);
      } else if (message.type == "ACK_SESSION_DETAILS") {
        this.setCallObject(message.object);
        if(this.callObject.startTime==""){
          this.setCallActive(false);
        }
        else if(this.callObject.endTime==""){
          this.setCallActive(true);
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
  
  setCallActive(ifActive){
    this.callActive = ifActive;
  }
  sendEngine(message) {
    console.log("Sending : " + message.type);
    if (message.type == "REQUEST_OUTGOING_CALL_START") {
      if(this.callActive == true)
      {
        console.log('Call Already Active');
      }
      else{
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

  postHandler(message) {
    this.channel.postMessage(message);
  }

  connect(callback) {
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
        {to:"WRAPPER",from: "PARENT",type: "REQUEST_SESSION_DETAILS",object: {}}
      );
    }
    callback();
  }

  setCallObject(callObject){
      if(!callObject.receiver){
        this.callObject.receiver = callObject.receiver;
      } 
      if(!callObject.sender){
        this.callObject.sender = callObject.sender;
      } 
      if(!callObject.receiver){
        this.callObject.receiver = callObject.receiver;
      } 
      if(!callObject.startTime){
        this.callObject.startTime = callObject.startTime;
      } 
      if(!callObject.endTime){
        this.callObject.endTime = callObject.endTime;
      } 
      if(!callObject.hold){
        this.callObject.hold = callObject.hold;
      } 
      if(!callObject.mute){
        this.callObject.mute = callObject.mute;
      } 
  }

  call(receiver) {
    this.resetCallObject();
    this.setCallObject({receiver:receiver})
    this.sendEngine(
      {
        to: "POPUP",
        from: "PARENT",
        type: "REQUEST_OUTGOING_CALL_START",
        object: this.callObject
      }
    );
  }

  endOut() {
    this.sendEngine(
      {to: "POPUP",from: "PARENT",type: "REQUEST_OUTGOING_CALL_END",object: {}}
    );
  }

  endIn() {
    this.sendEngine(
      {to: "POPUP",from: "PARENT",type: "REQUEST_INCOMING_CALL_END",object: {}}
    );
  }

  hold() {
    this.sendEngine({to: "POPUP",from: "PARENT",type: "REQUEST_CALL_HOLD",object: {}});
  }

  unhold() {
    this.sendEngine({to: "POPUP",from: "PARENT",type: "REQUEST_CALL_UNHOLD",object: {}});
  }

  mute() {
    this.sendEngine({to: "POPUP",from: "PARENT",type: "REQUEST_CALL_MUTE",object: {}});
  }

  unmute() {
    this.sendEngine({to: "POPUP",from: "PARENT",type: "REQUEST_CALL_UNMUTE",object: {}});
  }

  accept() {
    this.sendEngine(
      {to:"POPUP",from: "PARENT",type: "REQUEST_INCOMING_CALL_START",object: {}}
    );
  }

  ping() {
    
  }
}

module.exports = { CallerPackage: CallerPackage };
