
const {Popup} = require('./popup');

//const popup = new Popup({sip:'1000',password:'1000',server_address:'18.212.171.223',port:'7443/ws'});
const popup = new Popup({sip:'10075',password:'10075',server_address:'blr-sbc1.ozonetel.com',port:'442'});
popup.ping();

popup.eventEmitter.on('',()=>{

});