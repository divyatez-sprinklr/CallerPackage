/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const EventEmitter = require("events");
const JsSIP = require("jssip");
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
    console.log("PopUp Instance Created");
    this.eventEmitter = new EventEmitter();
    this.channel = new BroadcastChannel("client_popup_channel");

    this.channel.onmessage = (messageEvent) => {
      this.receiveEngine(messageEvent.data);
    };

    this.JsSIP_Wrapper = new JsSIP_Wrapper(this.eventEmitter, config);
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

  resetCallObject() {
    sender("");
    receiver("");
    startTime("");
    endTime("");
    hold(false);
    mute(false);
  }

  handleOutgoingCallStart(callObject) {
    console.log("HandleOutgoingCallStart");
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_OUTGOING_CALL_START',object:{receiver: callObject.receiver}});
  }

  handleOutgoingCallEnd() {
    console.log("handleOutgoingCallEnd");
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_OUTGOING_CALL_END',object:{}});
  }


  handleCallHold(){
    console.log('handleCallHold');
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_CALL_HOLD',object:{}});
  }

  handleCallUnhold(){
    console.log('handleCallUnhold');
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_CALL_UNHOLD',object:{}});
  }

  handleCallMute(){
    console.log('handleCallMute');
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_CALL_MUTE',object:{}});
  }

  handleCallUnmute(){
    console.log('handleCallUnmute');
    this.channel.postMessage({to:'WRAPPER',from:'POPUP',type:'REQUEST_CALL_UNMUTE',object:{}});
  }

  handleSessionDetails(){
    console.log('handleSessionDetails');
    this.sendEngine(new Message("PARENT","POPUP","ACK_SESSION_DETAILS",this.callObject));
  }

  receiveEngine(message) {
    if (message.to == "POPUP") {
      console.log("Recieved:", message);
      if (message.type == "REQUEST_OUTGOING_CALL_START") {
        this.handleOutgoingCallStart(message.object);
      } else if (message.type == "REQUEST_OUTGOING_CALL_END") {
        this.handleOutgoingCallEnd();
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
   // }
    }
  }
}

class JsSIP_Wrapper {
  constructor(eventEmitter, config) {
    this.eventEmitter = eventEmitter;
    this.session = 0;
    this.userAgent = null;
    this.session = null;
    this.config = config;
    this.incomingCallAudio = null;
    this.remoteAudio = null;
    this.remoteView = null;
    this.localView = null;
    setTimeout(() => {
      this.connect();
    }, 1000);
    setInterval(() => {
      let channel = new BroadcastChannel("client_popup_channel");
      channel.postMessage(new Message('PARENT','POPUP',"PING_POPUP_ALIVE",{}));
    },10000);
  }

  


