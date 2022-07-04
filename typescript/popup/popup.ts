const JsSIP = require("jssip");
JsSIP.debug.enable("JsSIP:*");


// enum MESSAGE_TYPE {
//     INFORM_SOCKET_CONNECTED = 'INFORM_SOCKET_CONNECTED',
//     INFORM_SOCKET_DISCONNECTED = 'INFORM_SOCKET_DISCONNECTED',
//     ACK_OUTGOING_CALL_START = 'ACK_OUTGOING_CALL_START',
//     ACK_OUTGOING_CALL_END = 'ACK_OUTGOING_CALL_END',
//     ACK_OUTGOING_CALL_FAIL = 'ACK_OUTGOING_CALL_FAIL',
//     ACK_CALL_HOLD = 'ACK_CALL_HOLD',
//     ACK_CALL_UNHOLD = 'ACK_CALL_UNHOLD',
//     ACK_CALL_MUTE = 'ACK_CALL_MUTE',
//     ACK_CALL_UNMUTE = 'ACK_CALL_UNMUTE',
//     POPUP_CLOSED = 'POPUP_CLOSED',
//     PING_SESSION_DETAILS = 'PING_SESSION_DETAILS',
//     PING_POPUP_ALIVE = 'PING_POPUP_ALIVE',
//     ACK_SESSION_DETAILS = 'ACK_SESSION_DETAILS',
//     REQUEST_OUTGOING_CALL_START = 'REQUEST_OUTGOING_CALL_START',
//     REQUEST_OUTGOING_CALL_END = 'REQUEST_OUTGOING_CALL_END',
//     REQUEST_CALL_HOLD = 'REQUEST_CALL_HOLD',
//     REQUEST_CALL_UNHOLD = 'REQUEST_CALL_UNHOLD',
//     REQUEST_CALL_MUTE = 'REQUEST_CALL_MUTE',
//     REQUEST_CALL_UNMUTE = 'REQUEST_CALL_UNMUTE',
//     REQUEST_SESSION_DETAILS = 'REQUEST_SESSION_DETAILS',
//     REQUEST_INCOMING_CALL_END = 'REQUEST_INCOMING_CALL_END',
//     REQUEST_INCOMING_CALL_START = 'REQUEST_INCOMING_CALL_START',
// }

// enum USER{
//     PARENT = 'PARENT',
//     POPUP = 'POPUP',
//     WRAPPER = 'WRAPPER'
// }

// enum LOCAL_STORAGE{
//     is_popup_active = 'is_popup_active'
// }

// enum CHANNEL{
//     client_popup_channel = 'client_popup_channel'
// }

// interface Message {
//     to: USER;
//     from: USER;
//     type: MESSAGE_TYPE;
//     object: CALL_OBJECT;
// }

// interface CALL_OBJECT{
//     sender: string,
//     receiver: string,
//     startTime: string,
//     endTime: string,
//     hold: boolean,
//     mute: boolean,
// }

// interface CALLBACK { (): void }



// const EMPTY_CALL_OBJECT: CALL_OBJECT ={
//     sender: "",
//     receiver: "",
//     startTime: "",
//     endTime: "",
//     hold: false,
//     mute: false,
// } 


interface CONFIG{
    sip: string,
    password: string,
    server_address: string,
    port: string,
  }

class Popup {
    channel: any;
    callObject: CALL_OBJECT;
    callActive: boolean;
    JsSIP_Wrapper: JsSIP_Wrapper;
    constructor(config: CONFIG) {
        console.log("PopUp Instance Created");
        this.channel = new BroadcastChannel(CHANNEL.client_popup_channel);
        this.callActive = false;
        this.channel.onmessage = (messageEvent) => {
            this.receiveEngine(messageEvent.data);
        };
        this.JsSIP_Wrapper = new JsSIP_Wrapper(config);
  }

  connect(callback: CALLBACK):void {
    setTimeout(() => {
      this.JsSIP_Wrapper.connect(callback);
    }, 1000);
  }

  informUnload():void {
    this.JsSIP_Wrapper.call_terminate();
    this.channel.postMessage({
      to: USER.PARENT,
      from: USER.POPUP,
      type: MESSAGE_TYPE.POPUP_CLOSED,
      object: EMPTY_CALL_OBJECT,
    });
  }

