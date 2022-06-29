/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const { throws } = require("assert");
const EventEmitter = require("events");
const JsSIP = require('jssip');
class Message {
  constructor(to, from, type, object) {
    this.to = to;
    this.from = from;
    this.type = type;
    this.object = object;
  }
}


class Popup {
  constructor(config) {
    console.log('PopUp COnstructor');
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");
    
    this.channel.onmessage = (messageEvent) => {
      this.receiveEngine(messageEvent.data);
    };
    
    this.JsSIP_Wrapper = new JsSIP_Wrapper( this.eventEmitter,config);
    this.JsSIP_Wrapper.sample();
    this.CallObject = {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
      // get sender(){
      //   this.sender;
      // },
      // get receiver(){
      //   this.receiver;
      // },
      // get startTime(){
      //   this.startTime;
      // },
      // get endTime(){
      //   this.endTime;
      // },
      // get hold(){
      //   this.hold;
      // },
      // get mute(){
      //   this.mute;
      // },
      // set sender(sender){
      //   this.sender = sender;
      // },
      // set receiver(receiver){
      //   this.receiver = receiver;
      // },
      // set startTime(startTime){
      //   this.startTime = startTime;
      // },
      // set endTime(endTime){
      //   this.endTime = endTime;
      // },
      // set hold(hold){
      //   this.hold = hold;
      // },
      // set mute(mute){
      //   this.mute = mute;
      // },
    };
    this.handleEventEmitters();
  }

  resetCallObject(){
    sender('');
    receiver('');
    startTime('');
    endTime('');
    hold(false);
    mute(false);
  }
  handleOutgoingCallStart(callObject){
      this.callObject.to = callObject.to;
      this.callObject.startTime = Date.now().toString();
      this.JsSIP_Wrapper.call();
  }
  
  handleOutgoingCallEnd(){
    this.callObject.startTime = callObject.getStartTime();
    this.callObject.endTime = callObject.getEndTime();;
    this.JsSIP_Wrapper.end();
  }

  handleIncomingCallStart(){
    this.JsSIP_Wrapper.answer();
    this.callObject.to = this.JsSIP_Wrapper.getRemoteIdentity();
  }

  handleIncomingCallEnd(){
    this.callObject.startTime = callObject.getStartTime();
    this.callObject.endTime = callObject.getEndTime();;
    this.JsSIP_Wrapper.end();
  }

  handleCallHold(){
    this.JsSIP_Wrapper.toggleHold();
  }

  handleCallMute(){
    this.JsSIP_Wrapper.toggleMute();
  }

  handleEventEmitters(){
    this.eventEmitter.on('INFORM_SOCKET_CONNECTED',()=>{

    });
    this.eventEmitter.on('INFORM_SOCKET_DISCONNECTED',()=>{

    });
    this.eventEmitter.on('INFORM_INCOMING_CALL',()=>{

    });
    this.eventEmitter.on('INFORM_REMOTE_HOLD',()=>{

    });
    this.eventEmitter.on('INFORM_REMOTE_UNHOLD',()=>{

    });
    this.eventEmitter.on('ACK_OUTGOING_CALL_START',()=>{

    });
    this.eventEmitter.on('ACK_OUTGOING_CALL_END',()=>{

    });
    this.eventEmitter.on('ACK_INCOMING_CALL_START',()=>{

    });
    this.eventEmitter.on('ACK_INCOMING_CALL_END',()=>{

    });
    this.eventEmitter.on('all',()=>{
      console.log('LAllaal worked');
    })
    
  }

