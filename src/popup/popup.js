/* Here we need to make logic for popup alongside of jsSip. 
No need for making it object oriented . Just write it normally.
We do can divide functions in modules for cleanliness. */

// const {eventEmitter,channel} = require('./popup_constants');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const channel = new BroadcastChannel('window_popup_channel');

// same shit with fancy name
function postHandler(message) {
    this.channel.postMessage(message);
}

// jobless pinging
setInterval(() => {
channel.postMessage('sending from popup');
},1000);

// still unhandled
channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
  receiveEngine(messageEvent.data);
}

// mostly blank
function receiveEngine(message) {
    console.log('Receive Called: ' + message);

    if(message.to == 'ALL' || message.to == 'POPUP'){
        if(message.type == 'REQUEST_OUTGOING_CALL_START'){
        }
        else if(message.type == 'REQUEST_OUTGOING_CALL_END'){
        }
        else if(message.type == 'REQUEST_INCOMING_CALL_START'){
        }
        else if(message.type == 'REQUEST_INCOMING_CALL_END'){
        }
        else if(message.type == 'REQUEST_CALL_HOLD'){
        }
        else if(message.type == 'REQUEST_CALL_MUTE'){
        }
        else if(message.type == 'REQUEST_SESSION_DETAILS'){
        }
    }
}

// mostly blank
function sendEngine(message){
    console.log('Sending from popup');
    channel.postMessage('Posting from popup');

    if (message.type == 'INFORM_SOCKET_CONNECTED'){
    postHandler(message);
    }
    else if (message.type == 'INFORM_SOCKET_DISCONNECTED'){
    postHandler(message);
    }
    else if (message.type == 'INFORM_CONNECTION_ONLINE'){
    postHandler(message);
    }
    else if (message.type == 'INFORM_CONNECTION_OFFLINE'){
    postHandler(message);
    }
    else if (message.type == 'INFORM_INCOMING_CALL'){
    postHandler(message);
    }
    else if(message.type == 'ACK_OUTGOING_CALL_START'){
    postHandler(message);
    }
    else if(message.type == 'ACK_OUTGOING_CALL_END'){
    postHandler(message);
    }
    else if(message.type == 'ACK_INCOMING_CALL_START'){
    postHandler(message);
    }
    else if(message.type == 'ACK_INCOMING_CALL_END'){
    postHandler(message);
    }
    else if(message.type == 'ACK_CALL_HOLD'){
    postHandler(message);
    }
    else if(message.type == 'ACK_CALL_MUTE'){
    postHandler(message);
    }
    else if(message.type == 'POPUP_CLOSED'){
    postHandler(message);
    }
    else if(message.type == 'PING_SESSION_DETAILS'){
    postHandler(message);
    }
    else if(message.type == 'PING_POPUP_ALIVE'){
    postHandler(message);
    }
    else if(message.type == 'ACK_SESSION_DETAILS'){
    postHandler(message);
    }
    else {
        console.log('UNKNOWN TYPE: ', message);
    }
}

// JsSiP Here
