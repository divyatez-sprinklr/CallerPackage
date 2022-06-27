const {eventEmitter} = require('./client_constants');


let connectionStream = new BroadcastChannel('popup_channel');


connectionStream.onmessage = (messageEvent) => {

}

