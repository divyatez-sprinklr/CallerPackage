const { CallerPackage } = require("./CallerPackage/client/client.js");

let callerPackage = new CallerPackage();



let mute ='Mute State : Unmute';
let hold ='Hold State : Unhold';
let socket ='Socket : Disconnected';
let callActive = 'CallActve : Inative';
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

callerPackage.eventEmitter.on('INFORM_SOCKET_DISCONNECTED',()=>{
  socket = 'Socket : Disconnected';
  document.getElementById('socket-info').innerText = socket;
});

callerPackage.eventEmitter.on('ACK_OUTGOING_CALL_START',()=>{
  callActive = 'CallActve : Active';
  document.getElementById('call-actve-info').innerText = callActive;
});

callerPackage.eventEmitter.on('ACK_OUTGOING_CALL_END',()=>{
  callActive = 'CallActve : Inative';
  document.getElementById('call-actve-info').innerText = callActive;
});


callerPackage.eventEmitter.on('ACK_CALL_HOLD',()=>{
  hold = 'Hold State : Hold';
  document.getElementById('hold-info').innerText = callActive;
});


callerPackage.eventEmitter.on('ACK_CALL_UNHOLD',()=>{
  hold = 'Hold State : Unhold';
  document.getElementById('hold-info').innerText = callActive;
});

callerPackage.eventEmitter.on('ACK_CALL_MUTE',()=>{
  mute = 'Mute State : Mute';
  document.getElementById('mute-info').innerText = callActive;
});

callerPackage.eventEmitter.on('ACK_CALL_UNMUTE',()=>{
  mute = 'Mute State : Unmute';
  document.getElementById('mute-info').innerText = callActive;
});

