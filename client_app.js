const { CallerPackage } = require("./CallerPackage/client/client.js");

let callerPackage = new CallerPackage();

document.getElementById("call-button").addEventListener("click", () => {
  callerPackage.call("4157614983");
});

document.getElementById("end-button").addEventListener("click", () => {
  callerPackage.endOut();
});
