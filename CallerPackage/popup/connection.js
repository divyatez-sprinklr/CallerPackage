let connection;
let textChannelStream;

let offer={description:"",candidate:""};
let answer={description:"",candidate:""};;

function onSuccess() {};
function onError(error) {console.error(error);};
function str(obj){return JSON.stringify(obj);};
function ustr(obj){return JSON.parse(obj);}


let setupConnection = async () => {
    startWebRTC();
}
let state =0;

function startWebRTC() {

    console.log('Starting webrtc');
    connection = new RTCPeerConnection({
        iceServers: [
          {
              urls: 'stun:stun.l.google.com:19302'
          },
           {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
           },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
      },
      {
          url: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
      },
      {
          url: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
      },
      {
          url: 'turn:turn.bistri.com:80',
          credential: 'homeo',
          username: 'homeo'
       },
       {
          url: 'turn:turn.anyfirewall.com:443?transport=tcp',
          credential: 'webrtc',
          username: 'webrtc'
      }
        ],
      });
     
    textChannelStream = connection.createDataChannel('dataChannel');
    
    connection.ondatachannel= e => {

        const receiveChannel = e.channel;
        receiveChannel.onmessage =e => {
            console.log('Messege recived'+e.data);
        } 
        receiveChannel.onopen = e => {
            console.log('Established data channel');
        }
        receiveChannel.onclose =e => console.log("Closed Text Channel.");

    }

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        exchange.push(str(event.candidate));
      }
    };
}

function sentOverDataStream(type,message){
    textChannelStream.send(str({
        type: type,
        message: message
    }));
}


function addIce(candidates){
    let messege = ustr(candidates);
     messege.forEach((item) =>{
         let candidate = JSON.parse(item);
         connection.addIceCandidate(
           new RTCIceCandidate(candidate), onSuccess, onError
         );
     }); 

 }


 function createIceOffer(){
     offer.candidate = str(exchange); 
     localStorage.setItem('sdp-webrtc-offer', str(offer));
     console.log('Created Ice Offer :'+str(offer));
 }

 function createIceAnswer(){
     answer.candidate = str(exchange);
     localStorage.setItem('sdp-webrtc-answer', str(answer));
     console.log('Create Ice Answer:'+str(answer));
 }

 function handleLocalDescription(description) {
     connection.setLocalDescription(description);
     if(description.type==='offer'){
         offer.description = str(description); 
     }
     else{
         answer.description = str(description);
     }
 } 


function submitOffer_Answer(){
    console.log('clicked');
    let message;
    if(localStorage.getItem('sdp-webrtc-offer')){
        message = ustr(localStorage.getItem('sdp-webrtc-offer'));
        localStorage.setItem('sdp-webrtc-offer',null);
    }else{
        message = ustr(localStorage.getItem('sdp-webrtc-answer'));
        localStorage.setItem('sdp-webrtc-answer',null);
    }

    if(ustr(message.description).type=='offer'&&state===0)
    {
        state = 2;
        connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
            connection.createAnswer().then(handleLocalDescription).then(addIce(message.candidate));
            setTimeout(createIceAnswer,1000);
        });
    }
    else if(ustr(message.description).type=='answer'&&state===1)
    {
        connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
            addIce(message.candidate);
        });

    }
}

function startOfferCreation(){
    state =1;
    connection.createOffer().then(handleLocalDescription).catch(onError);
    setTimeout(createIceOffer,1000);

}

setupConnection();
startOfferCreation();
setTimeout(()=>{
    submitOffer_Answer();
},2000);
setTimeout(()=>{
    submitOffer_Answer();
},2000);




