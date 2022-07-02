/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const { throws } = require("assert");
const { Console } = require("console");
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
    // this.handleEventEmitters();
    this.eventEmitter.on('INFORM_SOCKET_CONNECTED',()=>{
      console.log('REcieved socket connected');
      this.sendEngine(new Message("ALL", "POPUP", "INFORM_SOCKET_CONNECTED", {}));
  });
  this.eventEmitter.on('INFORM_SOCKET_DISCONNECTED',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "INFORM_SOCKET_DISCONNECTED", {}));
  });
  this.eventEmitter.on('INFORM_INCOMING_CALL',()=>{
    this.callObject.sender = this.JsSIP_Wrapper.getRemoteIdentity();
    this.sendEngine(new Message("ALL", "POPUP", "INFORM_INCOMING_CALL",this.callObject));
  });
  this.eventEmitter.on('INFORM_REMOTE_HOLD',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "INFORM_REMOTE_HOLD", {}));
  });
  this.eventEmitter.on('INFORM_REMOTE_UNHOLD',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "INFORM_REMOTE_UNHOLD", {}));
  });
  this.eventEmitter.on('ACK_OUTGOING_CALL_START',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "ACK_OUTGOING_CALL_START", {}));
  });
  this.eventEmitter.on('ACK_OUTGOING_CALL_END',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "ACK_OUTGOING_CALL_END", this.callObject));
  });
  this.eventEmitter.on('ACK_INCOMING_CALL_START',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "ACK_INCOMING_CALL_START", {}));
  });
  this.eventEmitter.on('ACK_INCOMING_CALL_END',()=>{
    this.sendEngine(new Message("ALL", "POPUP", "ACK_INCOMING_CALL_END", this.callObject));
  });
    this.JsSIP_Wrapper = new JsSIP_Wrapper( this.eventEmitter,config);
    // this.JsSIP_Wrapper.sample();
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
    sender('');
    receiver('');
    startTime('');
    endTime('');
    hold(false);
    mute(false);
  }
  handleOutgoingCallStart(callObject){
      console.log('HandleOutgoingCallStart');
      this.callObject.receiver = callObject.receiver;
      this.callObject.startTime = Date.now().toString();
      this.JsSIP_Wrapper.call(this.callObject.receiver);
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
    this.JsSIP_Wrapper.putOnHold();
    this.sendEngine(new Message("ALL","POPUP","ACK_CALL_HOLD",{}));
  }

  handleCallUnhold(){
    this.JsSIP_Wrapper.putOnUnhold();
    this.sendEngine(new Message("ALL","POPUP","ACK_CALL_UNHOLD",{}));
  }

  handleCallMute(){
    this.JsSIP_Wrapper.putOnMute();
    this.sendEngine(new Message("ALL","POPUP","ACK_CALL_MUTE",{}));
  }

  handleCallUnmute(){
    this.JsSIP_Wrapper.putOnUnmute();
    this.sendEngine(new Message("ALL","POPUP","ACK_CALL_UNMUTE",{}));
  }


  handleSessionDetails(){
    this.sendEngine(new Message("ALL","POPUP","ACK_SESSION_DETAILS",this.callObject));
  }

    

  

  receiveEngine(message) {
    console.log('Recieved:',message);
    if (message.to == "ALL" || message.to == "POPUP") {
      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        this.handleOutgoingCallStart(message.object);
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        this.handleOutgoingCallEnd();
      } else if (message.type == "REQUEST_INCOMING_CALL_START") {
        this.handleIncomingCallStart();
      } else if (message.type == "REQUEST_INCOMING_CALL_END") {
        this.handleIncomingCallEnd();
      } else if (message.type == "REQUEST_CALL_HOLD") {
        this.handleCallHold();
      } else if (message.type == "REQUEST_CALL_UNHOLD") {
        this.handleCallUnhold();
      } else if (message.type == "REQUEST_CALL_MUTE") {
        this.handleCallMute();
      } else if (message.type == "REQUEST_CALL_UNMUTE") {
        this.handleCallUnmute();
      } else if (message.type == "REQUEST_SESSION_DETAILS") {
        this.handleSessionDetails();
      } else {
        console.log("UNKNOWN TYPE: ", message);
      }
    }
  }

  sendEngine(message) {
    console.log("Sending from popup");
    //this.channel.postMessage("Posting from popup");

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
    } else if (message.type == "INFORM_REMOTE_HOLD") {
      this.postHandler(message);
    } else if (message.type == "INFORM_REMOTE_UNHOLD") {
      this.postHandler(message);
    }
  }

  postHandler(message) {
    this.channel.postMessage(message);
  }

  ping() {
    // var types = ["INFORM_SOCKET_CONNECTED","INFORM_SOCKET_DISCONNECTED","INFORM_CONNECTION_ONLINE","INFORM_CONNECTION_OFFLINE","INFORM_INCOMING_CALL","ACK_OUTGOING_CALL_START","ACK_OUTGOING_CALL_END","ACK_INCOMING_CALL_START","ACK_INCOMING_CALL_END","ACK_CALL_HOLD","ACK_CALL_MUTE","POPUP_CLOSED","PING_SESSION_DETAILS","PING_POPUP_ALIVE","ACK_SESSION_DETAILS","INFORM_REMOTE_HOLD","INFORM_REMOTE_UNHOLD"]
    // let i=0;
    // setInterval(() => {
    //   i = i % types.length;
    //   console.log("popup: pinging...");
    //   this.channel.postMessage(
    //     new Message("ALL", "POPUP", types[i], "hello")
    //   );
    //   i++;
    // }, 1000);

    this.sendEngine(new Message("ALL", "POPUP", "PING_SESSION_DETAILS", this.callObject));
  }
}




