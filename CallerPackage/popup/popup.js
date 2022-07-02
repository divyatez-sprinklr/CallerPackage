/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const { Console } = require("console");
const EventEmitter = require("events");
const JsSIP = require('jssip');
JsSIP.debug.enable("JsSIP:*");

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
    // this.eventEmitter.on('INFORM_SOCKET_DISCONNECTED',()=>{
    //   this.sendEngine(new Message("ALL", "POPUP", "INFORM_SOCKET_DISCONNECTED", {}));
    // });
    // this.eventEmitter.on('INFORM_INCOMING_CALL',()=>{
    //   this.callObject.sender = this.JsSIP_Wrapper.getRemoteIdentity();
    //   this.sendEngine(new Message("ALL", "POPUP", "INFORM_INCOMING_CALL",this.callObject));
    // });
    // this.eventEmitter.on('INFORM_REMOTE_HOLD',()=>{
    //   this.sendEngine(new Message("ALL", "POPUP", "INFORM_REMOTE_HOLD", {}));
    // });
    // this.eventEmitter.on('INFORM_REMOTE_UNHOLD',()=>{
    //   this.sendEngine(new Message("ALL", "POPUP", "INFORM_REMOTE_UNHOLD", {}));
    // });
    this.eventEmitter.on('ACK_OUTGOING_CALL_START',()=>{
      this.sendEngine(new Message("ALL", "POPUP", "ACK_OUTGOING_CALL_START", {}));
    });
    this.eventEmitter.on('ACK_OUTGOING_CALL_END',()=>{
      this.sendEngine(new Message("ALL", "POPUP", "ACK_OUTGOING_CALL_END", this.callObject));
    });
    // this.eventEmitter.on('ACK_INCOMING_CALL_START',()=>{
    //   this.sendEngine(new Message("ALL", "POPUP", "ACK_INCOMING_CALL_START", {}));
    // });
    // this.eventEmitter.on('ACK_INCOMING_CALL_END',()=>{
    //   this.sendEngine(new Message("ALL", "POPUP", "ACK_INCOMING_CALL_END", this.callObject));
    // });
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
    this.eventEmitter.emit('hello');
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
      this.JsSIP_Wrapper.callObject = this.callObject;
      console.log('Emitting request');
      this.eventEmitter.emit('REQUEST_OUTGOING_CALL_START');
  }
  
  handleOutgoingCallEnd(){
    console.log('handleOutgoingCallEnd');
    // this.callObject.startTime = callObject.getStartTime();
    // this.callObject.endTime = callObject.getEndTime();;
    this.eventEmitter.emit('REQUEST_OUTGOING_CALL_END');
  }

  // handleIncomingCallStart(){
  //   this.JsSIP_Wrapper.answer();
  //   this.callObject.to = this.JsSIP_Wrapper.getRemoteIdentity();
  // }

  // handleIncomingCallEnd(){
  //   this.callObject.startTime = callObject.getStartTime();
  //   this.callObject.endTime = callObject.getEndTime();;
  //   this.JsSIP_Wrapper.end();
  // }


  // handleCallHold(){
  //   this.JsSIP_Wrapper.putOnHold();
  //   this.sendEngine(new Message("ALL","POPUP","ACK_CALL_HOLD",{}));
  // }

  // handleCallUnhold(){
  //   this.JsSIP_Wrapper.putOnUnhold();
  //   this.sendEngine(new Message("ALL","POPUP","ACK_CALL_UNHOLD",{}));
  // }

  // handleCallMute(){
  //   this.JsSIP_Wrapper.putOnMute();
  //   this.sendEngine(new Message("ALL","POPUP","ACK_CALL_MUTE",{}));
  // }

  // handleCallUnmute(){
  //   this.JsSIP_Wrapper.putOnUnmute();
  //   this.sendEngine(new Message("ALL","POPUP","ACK_CALL_UNMUTE",{}));
  // }


  // handleSessionDetails(){
  //   this.sendEngine(new Message("ALL","POPUP","ACK_SESSION_DETAILS",this.callObject));
  // }

    

  

  receiveEngine(message) {
    console.log('Recieved:',message);
    if (message.to == "ALL" || message.to == "POPUP") {
      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        this.handleOutgoingCallStart(message.object);
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        this.handleOutgoingCallEnd();
      } 
      // else if (message.type == "REQUEST_INCOMING_CALL_START") {
      //   this.handleIncomingCallStart();
      // } else if (message.type == "REQUEST_INCOMING_CALL_END") {
      //   this.handleIncomingCallEnd();
      // } else if (message.type == "REQUEST_CALL_HOLD") {
      //   this.handleCallHold();
      // } else if (message.type == "REQUEST_CALL_UNHOLD") {
      //   this.handleCallUnhold();
      // } else if (message.type == "REQUEST_CALL_MUTE") {
      //   this.handleCallMute();
      // } else if (message.type == "REQUEST_CALL_UNMUTE") {
      //   this.handleCallUnmute();
      // } else if (message.type == "REQUEST_SESSION_DETAILS") {
      //   this.handleSessionDetails();
      // } 
      else {
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
    } 
    // else if (message.type == "INFORM_CONNECTION_OFFLINE") {
    //   this.postHandler(message);
    // } else if (message.type == "INFORM_INCOMING_CALL") {
    //   this.postHandler(message);
    // } 
    else if (message.type == "ACK_OUTGOING_CALL_START") {
      this.postHandler(message);
    } else if (message.type == "ACK_OUTGOING_CALL_END") {
      this.postHandler(message);
    } 
    // else if (message.type == "ACK_INCOMING_CALL_START") {
    //   this.postHandler(message);
    // } else if (message.type == "ACK_INCOMING_CALL_END") {
    //   this.postHandler(message);
    // } else if (message.type == "ACK_CALL_HOLD") {
    //   this.postHandler(message);
    // } else if (message.type == "ACK_CALL_MUTE") {
    //   this.postHandler(message);
    // } else if (message.type == "POPUP_CLOSED") {
    //   this.postHandler(message);
    // } else if (message.type == "PING_SESSION_DETAILS") {
    //   this.postHandler(message);
    // } else if (message.type == "PING_POPUP_ALIVE") {
    //   this.postHandler(message);
    // } else if (message.type == "ACK_SESSION_DETAILS") {
    //   this.postHandler(message);
    // } else if (message.type == "INFORM_REMOTE_HOLD") {
    //   this.postHandler(message);
    // } else if (message.type == "INFORM_REMOTE_UNHOLD") {
    //   this.postHandler(message);
    // }
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
    console.log('Pinging');
    this.sendEngine(new Message("ALL", "POPUP", "PING_SESSION_DETAILS", this.callObject));
  }
}




