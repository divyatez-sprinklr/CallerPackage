// Here we need to make logic for popup alongside of jssip. 
// No need for making it object oriented . Just write it normally.
// We do can divide functions in modules for cleaniness.
const {eventEmitter,channel} = require('./popup_constants');


channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
}

setInterval(()=>{
channel.postMessage('sending from popup');
},1000);



function sendEngine(message){

}

function recieveEngine(message){

}

// JsSiP Here