  receiveEngine(message) {
    if (message.to == "ALL" || message.to == "POPUP") {
      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        handleOutgoingCallStart(message.object);
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        handleOutgoingCallEnd();
      } else if (message.type == "REQUEST_INCOMING_CALL_START") {
        handleIncomingCallStart();
      } else if (message.type == "REQUEST_INCOMING_CALL_END") {
        handleIncomingCallEnd();
      } else if (message.type == "REQUEST_CALL_HOLD") {
        handleCallHold();
      } else if (message.type == "REQUEST_CALL_MUTE") {
        handleCallMute();
      } else if (message.type == "REQUEST_SESSION_DETAILS") {
        handleSessionDetails();
      } else {
        console.log("UNKNOWN TYPE: ", message);
      }
    }
  }

  sendEngine(message) {
    console.log("Sending from popup");
    this.channel.postMessage("Posting from popup");

    if (message.type == "INFORM_SOCKET_CONNECTED") {
      this.postHandler(message);
    } else if (message.type == "INFORM_SOCKET_DISCONNECTED") {
      this.postHandler(message);
    } else if (message.type == "INFORM_CONNECTION_ONLINE") {
      this.postHandler(message);
    } else if (message.type == "INFORM_CONNECTION_OFFLINE") {
      this.postHandler(message);
    } else if (message.type == "INFORM_INCOMING_CALL") {
      this.postHandler(message);
    } else if (message.type == "ACK_OUTGOING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "ACK_OUTGOING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "ACK_INCOMING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "ACK_INCOMING_CALL_END") {
      this.postHandler(message);
    } else if (message.type == "ACK_CALL_HOLD") {
      this.postHandler(message);
    } else if (message.type == "ACK_CALL_MUTE") {
      this.postHandler(message);
    } else if (message.type == "POPUP_CLOSED") {
      this.postHandler(message);
    } else if (message.type == "PING_SESSION_DETAILS") {
      this.postHandler(message);
    } else if (message.type == "PING_POPUP_ALIVE") {
      this.postHandler(message);
    } else if (message.type == "ACK_SESSION_DETAILS") {
      this.postHandler(message);
    }
  }

  postHandler(message) {
    this.channel.postMessage(message);
  }

  ping() {
    setInterval(() => {
      console.log("popup: pinging...");
      this.channel.postMessage(
        new Message("ALL", "POPUP", "DEBUG", "sending from popup")
      );
    }, 2500);
  }
}



class JsSIP_Wrapper {
  constructor(eventEmitter,config){
    this.eventEmitter = eventEmitter;
    this.session = 0;
    this.UserAgent = null;
    this.config = config;
    this.createAudioElement();
    this.connect();
  }

  createAudioElement(){
    console.log("called audio");
    document.body.innerHTML+='<audio id="remoteView" autoplay controls></audio>';
  }

  sample(){
    console.log('AAA');
    document.getElementById('test').innerText = 'hahaha';
  }
  
answer() {
      if (this.session) {
          this.session.answer({
              "extraHeaders": ["X-Foo: foo", "X-Bar: bar"],
              "mediaConstraints": { "audio": true, "video": false },
              "pcConfig": { rtcpMuxPolicy: "negotiate" },
              "rtcOfferConstraints": {
                  offerToReceiveAudio: 1,
                  offerToReceiveVideo: 0
              }
          });
      }
  }
decline() {
    if (this.session) {
          this.session.terminate();
    }
}
end() {
    if (this.session) {
        this.session.terminate();
    }
}

getLocalIdentity(){
  return (this.session)?this.session.local_identity:''; 
}

getRemoteIdentity(){
  return (this.session)?this.session.remote_identity:''; 
}

getStartTime(){
  return (this.session)?this.session.start_time:''; 
}

getEndTime(){
  return (this.session)?this.session.end_time:''; 
}

sessionIsInProgress(){
    return this.session.isInProgress();
}

sessionIsEstablished(){
  return this.session.isEstablished();
}

getLocalIsOnHold(){
  return (this.session)?this.session.isOnHold()['local']:false; 
}

getRemoteIsOnHold(){
  return (this.session)?this.session.isOnHold()['remote']:false; 
}

getIsOnMute(){
  return (this.session)?this.session.isMuted()['audio']:false; 
}

toggleHold(){
  if(this.session){
    (this.getLocalIsOnHold())?this.session.unhold():this.session.hold();
  }
}

toggleMute(){
  if(this.session){
    (this.getIsOnMute())?this.session.unmute():this.session.mute();
  }
}