class JsSIP_Wrapper {
  constructor(eventEmitter,config){
    this.eventEmitter = eventEmitter;
    this.session = 0;
    this.userAgent = null;
    this.session = null;
    this.config = config;
    this.incomingCallAudio = null;
    this.remoteAudio = null;
    this.remoteView = null;
    this.localView = null;
    this.callObject = {
      sender: "",
      receiver: "4153260912",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
    };
    this.eventEmitter.on('hello',()=>{
      console.log('Hello');
    })
    setTimeout(()=>{
      this.connect();
    },1000)
  }


  connect(){
  const JsSIP = require("JsSIP");
  JsSIP.debug.enable("JsSIP:*");
  let session;
  // Debugging purpose :)
  let [phone, call] = [null, null];
  
  let [sip, password, server_address, port] = [
    "1000",
    "1000_client",
    "18.212.171.223",
    "7443/ws",
  ];
  
  const callOptions = {
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
  
  let incomingCallAudio = new window.Audio(
    "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav"
  );
  incomingCallAudio.loop = true;
  
  let remoteAudio = new window.Audio();
  remoteAudio.autoplay = true;
  
  let localView = document.getElementById("localMedia");
  let remoteView = document.getElementById("remoteMedia");
  
  // ________________________________________________________________
  
  // function addStreams() {
  //   session.connection.addEventListener("addstream", function (event) {
  //     incomingCallAudio.pause();
  
  //     remoteAudio.srcObject = event.stream;
  
  //     localView.srcObject = session.connection.getLocalStreams()[0];
  //     remoteView.srcObject = session.connection.getRemoteStreams()[0];
  //   });
  // }
  
  // ________________________________________________________________
  
  let userAgent = new JsSIP.UA(configuration);
  userAgent.start();
  

  
  // ________________________________________________________________
  
  userAgent.on("connected", function (e) {
   // this.eventEmitter.emit('INFORM_SOCKET_CONNECTED');
    console.log("connected");
    //call_button.disabled = false;
  });
  
  userAgent.on("disconnected", function (e) {
    //this.eventEmitter.emit('INFORM_SOCKET_DISCONNECTED');
    console.log("disconnected");
  });
  
  userAgent.on("newMessage", function (e) {
    e.data.message.accept();
    console.log(e);
  });
  
  // ________________________________________________________________
  
 
  
  // ________________________________________________________________
  
  userAgent.on("newRTCSession", function (event) {
    console.log("newRTCSession", event);
    console.log("Direction: ", event.session.direction);
  
    session = event.session;
    session.on("sdp", function (e) {
      console.log("call sdp: ", e.sdp);
    });
    session.on("accepted", function (e) {
      console.log("call accepted: ", e);
    });
    session.on("progress", function (e) {
      console.log("call is in progress: ", e);
    });
    session.on("confirmed", function (e) {
      console.log("confirmed by", e.originator);
    });
    session.on("ended", function (e) {
      console.log("Call ended: ", e);
      call_terminate();
    });
    session.on("failed", function (e) {
      console.log("Call failed: ", e);
      call_terminate();
    });
    session.on("peerconnection", function (e) {
      console.log("call peerconnection: ", e);
    });
  });

  function call_outgoing(number) {
    console.log("CALL CLICKED");
    userAgent.call(
      "125311" + number,
      {
        eventHandlers: {
          progress: function (e) {
            console.log("call is in progress");
          },
          failed: function (e) {
            console.log("call failed with cause: " + e.data);
          },
          ended: function (e){
            console.log("call ended with cause: " + e.data);
            //this.eventEmitter.emit('ACK_OUTGOING_CALL_END');
          },
          confirmed: function (e) {
           // this.eventEmitter.emit('ACK_OUTGOING_CALL_START');
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
      }
    );    
    addStreams();
   //addStreams();
  }
  
  function call_answer() {
    if (session) {
      session.answer({
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
      });
    }
  }
  
  function call_terminate() {
    if (session) {
      session.terminate();
    }
    session = null;
  }
  
  function addStreams() {
    session.connection.addEventListener("addstream", function (event) {
      incomingCallAudio.pause();
  
      remoteAudio.srcObject = event.stream;
  
      document.getElementById("localMedia").srcObject = session.connection.getLocalStreams()[0];
      document.getElementById("remoteMedia").srcObject = session.connection.getRemoteStreams()[0];
    });
  }

  this.eventEmitter.on('REQUEST_OUTGOING_CALL_START',()=>{
    console.log('Request to call caught by wrapper');
    call_outgoing(this.callObject.receiver);
  })

  this.eventEmitter.on('REQUEST_OUTGOING_CALL_END',()=>{
    call_terminate();
  })

  // this.eventEmitter.on('REQUEST_INCOMING_CALL_START',()=>{
  //   call_answer();
  // })

  // this.eventEmitter.on('REQUEST_INCOMING_CALL_END',()=>{
  //   call_terminate();
  // })

}


}


module.exports = {Popup: Popup};



