const { CallerPackage } = require("./CallerPackage/client");

let callerPackage = new CallerPackage();
// updateConfirmCallUI();
let onMute = false;
let onHold = false;
let onActiveCall = false;
let receiver = "";
let timerInterval;

let mute = "Mute State : ";
let hold = "Hold State : ";
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

const connect_button = document.getElementById("configure");
const call_button = document.getElementById("call");

connect_button.addEventListener("click", () => {
  callerPackage.connect(
    {
      sip: document.getElementById("username").value,
      password: document.getElementById("password").value,
      server_address: document.getElementById("server-address").value,
      port: document.getElementById("port").value,
    },
    () => {
      connect_button.disabled = true;
    }
  );
});

call_button.addEventListener("click", () => {
  //resetState();
  callerPackage.call(document.getElementById("phone-number").value);
  updateInitiateCallUI();
});

// hangup_button.addEventListener("click", () => {
//   callerPackage.endOut();
// });

// hold_button.addEventListener("click", () => {
//   callerPackage.hold();
// });

// unhold_button.addEventListener("click", () => {
//   callerPackage.unhold();
// });

// mute_button.addEventListener("click", () => {
//   callerPackage.mute();
// });

// unmute_button.addEventListener("click", () => {
//   callerPackage.unmute();
// });

document.getElementById("mute-call").addEventListener("click", () => {
  handleMute();
});

document.getElementById("hold-call").addEventListener("click", () => {
  handleHold();
});

document.getElementById("end-call").addEventListener("click", () => {
  callerPackage.terminate();
});

callerPackage.on("INFORM_SOCKET_CONNECTED", () => {
  socket = "Socket : Connected";
  document.getElementById("socket-info").innerText = socket;

  call_button.disabled = false;
  connect_button.disabled = false;
});

callerPackage.on("INFORM_SOCKET_DISCONNECTED", () => {
  socket = "Socket : Disconnected";
  document.getElementById("socket-info").innerText = socket;

  call_button.disabled = true;
});

callerPackage.on("ACK_OUTGOING_CALL_START", () => {
  resetState();
  callActive = "CallActive : Active";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("call-active-info").innerText = callActive;

  updateConfirmCallUI();
  call_button.disabled = true;
});

callerPackage.on("ACK_OUTGOING_CALL_END", () => {
  resetState();
  callActive = "CallActive : Inactive";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;

  closeCallUI();
  call_button.disabled = false;
});

callerPackage.on("ACK_OUTGOING_CALL_FAIL", () => {
  resetState();
  callActive = "CallActive : FAIL";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  resetHold();
  resetMute();
  document.getElementById("call-active-info").innerText = callActive;

  closeCallUI();
  call_button.disabled = false;
});

callerPackage.on("ACK_CALL_HOLD", () => {
  hold = "Hold State : Hold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;

  onHold = true;
  updateHoldUI(onHold);
});

callerPackage.on("ACK_CALL_UNHOLD", () => {
  hold = "Hold State : Unhold";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("hold-info").innerText = hold;

  onHold = false;
  updateHoldUI(onHold);
});

callerPackage.on("ACK_CALL_MUTE", () => {
  mute = "Mute State : Mute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;

  onMute = true;
  updateMuteUI(onMute);
});

callerPackage.on("ACK_CALL_UNMUTE", () => {
  mute = "Mute State : Unmute";
  callObject = callerPackage.getCallObject();
  displayCallObject();
  document.getElementById("mute-info").innerText = mute;

  onMute = false;
  updateMuteUI(onMute);
});

