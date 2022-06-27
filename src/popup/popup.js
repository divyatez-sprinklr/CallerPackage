const {eventEmitter,channel} = require('./popup_constants');


channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
}

setInterval(()=>{
channel.postMessage('sending from popup');
},1000);