class JsSIP_Wrapper {
  constructor(eventEmitter,config){
    this.eventEmitter = eventEmitter;
    this.session = 0;
    this.phone = null;
    this.config = config;
   // this.addStreamElements();
    setTimeout(()=>{
      this.connect();
    },1000)
  }

  // createAudioElement(){
  //   console.log("called audio");
  //   document.body.innerHTML+='<audio id="remoteView" autoplay controls></audio>';
  // }

  sample(){
    console.log('AAA');
    document.getElementById('test').innerText = 'hahaha';
  }
////////////////////
  
  // const JsSIP = require("JsSIP");
  
  // Debugging purpose :)
  // const redAlert = () => {
  //   document.querySelector("body").innerHTML = "";
  //   document.querySelector("body").style.backgroundColor = "darkred";
  // };
  
  //let [phone, call] = [null, null];
  
  // let [sip, password, server_address, port] = [
  //   "1000",
  //   "1000_client",
  //   "18.212.171.223",
  //   "7443/ws",
  // ];
  

  // const callOptions = {
  //   eventHandlers: {
  //     progress: function (e) {
  //       console.log("call is in progress");
  //     },
  //     failed: function (e) {
  //       console.log("call failed with cause: " + e.data);
  //     },
  //     ended: function (e) {
  //       console.log("call ended with cause: " + e.data);
  //     },
  //     confirmed: function (e) {
  //       console.log("call confirmed");
  //     },
  //   },
  //   pcConfig: {
  //     rtcpMuxPolicy: "negotiate",
  //     hackStripTcp: true,
  //     iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  //     iceTransportPolicy: "all",
  //   },
  //   mediaConstraints: {
  //     audio: true,
  //     video: false,
  //   },
  //   rtcOfferConstraints: {
  //     offerToReceiveAudio: true,
  //     offerToReceiveVideo: false,
  //   },
  // };
  
// addStreamElements(){
//   document.body.innerHTML += `
//     <video id="localMedia"
//            autoplay
//            playsinline></video>
//     <video id="remoteMedia"
//            autoplay
//            playsinline></video>
//            `;
// }

connect(){
  let [sip, password, server_address, port] = [this.config.sip,this.config.password,this.config.server_address,this.config.port];
  const configuration = {
    sockets: [
      new JsSIP.WebSocketInterface("wss://" + server_address + ":" + port),
    ],
    uri: "sip:" + sip + "@" + server_address,
    authorization_user: sip,
    password: password,
    registrar_server: "sip:" + server_address,
    no_answer_timeout: 20,
    session_timers: false,
    register: true,
    trace_sip: true,
    connection_recovery_max_interval: 30,
    connection_recovery_min_interval: 2,
  };
  // ________________________________________________________________
  
  this.incomingCallAudio = new window.Audio(
    "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav"
  );
  this.incomingCallAudio.loop = true;
  
  this.remoteAudio = new window.Audio();
  this.remoteAudio.autoplay = true;
  
  // const localView = document.getElementById("localMedia");
  // const remoteView = document.getElementById("remoteMedia");
  
  // ________________________________________________________________
  
  
  
  // ________________________________________________________________
  
  this.phone = new JsSIP.UA(configuration);
  this.phone.start();
  this.userAgentListeners();
}

addStreams() {
  this.call.connection.addEventListener("addstream", function (event) {
    incomingCallAudio.pause();

    this.remoteAudio.srcObject = event.stream;

    document.getElementById("localMedia").srcObject = session.connection.getLocalStreams()[0];
    document.getElementById("remoteMedia").srcObject = session.connection.getRemoteStreams()[0];
  });
}


callNumber(number){
  console.log("CALL CLICKED");
  let callOptions = {
    eventHandlers: {
      progress: function (e) {
        console.log("call is in progress");
      },
      failed: function (e) {
        console.log("call failed with cause: " + e.data);
      },
      ended: function (e) {
        console.log("call ended with cause: " + e.data);
      },
      confirmed: function (e) {
        console.log("call confirmed");
      },
    },
    pcConfig: {
      rtcpMuxPolicy: "negotiate",
      hackStripTcp: true,
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      iceTransportPolicy: "all",
    },
    mediaConstraints: {
      audio: true,
      video: false,
    },
    rtcOfferConstraints: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    },
  };
  this.phone.call(
    "125311" + number,
    callOptions
  );
  // setTimeout(()=>{
  // this.addStreams();
  // },2000);
}

