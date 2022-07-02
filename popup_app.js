const {Popup} = require('./PopupCaller/popup/popup')

const popup = new Popup({sip:'1000',password:'1000_client',server_address:'18.212.171.223',port:'7443/ws'});
popup.ping();


const call_button = document.getElementById("call-button");
  call_button.onclick = () => {
   popup.JsSIP_Wrapper.eventEmitter.emit('REQUEST_OUTGOING_CALL_START');
  
  };


const end_button = document.getElementById("end-button");
  end_button.onclick = () => {
   popup.JsSIP_Wrapper.call_terminate();
  
  };
