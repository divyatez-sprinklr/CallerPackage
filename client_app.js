const { CallerPackage } = require("./CallerPackage/client/client.js");

let callerPackage = new CallerPackage();

let mute = "Mute State : Unmute";
let hold = "Hold State : Unhold";
let socket = "Socket : Disconnected";
let callActive = "CallActve : Inative";
document.getElementById("socket-info").innerText = socket;
document.getElementById("mute-info").innerText = hold;
document.getElementById("hold-info").innerText = mute;

const connect_button = document.getElementById("connect");
const call_button = document.getElementById("call");
const hangup_button = document.getElementById("hangup");
const mute_button = document.getElementById("mute");
const unmute_button = document.getElementById("unmute");
const hold_button = document.getElementById("hold");
const unhold_button = document.getElementById("unhold");

const toggleButtonState = (value) => {
  call_button.disabled = !value;
  hangup_button.disabled = !value;
  mute_button.disabled = !value;
  unmute_button.disabled = !value;
  hold_button.disabled = !value;
  unhold_button.disabled = !value;
};

connect_button.addEventListener("click", () => {
  callerPackage.connectToServer(() => {
    toggleButtonState(true);
  });
});

call_button.addEventListener("click", () => {
  callerPackage.call("6285004633");
});

hangup_button.addEventListener("click", () => {
  callerPackage.endOut();
});

hold_button.addEventListener("click", () => {
  callerPackage.hold();
});

unhold_button.addEventListener("click", () => {
  callerPackage.unhold();
});

mute_button.addEventListener("click", () => {
  callerPackage.mute();
});

unmute_button.addEventListener("click", () => {
  callerPackage.unmute();
});

callerPackage.eventEmitter.on("INFORM_SOCKET_CONNECTED", () => {
  socket = "Socket : Connected";
  document.getElementById("socket-info").innerText = socket;
});

callerPackage.eventEmitter.on("INFORM_SOCKET_DISCONNECTED", () => {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});

callerPackage.eventEmitter.on("ACK_OUTGOING_CALL_START", () => {
  callActive = "CallActve : Active";
  document.getElementById("call-actve-info").innerText = callActive;
});

callerPackage.eventEmitter.on("ACK_OUTGOING_CALL_END", () => {
  callActive = "CallActve : Inative";
  document.getElementById("call-actve-info").innerText = callActive;
});

callerPackage.eventEmitter.on("ACK_CALL_HOLD", () => {
  hold = "Hold State : Hold";
  document.getElementById("hold-info").innerText = callActive;
});

callerPackage.eventEmitter.on("ACK_CALL_UNHOLD", () => {
  hold = "Hold State : Unhold";
  document.getElementById("hold-info").innerText = callActive;
});

callerPackage.eventEmitter.on("ACK_CALL_MUTE", () => {
  mute = "Mute State : Mute";
  document.getElementById("mute-info").innerText = callActive;
});

callerPackage.eventEmitter.on("ACK_CALL_UNMUTE", () => {
  mute = "Mute State : Unmute";
  document.getElementById("mute-info").innerText = callActive;
});