userAgentListeners(){
 
    this.phone.on("connected", function (e) {
        console.log("connected");
    });
      
    this.phone.on("disconnected", function (e) {
        console.log("disconnected");
    });
      
    this.phone.on("newMessage", function (e) {
        e.data.message.accept();
        console.log(e);
    });
    this.phone.on("newRTCSession", function (event) {
      console.log("newRTCSession", event);
      console.log("Direction: ", event.session.direction);
    
      this.call = event.session;
      console.log(this.call);
      this.call.on("sdp", function (e) {
        console.log("call sdp: ", e.sdp);
      });
      this.call.on("accepted", function (e) {
        console.log("call accepted: ", e);
      });
      this.call.on("progress", function (e) {
        console.log("call is in progress: ", e);
      });
      this.call.on("confirmed", function (e) {
        console.log("confirmed by", e.originator);
    
        // const localStreams = call.connection.getLocalStreams();
        // console.log(
        //   "confirmed with a number of local streams",
        //   localStreams.length
        // );
    
        // const remoteStreams = call.connection.getRemoteStreams();
        // console.log(
        //   "confirmed with a number of remote streams",
        //   remoteStreams.length
        // );
    
        // let localStream = localStreams[0];
        // let dtmfSender = call.connection.createDTMFSender(
        //   localStream.getAudioTracks()[0]
        // );
        // call.sendDTMF = function (tone) {
        //   dtmfSender.insertDTMF(tone);
        // };
      });
      this.call.on("ended", function (e) {
        console.log("Call ended: ", e);
        this.terminate();
      });
      this.call.on("failed", function (e) {
        console.log("Call failed: ", e);
        this.terminate();
      });
      this.call.on("peerconnection", function (e) {
        console.log("call peerconnection: ", e);
      });
      if(this.call){
        this.call.connection.addEventListener("addstream", function (event) {
          this.incomingCallAudio.pause();
      
          this.remoteAudio.srcObject = event.stream;
      
          document.getElementById("localMedia").srcObject = session.connection.getLocalStreams()[0];
          document.getElementById("remoteMedia").srcObject = session.connection.getRemoteStreams()[0];
        });
      }
      else{
        console.log('Nahi lagaaaa..');
      }
    });
}      
  // ________________________________________________________________
  