  sendEngine(message: MESSAGE):void {
    this.channel.postMessage(message);
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

  handleOutgoingCallStart(callObject: CALL_OBJECT): void {
    console.log("HandleOutgoingCallStart");
    this.sendEngine({
      to: USER.WRAPPER,
      from: USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START,
      object: { receiver: callObject.receiver , sender: null, startTime: null, endTime: null, hold: null, mute: null },
    });
  }

  handleOutgoingCallEnd():void {
    console.log("handleOutgoingCallEnd");
    this.sendEngine({
      to: USER.WRAPPER,
      from: USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallHold() {
    console.log("handleCallHold");
    this.sendEngine({
      to: USER.WRAPPER,
      from:  USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_HOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallUnhold() {
    console.log("handleCallUnhold");
    this.sendEngine({
      to: USER.WRAPPER,
      from: USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_UNHOLD,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallMute() {
    console.log("handleCallMute");
    this.sendEngine({
      to: USER.WRAPPER,
      from: USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_MUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleCallUnmute() {
    console.log("handleCallUnmute");
    this.sendEngine({
      to: USER.WRAPPER,
      from: USER.POPUP,
      type: MESSAGE_TYPE.REQUEST_CALL_UNMUTE,
      object: EMPTY_CALL_OBJECT,
    });
  }

  handleSessionDetails() {
    console.log("handleSessionDetails");
    this.sendEngine({
      to: USER.PARENT,
      from: USER.POPUP,
      type: MESSAGE_TYPE.ACK_SESSION_DETAILS,
      object: this.callObject,
    });
  }

  receiveEngine(message) {
    if (message.to == USER.POPUP) {
      console.log("Recieved:", message);
      if (message.type ==  MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START) {
        this.handleOutgoingCallStart(message.object);
      } else if (message.type == MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END) {
        this.handleOutgoingCallEnd();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_HOLD) {
        this.handleCallHold();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNHOLD) {
        this.handleCallUnhold();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_MUTE) {
        this.handleCallMute();
      } else if (message.type == MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
        this.handleCallUnmute();
      } else if (message.type == MESSAGE_TYPE.REQUEST_SESSION_DETAILS) {
        this.handleSessionDetails();
      } else {
        console.log("UNKNOWN TYPE: ", message);
      }
      // }
    }
  }
}

class JsSIP_Wrapper {
    userAgent: any;
    session: any;
    config: CONFIG;
  constructor( config: CONFIG) {
    this.userAgent = null;
    this.session = null;
    this.config = config;
  }

  connect(callback: CALLBACK):void {
    let [userAgent, session] = [null, null];
    let { sip, password, server_address, port } = this.config;
    let callActive = false;
    let callObject = {
      sender: "",
      receiver: "",
      startTime: "",
      endTime: "",
      hold: false,
      mute: false,
    };

    let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
    channel.onmessage = (messageEvent) => {
      receiveEngine(messageEvent.data);
    };

    function receiveEngine(message: MESSAGE) : void{
      if (message.to == USER.WRAPPER) {
        console.log("Recieved in Wrapper:", message);
        if (message.type == MESSAGE_TYPE.REQUEST_OUTGOING_CALL_START) {
          if (callActive == true) {
          } else {
            callActive = true;
            callObject.receiver = message.object.receiver;
            call_outgoing(callObject.receiver);
          }
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_OUTGOING_CALL_END) {
          call_terminate();
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_CALL_HOLD) {
          call_hold();
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_CALL_UNHOLD) {
          call_unhold();
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_CALL_MUTE) {
          call_mute();
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_SESSION_DETAILS) {
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type:  MESSAGE_TYPE.ACK_SESSION_DETAILS,
            object: callObject,
          });
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
          call_unmute();
        } else if (message.type ==  MESSAGE_TYPE.ACK_OUTGOING_CALL_START) {
          //ring.pause();
          callObject.startTime = session.start_time;
          callObject.sender = session.local_identity;
          callObject.receiver = session.remote_identity;

          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type:  MESSAGE_TYPE.ACK_OUTGOING_CALL_START,
            object: callObject,
          });
        } else if (message.type == MESSAGE_TYPE.ACK_OUTGOING_CALL_END) {
          callObject.endTime = session.end_time;
          callActive = false;
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_OUTGOING_CALL_END,
            object: callObject,
          });
          callObject = {
            sender: "",
            receiver: "",
            startTime: "",
            endTime: "",
            hold: false,
            mute: false,
          };
          session = null;
        } else if (message.type == MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL) {
          callActive = false;
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL,
            object: callObject,
          });
          callObject = {
            sender: "",
            receiver: "",
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

    let ring = new window.Audio(
      "https://github.com/divyatez-sprinklr/CallerPackage/raw/main/CallerPackage/popup/media/abc.wav"
    );
    ring.loop = true;

    let remoteAudio = new window.Audio();
    remoteAudio.autoplay = true;

    let localView = document.getElementById("localMedia");
    let remoteView = document.getElementById("remoteMedia");

    userAgent = new JsSIP.UA(configuration);
    userAgent.start();

    const addEventListeners = () => {
      userAgent.on("newRTCSession", function (event) {
        console.log("newRTCSession", event);

        session = event.session;
        console.log("Direction: ", session.direction);

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
    };

    userAgent.on("connected", (e) => {
      setTimeout(() => {
        let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
        channel.postMessage({
          to: USER.PARENT,
          from: USER.POPUP,
          type: MESSAGE_TYPE.INFORM_SOCKET_CONNECTED,
          object: {},
        });
      }, 0);

      addEventListeners();
      callback();
      console.log("INFORM_SOCKET_CONNECTED", e.data);
    });

    userAgent.on("disconnected", (e) => {
      setTimeout(() => {
        let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
        channel.postMessage({
          to: USER.PARENT,
          from: USER.POPUP,
          type: MESSAGE_TYPE.INFORM_SOCKET_DISCONNECTED,
          object: {},
        });
      }, 0);
      console.log("INFORM_SOCKET_DISCONNECTED", e.data);
    });

    userAgent.on("newMessage", function (e) {
      e.data.message.accept();
      console.log(e);
    });

    function call_outgoing(number) {
      console.log("CALL CLICKED", number);
      ring.play();
      userAgent.call("125311" + number, {
        eventHandlers: {
          progress: function (e) {
            console.log("call is in progress");
          },
          failed: (e) => {
            setTimeout(() => {
              let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
              channel.postMessage({
                to: USER.WRAPPER,
                from: USER.WRAPPER,
                type: MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL,
                object: { object: e.data },
              });
            }, 0);
            console.log("ACK_OUTGOING_CALL_FAILED", e.data);
          },
          ended: (e) => {
            setTimeout(() => {
              let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
              channel.postMessage({
                to: USER.WRAPPER,
                from: USER.WRAPPER,
                type: MESSAGE_TYPE.ACK_OUTGOING_CALL_END,
                object: {},
              });
            }, 0);
            console.log("ACK_OUTGOING_CALL_ENDED", e.data);
          },
          confirmed: (e) => {
            setTimeout(() => {
              let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
              channel.postMessage({
                to: USER.WRAPPER,
                from: USER.WRAPPER,
                type: MESSAGE_TYPE.ACK_OUTGOING_CALL_START,
                object: {},
              });
            }, 0);
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
              //this.emitters('ACK_OUTGOING_CALL_START');
              console.log("call confirmed");
            },
          },
          pcConfig: {
            rtcpMuxPolicy: "negotiate",
            hackStripTcp: true,
            iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
            iceTransportPolicy: USER.PARENT,
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

    function addStreams():void {
      session.connection.addEventListener("addstream", function (event) {
        // incomingCallAudio.pause();
        ring.pause();
        remoteAudio.srcObject = event.stream;
        
        let local = document.getElementById("localMedia") as HTMLVideoElement;
        //////////----------ERROR HERE
        local.srcObject =session.connection.getLocalStreams()[0];

        let remote =  document.getElementById("remoteMedia") as HTMLVideoElement;
        remote.srcObject =
          session.connection.getRemoteStreams()[0];
                  //////////----------ERROR HERE

      });
    }

    function endTime() {
      return session.end_Time;
    }

    function startTime() {
      return session.startTime();
    }

    function call_hold():void {
      console.log("Request to hold caught by wrapper");
      session.hold();
      if (session.isOnHold().local) {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_HOLD,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_HOLD");
      } else {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_HOLD_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_HOLD_FAILED");
      }
    }

    function call_unhold() {
      console.log("Request to unhold caught by wrapper");
      session.unhold();
      if (!session.isOnHold().local) {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNHOLD,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNHOLD");
      } else {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNHOLD_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNHOLD_FAILED");
      }
    }

    function call_mute():void {
      console.log("Request to MUTE caught by wrapper");

      session.mute();
      if (session.isMuted().audio) {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_MUTE,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_MUTE");
      } else {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_MUTE_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_MUTE_FAILED");
      }
    }

    function call_unmute():void {
      console.log("Request to UNMUTE caught by wrapper");
      session.unmute();
      if (!session.isMuted().audio) {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNMUTE,
            object: EMPTY_CALL_OBJECT,
          });
        }, 0);
        console.log("ACK_CALL_UNMUTE");
      } else {
        setTimeout(() => {
          let channel = new BroadcastChannel(CHANNEL.client_popup_channel);
          channel.postMessage({
            to: USER.PARENT,
            from: USER.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNMUTE_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNMUTE_FAILED");
      }
      console.log("ACK_CALL_UNMUTE");
    }
  }
}

module.exports = { Popup: Popup };