  connect() {
      let sip = this.config.sip;
      let password = this.config.password;
      let server_address = this.config.server_address;
      let port = this.config.port;

      var configuration = {
          sockets: [
              new JsSIP.WebSocketInterface("wss://" + server_address + ":" + port)
          ],
          uri: "sip:" + sip + "@" + server_address,
          authorization_user: sip,
          password: password,
          registrar_server: "sip:" + server_address,
          session_timers: false,
          connection_recovery_max_interval: 60,
          connection_recovery_min_interval: 4

      };
      this.UserAgent = new JsSIP.UA(configuration);
      this.UserAgent.on("connected", function (event) {
        setTimeout(()=>{
          this.eventEmitter?.emit('INFORM_SOCKET_CONNECTED');
        },500);
        
      });
      this.UserAgent.on("disconnected", function (event) {
        setTimeout(()=>{
          this.eventEmitter?.emit('INFORM_SOCKET_DISCONNECTED');
        },500);
      });
      this.UserAgent.on("newRTCSession", function (e) {
          this.session = e.session;

          if(this.session.direction == 'incoming'){
            this.eventEmitter.emit('INFORM_INCOMING_CALL');
            
          }else{
            
          }
          this.session.on("accepted", function (e) {
            //this.eventEmitter.emit('');
              console.log("call accepted", e);
          });
          this.session.on("progress", function (e) {
              //(this.session.direction == 'incoming')
              console.log("call is in progress", e);
              answer();
          });
          this.session.on("confirmed", function (e) {
              this.eventEmitter.emit((this.session.direction == 'incoming')?'ACK_INCOMING_CALL_START':'ACK_OUTGOING_CALL_START');  
              console.log("call accepted/confirmed", e);
          });
          this.session.on("ended", function (e) {
            this.eventEmitter.emit((this.session.direction == 'incoming')?'ACK_INCOMING_CALL_END':'ACK_OUTGOING_CALL_END');  
            console.log("Call ended: ", e);
          });
          this.session.on("failed", function (e) {
            this.eventEmitter.emit((this.session.direction == 'incoming')?'INFORM_INCOMING_CALL_FAILED':'INFORM_OUTGOING_CALL_FAILED');  
              console.log("Call failed: ", e);
          });
          this.session.on("hold", function (e) {
            this.eventEmitter.emit('INFORM_REMOTE_HOLD');
            console.log("Call failed: ", e);
          });
          this.session.on("unhold", function (e) {
            this.eventEmitter.emit('INFORM_REMOTE_UNHOLD');
            console.log("Call failed: ", e);
          });
          this.session.on("peerconnection", function (e) {
              console.log("call peerconnection: ", e);
              e.peerconnection.onaddstream = function (e) {
                  console.log("call peerconnection addstream:", e);
                  remoteView = document.getElementById("remoteView");
                  var remoteStream = e.stream;
                  remoteView.srcObject = remoteStream;
              };
          });
      });
      this.UserAgent.start();
    }
disconnect(){
  this.UserAgent.stop();
  this.UserAgent = null;
}


call(to){
  var eventHandlers = {
    'progress':   function(data){ },
    'failed':     function(data){this.eventEmitter.emit('INFORM_OUTGOING_CALL_FAILED');},
    'confirmed':  function(data){this.eventEmitter.emit('ACK_OUTGOING_CALL_START');},
    'ended':      function(data){this.eventEmitter.emit('ACK_OUTGOING_CALL_END');}
  };
  
  var options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': {'audio': true, 'video': false},
  };
  
  this.UserAgent.call(to, options);
}

}


module.exports = {Popup: Popup};

