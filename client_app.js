const { CallerPackage } = require("./CallerPackage/client/client.js");

let callerPackage = new CallerPackage();

document.getElementById("call-button").addEventListener("click", () => {
  callerPackage.call("4153260912");
});

document.getElementById("end-button").addEventListener("click", () => {
  callerPackage.endOut("4153260912");
});