answer() {
    if (this.call) {
        let callOptions = {
        eventHandlers: {
          progress: function (e) {
            console.log("call is in progress");
          },
          failed: function (e) {
            console.log("call failed with cause: " + e.data);
          },
          ended: function (e) {
            console.log("call ended with cause: " + e.data);
          },
          confirmed: function (e) {
            console.log("call confirmed");
          },
        },
        pcConfig: {
          rtcpMuxPolicy: "negotiate",
          hackStripTcp: true,
          iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
          iceTransportPolicy: "all",
        },
        mediaConstraints: {
          audio: true,
          video: false,
        },
        rtcOfferConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        },
      };
      
      this.call.answer(callOptions);
    }
}
  
terminate() {
    if (this.call) {
      this.call.terminate();
    }
    this.call = null;
}
  
  // ________________________________________________________________
  

  
/////////////////////















// answer() {
//       if (this.session) {
//           this.session.answer({
//               "extraHeaders": ["X-Foo: foo", "X-Bar: bar"],
//               "mediaConstraints": { "audio": true, "video": false },
//               "pcConfig": { rtcpMuxPolicy: "negotiate" },
//               "rtcOfferConstraints": {
//                   offerToReceiveAudio: 1,
//                   offerToReceiveVideo: 0
//               }
//           });
//       }
//   }
// decline() {
//     if (this.session) {
//           this.session.terminate();
//     }
// }
// end() {
//     if (this.session) {
//         this.session.terminate();
//     }
// }

// getLocalIdentity(){
//   return (this.session)?this.session.local_identity:''; 
// }

// getRemoteIdentity(){
//   return (this.session)?this.session.remote_identity:''; 
// }

// getStartTime(){
//   return (this.session)?this.session.start_time:''; 
// }

// getEndTime(){
//   return (this.session)?this.session.end_time:''; 
// }

// sessionIsInProgress(){
//     return this.session.isInProgress();
// }

// sessionIsEstablished(){
//   return this.session.isEstablished();
// }

// getLocalIsOnHold(){
//   return (this.session)?this.session.isOnHold()['local']:false; 
// }

// getRemoteIsOnHold(){
//   return (this.session)?this.session.isOnHold()['remote']:false; 
// }

// getIsOnMute(){
//   return (this.session)?this.session.isMuted()['audio']:false; 
// }

// toggleHold(){
//   if(this.session){
//     (this.getLocalIsOnHold())?this.session.unhold():this.session.hold();
//   }
// }

// putOnHold(){
//   if(this.session){
//     this.session.hold();
//     this.eventEmitter?.emit('ACK_CALL_HOLD');
//   }
// }

// putOnUnHold(){
//   if(this.session){
//     this.session.unhold();
//     this.eventEmitter?.emit('ACK_CALL_UNHOLD');
//   }
// }

// putOnMute(){
//   if(this.session){
//     this.session.mute();
//     this.eventEmitter?.emit('ACK_CALL_MUTE');

//   }
// }

// putOnUnmute(){
//   if(this.session){
//     this.session.unmute();
//     this.eventEmitter?.emit('ACK_CALL_UNMUTE');
//   }
// }


