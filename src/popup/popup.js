const {eventEmitter,channel} = require('./popup_constants');


channel.onmessage = (messageEvent) => {
  console.log(messageEvent.data);
}

channel.postMessage('sending from popup');
