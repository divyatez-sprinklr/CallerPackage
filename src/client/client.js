const {eventEmitter,channel} = require('./client_constants');


channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
}

channel.postMessage('sending from client');
