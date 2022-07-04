const { CallerPackage } = require("./CallerPackage/client.js");

let callerPackage = new CallerPackage();

let mute = "Mute State : Unmute";
let hold = "Hold State : Unhold";
let socket = "Socket : Disconnected";
let callActive = "CallActve : Inative";
let callObject = {
  sender: "",
  receiver: "",
  startTime: "",
  endTime: "",
  hold: false,
  mute: false,
};
document.getElementById("socket-info").innerText = socket;
document.getElementById("mute-info").innerText = hold;
document.getElementById("hold-info").innerText = mute;
displayCallObject();

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
  callerPackage.connect(() => {
    toggleButtonState(true);
  });
});

call_button.addEventListener("click", () => {
  //resetState();
  callerPackage.call(document.getElementById("phone-number").value);
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

callerPackage.on("INFORM_SOCKET_CONNECTED", () => {
  socket = "Socket : Connected";
  document.getElementById("socket-info").innerText = socket;
});

callerPackage.on("INFORM_SOCKET_DISCONNECTED", () => {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});

callerPackage.on("ACK_OUTGOING_CALL_START", () => {
  resetState();
  callActive = "CallActive : Active";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("call-active-info").innerText = callActive;
});

callerPackage.on("ACK_OUTGOING_CALL_END", () => {
  resetState();
  callActive = "CallActive : Inactive";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
});

callerPackage.on("ACK_OUTGOING_CALL_FAIL", () => {
  resetState();
  callActive = "CallActive : FAIL";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;
});

callerPackage.on("ACK_CALL_HOLD", () => {
  hold = "Hold State : Hold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
});

callerPackage.on("ACK_CALL_UNHOLD", () => {
  hold = "Hold State : Unhold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;
});

callerPackage.on("ACK_CALL_MUTE", () => {
  mute = "Mute State : Mute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
});

callerPackage.on("ACK_CALL_UNMUTE", () => {
  mute = "Mute State : Unmute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;
});

callerPackage.on("ACK_SESSION_DETAILS", () => {
  console.log("Caught session details");
  callObject = callerPackage.getCallObject();
  displayCallObject();
  if (callObject.mute == true) {
    mute = "Mute State : Mute";
    document.getElementById("mute-info").innerText = mute;
  }
  if (callObject.hold == true) {
    hold = "Hold State : Hold";
    document.getElementById("hold-info").innerText = hold;
  }
});

callerPackage.on("POPUP_CLOSED", () => {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;
});

function displayCallObject() {
  console.log("Displaying call obj");
  document.getElementById("call-object-info").innerText =
    "Call Details: " + JSON.stringify(callObject);
}

function resetHold() {
  hold = "Hold State : Unhold";
  document.getElementById("hold-info").innerText = hold;
}

function resetMute() {
  mute = "Mute State : Unmute";
  document.getElementById("mute-info").innerText = mute;
}

function resetcallActive() {
  callActive = "CallActve : Inative";
  document.getElementById("call-active-info").innerText = callActive;
}

function resetState() {
  callObject = {
    sender: "",
    receiver: "",
    startTime: "",
    endTime: "",
    hold: false,
    mute: false,
  };
  displayCallObject();

  resetHold();
  resetMute();
  resetcallActive();
}
