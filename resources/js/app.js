var CallerPackage = require("../../CallerPackage/client/client.js").CallerPackage;
var cp = new CallerPackage();


document.getElementById('call').addEventListener('click',()=>{
        console.log('Calling: '+(document.getElementById('phone-number').value));
       cp.call(document.getElementById('phone-number').value); 
       (document.getElementById('phone-number').value='');            
})

document.getElementById('hangup').addEventListener('click',()=>{
    cp.endOut();
})



//cp.ping();
// cp.eventEmitter.on('DEBUG', function () {
//     console.log('Listened on parent using listener-emit');
// });

// class ConnectionChannel{
//     constructor(func){
//         this.connection;
//         this.textChannelStream;
//         this.exchange = [];
//         this.offer={description:"",candidate:""};
//         this.answer={description:"",candidate:""};
//         this.state =0;
//         this.startWebRTC();
//         this.setTimeout(()=>{
//             submitOffer_Answer();
//         },2000);

//     }


//     onSuccess() {}
//     onError(error) {console.error(error);};
//     str(obj){return JSON.stringify(obj);};
//     ustr(obj){return JSON.parse(obj);}

//     startWebRTC(func) {

//         this.connection = new RTCPeerConnection({
//         iceServers: [
//         {
//                 urls: 'stun:stun.l.google.com:19302'
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:80",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:443",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//                 urls: "turn:openrelay.metered.ca:443?transport=tcp",
//                 username: "openrelayproject",
//                 credential: "openrelayproject",
//         },
//         {
//         url: 'turn:numb.viagenie.ca',
//         credential: 'muazkh',
//         username: 'webrtc@live.com'
//         },
//         {
//         url: 'turn:192.158.29.39:3478?transport=udp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//         },
//         {
//         url: 'turn:192.158.29.39:3478?transport=tcp',
//         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//         username: '28224511:1379330808'
//         },
//         {
//         url: 'turn:turn.bistri.com:80',
//         credential: 'homeo',
//         username: 'homeo'
//         },
//         {
//         url: 'turn:turn.anyfirewall.com:443?transport=tcp',
//         credential: 'webrtc',
//         username: 'webrtc'
//         }
//         ],
//         });

//         this.textChannelStream = this.connection.createDataChannel('dataChannel');

//     this.connection.ondatachannel= e => {

//         const receiveChannel = e.channel;
//         receiveChannel.onmessage =e => {
//             func();
//         } 
//         receiveChannel.onopen = e => {
//                 console.log('Established data channel');
//         }
//         receiveChannel.onclose =e => console.log("Closed Text Channel.");

//     }

//     this.connection.onicecandidate = (event) => {
//         if (event.candidate) {
//         this.exchange.push(str(event.candidate));
//         }
//     };
//     }

//     sentOverDataStream(message){
//         this.textChannelStream.send(message);
//     }


//     addIce(candidates){
//     let messege = ustr(candidates);
//     messege.forEach((item) =>{
//         let candidate = JSON.parse(item);
//         this.connection.addIceCandidate(
//         new RTCIceCandidate(candidate), onSuccess, onError
//         );
//     }); 

//     }


//     createIceOffer(){
//         this.offer.candidate = str(exchange); 
//         localStorage.setItem('sdp-webrtc-offer', str(this.offer));
//         console.log('Created Ice Offer :'+str(offer));
//     }

//     createIceAnswer(){
//         this.answer.candidate = str(exchange);
//         localStorage.setItem('sdp-webrtc-answer', str(this.answer));
//         console.log('Create Ice Answer:'+str(answer));
//     }

//     handleLocalDescription(description) {
//         this.connection.setLocalDescription(description);
//         if(description.type==='offer'){
//             this.offer.description = str(description); 
//         }
//         else{
//             this.answer.description = str(description);
//         }
//     } 

//     submitOffer_Answer(){
//         let message;
//         message = ustr(localStorage.getItem('sdp-webrtc-offer'));
        
        
//         if(ustr(message.description).type=='offer'&&state===0)
//         {
//             console.log('Got offer, submitting it');
//               state = 2;
//               this.connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
//                     this.connection.createAnswer().then(this.handleLocalDescription).then(this.addIce(message.candidate));
//                     setTimeout(this.createIceAnswer,1000);
//               });
//         }
//     }
        

//     startOfferCreation(){
//         console.log('Creating offer');
//         state =1;
//         this.connection.createOffer().then(this.handleLocalDescription).catch(onError);
//         setTimeout(this.createIceOffer,1000);

//     }

// }

// function callFromParent(message){
//     console.log("Received"+message);
// }

// const channel = new ConnectionChannel(callFromParent);
// channel.sentOverDataStream('Hahah From Popup');