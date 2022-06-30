
const {Popup} = require('./popup');

//const popup = new Popup({sip:'1000',password:'1000',server_address:'18.212.171.223',port:'7443/ws'});
const popup = new Popup({sip:'10075',password:'10075',server_address:'blr-sbc1.ozonetel.com',port:'442'});
// popup.ping();

popup.eventEmitter.on('',()=>{

});

// setTimeout(()=>{
//     console.log('Trying');
//     popup.JsSIP_Wrapper.call('sip:s13@sip13.zang.io');
// },10000);
class ConnectionChannel{
    constructor(func){
        this.connection;
        this.textChannelStream;
        this.exchange = [];
        this.offer={description:"",candidate:""};
        this.answer={description:"",candidate:""};
        this.state =0;
        this.startWebRTC(func);
        this.startOfferCreation();
        setTimeout(()=>{
            submitOffer_Answer();
        },5000);
    }


    onSuccess() {}
    onError(error) {console.error(error);};
    str(obj){return JSON.stringify(obj);};
    ustr(obj){return JSON.parse(obj);}

    startWebRTC(func) {

        this.connection = new RTCPeerConnection({
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

        this.textChannelStream = connection.createDataChannel('dataChannel');

    connection.ondatachannel= e => {

        const receiveChannel = e.channel;
        receiveChannel.onmessage =e => {
            func();
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

    sentOverDataStream(message){
        textChannelStream.send(message);
    }


    addIce(candidates){
    let messege = ustr(candidates);
    messege.forEach((item) =>{
        let candidate = JSON.parse(item);
        connection.addIceCandidate(
        new RTCIceCandidate(candidate), onSuccess, onError
        );
    }); 

    }


    createIceOffer(){
        offer.candidate = str(exchange); 
        localStorage.setItem('sdp-webrtc-offer', str(offer));
        console.log('Created Ice Offer :'+str(offer));
    }

    createIceAnswer(){
        answer.candidate = str(exchange);
        localStorage.setItem('sdp-webrtc-answer', str(answer));
        console.log('Create Ice Answer:'+str(answer));
    }

    handleLocalDescription(description) {
        connection.setLocalDescription(description);
        if(description.type==='offer'){
            offer.description = str(description); 
        }
        else{
            answer.description = str(description);
        }
    } 


    submitOffer_Answer(){
        console.log('clicked');
        let message;
        message = ustr(localStorage.getItem('sdp-webrtc-answer'));
        localStorage.setItem('sdp-webrtc-answer',null);


        if(ustr(message.description).type=='answer'&&state===1)
        {
            console.log('Got answer');
            connection.setRemoteDescription(new RTCSessionDescription(ustr(message.description)), () => {
                    addIce(message.candidate);
            });
        }
    }

    startOfferCreation(){
        console.log('Creating offer');
        state =1;
        connection.createOffer().then(handleLocalDescription).catch(onError);
        setTimeout(createIceOffer,1000);

    }

}

function callFromParent(message){
    console.log("Received"+message);
}

const channel = new ConnectionChannel(callFromParent);
channel.sentOverDataStream('Hahah From Popup');