// toggleMute(){
//   if(this.session){
//     (this.getIsOnMute())?this.session.unmute():this.session.mute();
//   }
// }


// connect() {
//       let sip = this.config.sip;
//       let password = this.config.password;
//       let server_address = this.config.server_address;
//       let port = this.config.port;

//       var configuration = {
//           sockets: [
//               new JsSIP.WebSocketInterface("wss://" + server_address + ":" + port)
//           ],
//           uri: "sip:" + sip + "@" + server_address,
//           authorization_user: sip,
//           password: password,
//           registrar_server: "sip:" + server_address,
//           session_timers: false,
//           connection_recovery_max_interval: 60,
//           connection_recovery_min_interval: 4

//       };
//       this.UserAgent = new JsSIP.UA(configuration);
//       this.UserAgent.on("connected", (event) => {
//           console.log('emit socket connected');
//           (this.eventEmitter).emit('INFORM_SOCKET_CONNECTED');
//       });
      
//       this.UserAgent.on("disconnected", function (event) {
//         setTimeout(()=>{
//           this.eventEmitter?.emit('INFORM_SOCKET_DISCONNECTED');
//         },500);
//       });
//       this.UserAgent.on("newRTCSession", function (e) {
//           this.session = e.session;

//           if(this.session.direction == 'incoming'){
//             this.eventEmitter.emit('INFORM_INCOMING_CALL');
            
//           }else{
            
//           }
//           this.session.on("accepted", function (e) {
//             //this.eventEmitter.emit('');
//               console.log("call accepted", e);
//           });
//           this.session.on("progress", function (e) {
//               //(this.session.direction == 'incoming')
//               console.log("call is in progress", e);
//               this.answer();
//           });
//           this.session.on("confirmed", function (e) {
//               this.eventEmitter.emit((this.session.direction == 'incoming')?'ACK_INCOMING_CALL_START':'ACK_OUTGOING_CALL_START');  
//               console.log("call accepted/confirmed", e);
//           });
//           this.session.on("ended", function (e) {
//             this.eventEmitter.emit((this.session.direction == 'incoming')?'ACK_INCOMING_CALL_END':'ACK_OUTGOING_CALL_END');  
//           });
//           this.session.on("failed", function (e) {
//             this.eventEmitter?.emit((this.session.direction == 'incoming')?'INFORM_INCOMING_CALL_FAILED':'INFORM_OUTGOING_CALL_FAILED');  
//           });
//           this.session.on("hold", function (e) {
//             this.eventEmitter.emit('INFORM_REMOTE_HOLD');
//           });
//           this.session.on("unhold", function (e) {
//             this.eventEmitter.emit('INFORM_REMOTE_UNHOLD');
//           });
//           this.session.on("peerconnection", function (e) {
//               console.log("call peerconnection: ", e);
//               e.peerconnection.onaddstream = function (e) {
//                   console.log("call peerconnection addstream:", e);
//                   remoteView = document.getElementById("remoteView");
//                   var remoteStream = e.stream;
//                   remoteView.srcObject = remoteStream;
//               };
//           });
//       });
//       this.UserAgent.start();
//     }
// disconnect(){
//   this.UserAgent.stop();
//   this.UserAgent = null;
// }


// call(to){
//   console.log('Call Request inside JsSIP');
//   var eventHandlers = {
//     'progress':   function(data){ },
//     'failed':     function(data){this.eventEmitter?.emit('INFORM_OUTGOING_CALL_FAILED');},
//     'confirmed':  function(data){this.eventEmitter.emit('ACK_OUTGOING_CALL_START');},
//     'ended':      function(data){this.eventEmitter.emit('ACK_OUTGOING_CALL_END');}
//   };
  
//   var options = {
//     'eventHandlers': eventHandlers,
//     'mediaConstraints': {'audio': true, 'video': false},
//   };
  
//   this.UserAgent.call(to, options);
// }

}


module.exports = {Popup: Popup};