callerPackage.on("ACK_SESSION_DETAILS", () => {
  console.log("Caught session details");
  callObject = callerPackage.getCallObject();
  console.log(callObject);
  if (callObject.receiver != "" && callObject.startTime == "")
    updateInitiateCallUI();
  else if (callObject.startTime != "" && callObject.endTime == "")
    updateConfirmCallUI();

  displayCallObject();
  if (callObject.mute == true) {
    mute = "Mute State : Mute";
    document.getElementById("mute-info").innerText = mute;
    onMute = true;
    updateMuteUI(onMute);
  }
  if (callObject.hold == true) {
    hold = "Hold State : Hold";
    document.getElementById("hold-info").innerText = hold;
    onHold = true;
    updateHoldUI(onHold);
  }
  call_button.disabled = false;
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
  hold = "Hold State :";
  document.getElementById("hold-info").innerText = hold;
}

function resetMute() {
  mute = "Mute State : ";
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

//// Dialpad Float ///

let start_time = 0;
const secondsPassed = (start_time) => {
  let d = new Date();
  return (
    d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() - start_time
  );
};
let [h, m, s, call_timer] = [0, 0, 0, null];

function toggleTimer(start) {
  if (start) {
    call_timer = setInterval(() => {
      s = secondsPassed(start_time);
      console.log("s is", s);
      h = Math.floor(s / 3600);
      s = s - 3600 * h;
      m = Math.floor(s / 60);
      s = s - 60 * m;
      console.log(`Call duration: ${String(h)}:${String(m)}:${String(s)}`);
      let current_time = "";
      current_time = (s < 10 ? "0" + s : s) + current_time;
      current_time = (m < 10 ? "0" + m : m) + ":" + current_time;
      if (h != 0) current_time = (h < 10 ? "0" + h : h) + ":" + current_time;
      document.getElementById("dialpad-timer").innerHTML = `${current_time}`;
    }, 1000);
  } else {
    console.log(`Call duration: ${h}:${m}:${s}`);

    clearInterval(call_timer);
    document.getElementById("dialpad-timer").innerHTML = ``;
    [h, m, s, call_timer] = [0, 0, 0, null];
  }
}

function getHMS(raw_time) {
  raw_time = String(raw_time);
  let [h, m, s] = raw_time.match(/\d+:\d+:\d+/)[0].split(":");
  console.log(h, m, s);
  return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10);
}

function startTimer() {
  start_time = getHMS(callObject.startTime);
  console.log(start_time);
  toggleTimer(true);
}

function endTimer() {
  toggleTimer(false);
}

function closeCallUI() {
  document.getElementById("dialpad-box").style.visibility = "hidden";
  endTimer();
}

function updateInitiateCallUI() {
  document.getElementById("dialpad-box").style.visibility = "inherit";
  document.getElementById("user-number").innerHTML = `${callObject.receiver}`;
  document.getElementById("dialpad-timer").innerHTML = "Ringing..";
  document.getElementById("dialpad-control-buttons").classList.add("visibility");

}

function restoreInitiateCallUI() {
  document.getElementById("dialpad-box").style.visibility = "inherit";
  document.getElementById("user-number").innerHTML = `${callObject.receiver}`;
  document.getElementById("dialpad-timer").innerHTML = "";
}

function updateConfirmCallUI() {
  restoreInitiateCallUI();
  document.getElementById(
    "user-number"
  ).innerHTML = `${callObject.receiver._uri._user}`;
  hold = "Hold State : Unhold";
  mute = "Mute State : Unmute";
  document.getElementById("hold-info").innerText = hold;
  document.getElementById("mute-info").innerText = mute;

  document.getElementById("dialpad-control-buttons").classList.remove("visibility");
  // document.getElementById("mute-call").classList.toggle("visibility");

  startTimer();
}

function handleHold() {
  if (!onHold) {
    callerPackage.hold();
  } else {
    callerPackage.unhold();
  }
}

function updateHoldUI(putOnHold) {
  if (putOnHold) {
    document
      .getElementById("hold-call")
      .classList.remove("control-btn-inactive");
    document.getElementById("hold-call").classList.add("control-btn-active");
  } else {
    document.getElementById("hold-call").classList.remove("control-btn-active");
    document.getElementById("hold-call").classList.add("control-btn-inactive");
  }

  document.querySelectorAll(".hold-btn-icon").forEach((each) => {
    each.classList.toggle("hidden");
  });
}

function handleMute() {
  if (!onMute) {
    callerPackage.mute();
  } else {
    callerPackage.unmute();
  }
}

function updateMuteUI(putOnMute) {
  if (putOnMute) {
    document
      .getElementById("mute-call")
      .classList.remove("control-btn-inactive");
    document.getElementById("mute-call").classList.add("control-btn-active");
  } else {
    document.getElementById("mute-call").classList.remove("control-btn-active");
    document.getElementById("mute-call").classList.add("control-btn-inactive");
  }

  document.querySelectorAll(".mute-btn-icon").forEach((each) => {
    each.classList.toggle("hidden");
  });
}

// function updateConfirmCallUI(){
//   startTimer();
// }

// updateInitiateCallUI();
// updateHoldUI(true);
// updateMuteUI(false);
