// const {eventEmitter,channel} = require('./client_constants');




// setInterval(()=>{
// channel.postMessage('sending from client');
// },1000);

//This is parent window 
// We need to add communication listeners and emittters for dialer window to listen 
// This all need to be done in an object, so that user can instantiate it.
// Later remove constant also.


class   CallPackage{

    constructor(){
        const EventEmitter = require('events');
        this.eventEmitter = new EventEmitter();
        this.channel = new BroadcastChannel('window_popup_channel');
        this.channel.onmessage = (messageEvent) => {
            console.log(messageEvent.data);
        }
    }
    recieveEngine(message){
        console.log('Recieve Called'+message);
        if(message.to == 'ALL'){

        }
        else if(message.type == ''){

        }
        
    }

    sendEngine(message){
        console.log('Sending');
        this.channel.postMessage('Posting from obj');
    }

}


var CP = new CallPackage();

setInterval(()=>{
    CP.sendEngine("");
},1000);