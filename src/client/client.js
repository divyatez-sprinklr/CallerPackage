// const {eventEmitter,channel} = require('./client_constants');




// setInterval(()=>{
// channel.postMessage('sending from client');
// },1000);

//This is parent window 
// We need to add communication listeners and emittters for dialer window to listen 
// This all need to be done in an object, so that user can instantiate it.
// Later remove constant also.


class CallPackage{

    constructor(){
        const EventEmitter = require('events');
        this.eventEmitter = new EventEmitter();
        this.channel = new BroadcastChannel('window_popup_channel');
        this.channel.onmessage = (messageEvent) => {
            console.log(messageEvent.data);
        }
    }
    receiveEngine(message){
        console.log('Receive Called'+message);
        if(message.to == 'ALL'){
            if(message.type == 'INFORM_SOCKET_CONNECTED'){

            }
            else if(message.type == 'INFORM_SOCKET_DISCONNECTED'){

            }
            else if(message.type == 'INFORM_CONNECTION_ONLINE'){

            }
            else if(message.type == 'INFORM_CONNECTION_OFFLINE'){

            }
            else if(message.type == 'ACK_OUTGOING_CALL_START'){

            }
            else if(message.type == 'ACK_OUTGOING_CALL_END'){

            }
            else if(message.type == 'INFORM_INCOMING_CALL'){

            }
            else if(message.type == 'ACK_INCOMING_CALL_START'){

            }
            else if(message.type == 'ACK_INCOMING_CALL_END'){

            }
            else if(message.type == 'ACK_CALL_HOLD'){

            }
            else if(message.type == 'ACK_CALL_MUTE'){

            }
            else if(message.type == 'POPUP_CLOSED'){

            }
            else if(message.type == 'PING_SESSION_DETAILS'){

            }
            else if(message.type == 'PING_POPUP_ALIVE'){

            }
            else if(message.type == 'ACK_SESSION_DETAILS'){

            }
            else {
                console.log('UNKNOWN TYPE: ', message);
            }
            
        }
        
    }
        
    sendEngine(message){
        console.log('Sending');
        this.channel.postMessage('Posting from obj');
        
        if(message.type == 'REQUEST_OUTGOING_CALL_START'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_OUTGOING_CALL_END'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_INCOMING_CALL_START'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_INCOMING_CALL_END'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_CALL_HOLD'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_CALL_MUTE'){
            this.postHandler(message);
        }
        else if(message.type == 'REQUEST_SESSION_DETAILS'){
            this.postHandler(message);
        }

    }

    postHandler(message) {
        this.channel.postMessage(message);
    }

}


var CP = new CallPackage();

setInterval(()=>{
    CP.sendEngine("");
},1000);