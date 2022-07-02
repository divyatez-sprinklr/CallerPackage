// let connection;
// let textChannelStream;

// let offer={description:"",candidate:""};
// let answer={description:"",candidate:""};;

// function onSuccess() {};
// function onError(error) {console.error(error);};
// function str(obj){return JSON.stringify(obj);};
// function ustr(obj){return JSON.parse(obj);}

// let setupConnection = async () => {
//     startWebRTC();
// }
// let state =0;

// function startWebRTC() {

//     console.log('Starting webrtc');
//     connection = new RTCPeerConnection({
//         iceServers: [
//           {
//               urls: 'stun:stun.l.google.com:19302'
//           },
//            {
//             urls: "turn:openrelay.metered.ca:80",
//             username: "openrelayproject",
//             credential: "openrelayproject",
//            },
//           {
//             urls: "turn:openrelay.metered.ca:443",
//             username: "openrelayproject",
//             credential: "openrelayproject",
//           },
//           {
//             urls: "turn:openrelay.metered.ca:443?transport=tcp",
//             username: "openrelayproject",
//             credential: "openrelayproject",
//           },
//           {
//           url: 'turn:numb.viagenie.ca',
//           credential: 'muazkh',
//           username: 'webrtc@live.com'
//       },
//       {
//           url: 'turn:192.158.29.39:3478?transport=udp',
//           credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//           username: '28224511:1379330808'
//       },
//       {
//           url: 'turn:192.158.29.39:3478?transport=tcp',
//           credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//           username: '28224511:1379330808'
//       },
//       {
//           url: 'turn:turn.bistri.com:80',
//           credential: 'homeo',
//           username: 'homeo'
//        },
//        {
//           url: 'turn:turn.anyfirewall.com:443?transport=tcp',
//           credential: 'webrtc',
//           username: 'webrtc'
//       }
//         ],
//       });

//     textChannelStream = connection.createDataChannel('dataChannel');

//     connection.ondatachannel= e => {

//         const receiveChannel = e.channel;
//         receiveChannel.onmessage =e => {
//             console.log('Messege recived'+e.data);
//         }
//         receiveChannel.onopen = e => {
//             console.log('Established data channel');
//         }
//         receiveChannel.onclose =e => console.log("Closed Text Channel.");

//     }

//     connection.onicecandidate = (event) => {
//       if (event.candidate) {
//         exchange.push(str(event.candidate));
//       }
//     };
// }

// function sentOverDataStream(type,message){
//     textChannelStream.send(str({
//         type: type,
//         message: message
//     }));
// }

// function addIce(candidates){
//     let messege = ustr(candidates);
//      messege.forEach((item) =>{
//          let candidate = JSON.parse(item);
//          connection.addIceCandidate(
//            new RTCIceCandidate(candidate), onSuccess, onError
//          );
//      });

//  }

//  function createIceOffer(){
//      offer.candidate = str(exchange);
//      localStorage.setItem('sdp-webrtc-offer', str(offer));
//      console.log('Created Ice Offer :'+str(offer));
//  }

//  function createIceAnswer(){
//      answer.candidate = str(exchange);
//      localStorage.setItem('sdp-webrtc-answer', str(answer));
//      console.log('Create Ice Answer:'+str(answer));
//  }

//  function handleLocalDescription(description) {
//      connection.setLocalDescription(description);
//      if(description.type==='offer'){
//          offer.description = str(description);
//      }
//      else{
//          answer.description = str(description);
//      }
//  }

// function submitOffer_Answer(){
//     console.log('clicked');
//     let message;
//     if(localStorage.getItem('sdp-webrtc-offer')){
//         message = ustr(localStorage.getItem('sdp-webrtc-offer'));
//         localStorage.setItem('sdp-webrtc-offer',null);
//     }else{
//         message = ustr(localStorage.getItem('sdp-webrtc-answer'));
//         localStorage.setItem('sdp-webrtc-answer',null);
//     }

//     if(ustr(message.description).type=='offer'&&state===0)
//     {
//         state = 2;
//         connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
//             connection.createAnswer().then(handleLocalDescription).then(addIce(message.candidate));
//             setTimeout(createIceAnswer,1000);
//         });
//     }
//     else if(ustr(message.description).type=='answer'&&state===1)
//     {
//         connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
//             addIce(message.candidate);
//         });

//     }
// }

// function startOfferCreation(){
//     state =1;
//     connection.createOffer().then(handleLocalDescription).catch(onError);
//     setTimeout(createIceOffer,1000);

// }

// setupConnection();
// startOfferCreation();
// setTimeout(()=>{
//     submitOffer_Answer();
// },2000);
// setTimeout(()=>{
//     submitOffer_Answer();
// },2000);

const JsSIP = require("JsSIP");
JsSIP.debug.enable("JsSIP:*");

// Debugging purpose :)
const redAlert = () => {
  document.querySelector("body").innerHTML = "";
  document.querySelector("body").style.backgroundColor = "darkred";
};

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

const localView = document.getElementById("localMedia");
const remoteView = document.getElementById("remoteMedia");

// ________________________________________________________________

function addStreams() {
  call.connection.addEventListener("addstream", function (event) {
    incomingCallAudio.pause();

    remoteAudio.srcObject = event.stream;

    localView.srcObject = call.connection.getLocalStreams()[0];
    remoteView.srcObject = call.connection.getRemoteStreams()[0];
  });
}

// ________________________________________________________________

phone = new JsSIP.UA(configuration);
phone.start();

const call_button = document.getElementById("call-button");
call_button.onclick = () => {
  console.log("CALL CLICKED");

  phone.call(
    "125311" + document.getElementById("phone-number").value,
    callOptions
  );
  addStreams();
};

// ________________________________________________________________

phone.on("connected", function (e) {
  console.log("connected");
  call_button.disabled = false;
});

phone.on("disconnected", function (e) {
  console.log("disconnected");
});

phone.on("newMessage", function (e) {
  e.data.message.accept();
  console.log(e);
});

// ________________________________________________________________

function answer() {
  if (call) {
    call.answer(callOptions);
  }
}

function terminate() {
  if (call) {
    call.terminate();
  }
  call = null;
}

// ________________________________________________________________

phone.on("newRTCSession", function (event) {
  console.log("newRTCSession", event);
  console.log("Direction: ", event.session.direction);

  call = event.session;
  call.on("sdp", function (e) {
    console.log("call sdp: ", e.sdp);
  });
  call.on("accepted", function (e) {
    console.log("call accepted: ", e);
  });
  call.on("progress", function (e) {
    console.log("call is in progress: ", e);
  });
  call.on("confirmed", function (e) {
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
  call.on("ended", function (e) {
    console.log("Call ended: ", e);
    terminate();
  });
  call.on("failed", function (e) {
    console.log("Call failed: ", e);
    terminate();
  });
  call.on("peerconnection", function (e) {
    console.log("call peerconnection: ", e);
  });
});
