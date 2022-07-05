const JsSIP = require("jssip");
JsSIP.debug.enable("JsSIP:*");

import { MESSAGE_TYPE, AGENT_TYPE } from "../static/enums";
import { CLIENT_POPUP_CHANNEL } from "../static/constants";

interface MESSAGE {
    to: AGENT_TYPE;
    from: AGENT_TYPE;
    type: MESSAGE_TYPE;
    object: CALL_OBJECT;
}

interface CALL_OBJECT {
    sender?: string,
    receiver?: string,
    startTime?: string,
    endTime?: string,
    hold?: boolean,
    mute?: boolean,
}

interface CALLBACK {
  (): void
}

interface CONFIG {
    sip: string,
    password: string,
    server_address: string,
    port: string,
}

export default class JsSIP_Wrapper {
    channel: BroadcastChannel;
    userAgent: typeof JsSIP.UA;
    session: unknown;
    config: CONFIG;
    
  constructor( config: CONFIG) {
    this.channel = new BroadcastChannel(CLIENT_POPUP_CHANNEL);
    this.userAgent = null;
    this.session = null;
    this.config = config;
  }

  connect(callback: CALLBACK):void {
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

    this.channel.onmessage = (messageEvent) => {
      receiveEngine(messageEvent.data);
    };

    function receiveEngine(message: MESSAGE) : void{
      if (message.to == AGENT_TYPE.WRAPPER) {
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
            this.channel.postMessage({
                to: AGENT_TYPE.PARENT,
                from: AGENT_TYPE.POPUP,
                type:  MESSAGE_TYPE.ACK_SESSION_DETAILS,
                object: callObject,
            });
        } else if (message.type ==  MESSAGE_TYPE.REQUEST_CALL_UNMUTE) {
          call_unmute();
        } else if (message.type ==  MESSAGE_TYPE.ACK_OUTGOING_CALL_START) {
          //ring.pause();
          callObject.startTime = this.session.start_time;
          callObject.sender = this.session.local_identity;
          callObject.receiver = this.session.remote_identity;

          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type:  MESSAGE_TYPE.ACK_OUTGOING_CALL_START,
            object: callObject,
          });
        } else if (message.type == MESSAGE_TYPE.ACK_OUTGOING_CALL_END) {
          callObject.endTime = this.session.end_time;
          callActive = false;
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
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
          this.session = null;
        } else if (message.type == MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL) {
          callActive = false;
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
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
          this.session = null;
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

    let ring = new window.Audio("./media/abc.wav");
    ring.loop = true;

    let remoteAudio = new window.Audio();
    remoteAudio.autoplay = true;

    let localView = document.getElementById("localMedia");
    let remoteView = document.getElementById("remoteMedia");

    this.userAgent = new JsSIP.UA(configuration);
    this.userAgent.start();

    const addEventListeners = () => {
      this.userAgent.on("newRTCSession", function (event) {
        console.log("newRTCSession", event);

        this.session = event.session;
        console.log("Direction: ", this.session.direction);

        this.session.on("sdp", function (e) {
          console.log("call sdp: ", e.sdp);
        });
        this.session.on("accepted", function (e) {
          console.log("call accepted: ", e);
        });
        this.session.on("progress", function (e) {
          console.log("call is in progress: ", e);
        });
        this.session.on("confirmed", function (e) {
          console.log("confirmed by", e.originator);
        });
        this.session.on("ended", function (e) {
          console.log("Call ended: ", e);
          call_terminate();
        });
        this.session.on("failed", function (e) {
          console.log("Call failed: ", e);
          call_terminate();
        });
        this.session.on("peerconnection", function (e) {
          console.log("call peerconnection: ", e);
        });
      });
    };

    this.userAgent.on("connected", (e) => {
      setTimeout(() => {
        this.channel.postMessage({
          to: AGENT_TYPE.PARENT,
          from: AGENT_TYPE.POPUP,
          type: MESSAGE_TYPE.INFORM_SOCKET_CONNECTED,
          object: {},
        });
      }, 0);

      addEventListeners();
      callback();
      console.log("INFORM_SOCKET_CONNECTED", e.data);
    });

    this.userAgent.on("disconnected", (e) => {
      setTimeout(() => {
        this.channel.postMessage({
          to: AGENT_TYPE.PARENT,
          from: AGENT_TYPE.POPUP,
          type: MESSAGE_TYPE.INFORM_SOCKET_DISCONNECTED,
          object: {},
        });
      }, 0);
      console.log("INFORM_SOCKET_DISCONNECTED", e.data);
    });

    this.userAgent.on("newMessage", function (e) {
      e.data.message.accept();
      console.log(e);
    });

    function call_outgoing(number) {
      console.log("CALL CLICKED", number);
      ring.play();
      this.userAgent.call("125311" + number, {
        eventHandlers: {
          progress: function (e) {
            console.log("call is in progress");
          },
          failed: (e) => {
            setTimeout(() => {
              this.channel.postMessage({
                to: AGENT_TYPE.WRAPPER,
                from: AGENT_TYPE.WRAPPER,
                type: MESSAGE_TYPE.ACK_OUTGOING_CALL_FAIL,
                object: { object: e.data },
              });
            }, 0);
            console.log("ACK_OUTGOING_CALL_FAILED", e.data);
          },
          ended: (e) => {
            setTimeout(() => {
              this.channel.postMessage({
                to: AGENT_TYPE.WRAPPER,
                from: AGENT_TYPE.WRAPPER,
                type: MESSAGE_TYPE.ACK_OUTGOING_CALL_END,
                object: {},
              });
            }, 0);
            console.log("ACK_OUTGOING_CALL_ENDED", e.data);
          },
          confirmed: (e) => {
            setTimeout(() => {
              this.channel.postMessage({
                to: AGENT_TYPE.WRAPPER,
                from: AGENT_TYPE.WRAPPER,
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

    function call_answer():void {
      if (this.session) {
        this.session.answer({
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
            iceTransportPolicy: AGENT_TYPE.PARENT,
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
      if (this.session) {
        this.session.terminate();
      }
      this.session = null;
    }

    function addStreams():void {
      this.session.connection.addEventListener("addstream", function (event) {
        // incomingCallAudio.pause();
        ring.pause();
        remoteAudio.srcObject = event.stream;
        
        let local = document.getElementById("localMedia") as HTMLVideoElement;
        local.srcObject = this.session.connection.getLocalStreams()[0];

        let remote =  document.getElementById("remoteMedia") as HTMLVideoElement;
        remote.srcObject =
          this.session.connection.getRemoteStreams()[0];

      });
    }

    function endTime() {
      return this.session.end_Time;
    }

    function startTime() {
      return this.session.startTime();
    }

    function call_hold():void {
      console.log("Request to hold caught by wrapper");
      this.session.hold();
      if (this.session.isOnHold().local) {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_HOLD,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_HOLD");
      } else {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_HOLD_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_HOLD_FAILED");
      }
    }

    function call_unhold() {
      console.log("Request to unhold caught by wrapper");
      this.session.unhold();
      if (!this.session.isOnHold().local) {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNHOLD,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNHOLD");
      } else {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNHOLD_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNHOLD_FAILED");
      }
    }

    function call_mute(): void {
      console.log("Request to MUTE caught by wrapper");

      this.session.mute();
      if (this.session.isMuted().audio) {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_MUTE,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_MUTE");
      } else {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_MUTE_FAILED,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_MUTE_FAILED");
      }
    }

    function call_unmute():void {
      console.log("Request to UNMUTE caught by wrapper");
      this.session.unmute();
      if (!this.session.isMuted().audio) {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
            type: MESSAGE_TYPE.ACK_CALL_UNMUTE,
            object: {},
          });
        }, 0);
        console.log("ACK_CALL_UNMUTE");
      } else {
        setTimeout(() => {
          this.channel.postMessage({
            to: AGENT_TYPE.PARENT,
            from: AGENT_TYPE.POPUP,
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