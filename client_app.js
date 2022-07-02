const { CallerPackage } = require("./CallerPackage/client/client.js");

let callerPackage = new CallerPackage();



let mute ='Mute State : Unmute';
let hold ='Hold State : Unhold';
let socket ='Socket : Disconnected';

document.getElementById('socket-info').innerText = socket;
document.getElementById('mute-info').innerText = hold;
document.getElementById('hold-info').innerText = mute;


document.getElementById("call").addEventListener("click", () => {
  callerPackage.call("6285004633");
});

document.getElementById("hangup").addEventListener("click", () => {
  callerPackage.endOut();
});


document.getElementById("hold").addEventListener("click", () => {
  callerPackage.hold();
});

document.getElementById("unhold").addEventListener("click", () => {
  callerPackage.unhold();
});

document.getElementById("mute").addEventListener("click", () => {
  callerPackage.mute();
});

document.getElementById("unmute").addEventListener("click", () => {
  callerPackage.unmute();
});




callerPackage.eventEmitter.on('INFORM_SOCKET_CONNECTED',()=>{
      socket = 'Socket : Connected';
      document.getElementById('socket-info').innerText = socket;
});


callerPackage.eventEmitter.on('',()=>{

});