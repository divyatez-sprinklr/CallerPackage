const {eventEmitter,channel} = require('./client_constants');


channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
}

setInterval(()=>{
channel.postMessage('sending from client');
},1000);