  connect() {
    const JsSIP = require("JsSIP");
    JsSIP.debug.enable("JsSIP:*");
    let session;
    let [phone, call] = [null, null];
    let [sip, password, server_address, port] = [
      "1000",
      "1000_client",
      "18.212.171.223",
      "7443/ws",
    ];

    let callObject = {
        sender: "",
        receiver: "4157614983",
        startTime: "",
        endTime: "",
        hold: false,
        mute: false,
    };

    let channel = new BroadcastChannel("client_popup_channel");
    channel.onmessage = (messageEvent) => {
      receiveEngine(messageEvent.data);
    };

    function receiveEngine(message) {
      if (message.to == "WRAPPER") {
        console.log("Recieved in Wrapper:", message);
        if(message.type == "REQUEST_OUTGOING_CALL_START"){
          callObject.receiver = message.object.receiver;
          call_outgoing(callObject.receiver);
        }else if(message.type == "REQUEST_OUTGOING_CALL_END"){
          call_terminate();
        }else if(message.type == "REQUEST_CALL_HOLD"){
          call_hold();
        }else if(message.type == "REQUEST_CALL_UNHOLD"){
          call_unhold();
        }else if(message.type == "REQUEST_CALL_MUTE"){
          call_mute();
        }else if(message.type == "REQUEST_CALL_UNMUTE"){
          call_unmute();
        }else if (message.type == "ACK_OUTGOING_CALL_START") {
          callObject.startTime = session.start_time;
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_OUTGOING_CALL_START',object:callObject});
        } else if (message.type == "ACK_OUTGOING_CALL_END") {
          callObject.endTime = session.end_time;
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_OUTGOING_CALL_END',object:callObject});
          callObject = {
            sender: "",
            receiver: "4157614983",
            startTime: "",
            endTime: "",
            hold: false,
            mute: false,
          };
          session = null;
        } else {
          console.log("UNKNOWN TYPE: ", message);
        }
     // }
      }
    }


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
        iceTransportPolicy: "PARENT",
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

    let userAgent = new JsSIP.UA(configuration);
    userAgent.start();
    

    userAgent.on("connected",  (e) => {
      
      setTimeout(()=>{
        let channel = new BroadcastChannel("client_popup_channel");
        channel.postMessage({to:'PARENT',from:'POPUP',type:'INFORM_SOCKET_CONNECTED',object:{}});
      },0);
      console.log("INFORM_SOCKET_CONNECTED",e.data);
    });

    userAgent.on("disconnected",  (e) => {
      setTimeout(()=>{
        let channel = new BroadcastChannel("client_popup_channel");
        channel.postMessage({to:'PARENT',from:'POPUP',type:'INFORM_SOCKET_DISCONNECTED',object:{}});
      },0);
      console.log("INFORM_SOCKET_DISCONNECTED",e.data);
    });

    userAgent.on("newMessage", function (e) {
      e.data.message.accept();
      console.log(e);
    });


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
      console.log("CALL CLICKED",number);
      
      userAgent.call("125311" + number, {
        eventHandlers: {
          progress: function (e) {
            console.log("call is in progress");
          },
          failed: (e) => {
            setTimeout(()=>{
              let channel = new BroadcastChannel("client_popup_channel");
              channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_OUTGOING_CALL_FAIL',object:{object: e.data}});
            },0);
            console.log("ACK_OUTGOING_CALL_FAILED",e.data);
          },
          ended: (e) => {
            setTimeout(()=>{
              let channel = new BroadcastChannel("client_popup_channel");
              channel.postMessage({to:'WRAPPER',from:'WRAPPER',type:'ACK_OUTGOING_CALL_END',object:{}});
            },0);
            console.log("ACK_OUTGOING_CALL_ENDED",e.data);
          },
          confirmed:(e) => {
            setTimeout(()=>{
              let channel = new BroadcastChannel("client_popup_channel");
              channel.postMessage({to:'WRAPPER',from:'WRAPPER',type:'ACK_OUTGOING_CALL_START',object:{}});
            },0);
            console.log("ACK_OUTGOING_CALL_STARTED");
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
      addStreams();
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
            confirmed: (e) => {
              this.eventEmitter.emit('ACK_OUTGOING_CALL_START');
              //this.emitters('ACK_OUTGOING_CALL_START');
              console.log("call confirmed");
            },
          },
          pcConfig: {
            rtcpMuxPolicy: "negotiate",
            hackStripTcp: true,
            iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
            iceTransportPolicy: "PARENT",
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

        document.getElementById("localMedia").srcObject =
          session.connection.getLocalStreams()[0];
        document.getElementById("remoteMedia").srcObject =
          session.connection.getRemoteStreams()[0];
      });
    }


    function endTime(){
      return session.end_Time;
    }

    function startTime(){
      return session.startTime();
    }

    function call_hold(){
      console.log("Request to hold caught by wrapper");
      session.hold();
      if(session.isOnHold().local){
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_HOLD',object:{}});
        },0);
        console.log("ACK_CALL_HOLD");
      }else{
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_HOLD_FAILED',object:{}});
        },0);
        console.log("ACK_CALL_HOLD_FAILED");
      }
    }

    function call_unhold(){
      console.log("Request to unhold caught by wrapper");
      session.unhold();
      if(!session.isOnHold().local){
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_UNHOLD',object:{}});
        },0);
        console.log("ACK_CALL_UNHOLD");
      }else{
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_UNHOLD_FAILED',object:{}});
        },0);
        console.log("ACK_CALL_UNHOLD_FAILED");
      }
    }

    function call_mute(){
      console.log("Request to MUTE caught by wrapper");
      
      session.mute();
      if(session.isMuted().audio){
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_MUTE',object:{}});
        },0);
        console.log("ACK_CALL_MUTE");
      }else{
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_MUTE_FAILED',object:{}});
        },0);
        console.log("ACK_CALL_MUTE_FAILED");
      }
    }

    function call_unmute(){
      console.log("Request to UNMUTE caught by wrapper");
      session.unmute();
      if(!session.isMuted().audio){
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_UNMUTE',object:{}});
        },0);
        console.log("ACK_CALL_UNMUTE");
      }else{
        setTimeout(()=>{
          let channel = new BroadcastChannel("client_popup_channel");
          channel.postMessage({to:'PARENT',from:'POPUP',type:'ACK_CALL_UNMUTE_FAILED',object:{}});
        },0);
        console.log("ACK_CALL_UNMUTE_FAILED");
      }
      console.log("ACK_CALL_UNMUTE");
    } 

  
    // this.eventEmitter.on("REQUEST_CALL_MUTE", () => {
      
    // });

    // this.eventEmitter.on("REQUEST_CALL_UNMUTE", () => {
      
    // });

    // this.eventEmitter.on("REQUEST_OUTGOING_CALL_START", () => {
    //   console.log("Request to call caught by wrapper");
    //   call_outgoing(callObject.receiver);
    // });

    // this.eventEmitter.on("REQUEST_OUTGOING_CALL_END", () => {
    //   call_terminate();
    // });

    // this.eventEmitter.on('REQUEST_INCOMING_CALL_START',()=>{
    //   call_answer();
    // })

    // this.eventEmitter.on('REQUEST_INCOMING_CALL_END',()=>{
    //   call_terminate();
    // })
  }
}

module.exports = { Popup: Popup };
