const { Popup } = require("./popup.js");

window.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("is_popup_active", "true");
});

window.addEventListener("beforeunload", function () {
  localStorage.clear();
  return "";
});

let popup = null; // global popup variable

document.getElementById("configure").onclick = (event) => {
  event.preventDefault();

  document.getElementById("before-login").classList.toggle("hidden");
  document.getElementById("after-login").classList.toggle("hidden");

  popup = new Popup({
    sip: document.getElementById("username").value,
    password: document.getElementById("password").value,
    server_address: document.getElementById("server-address").value,
    port: document.getElementById("port").value,
  });

  main();
};

function main() {
  popup.connect(() => {
    document.querySelector("h1").textContent = "CONNECTED";
    document.querySelector(".ripple").remove();
  });
}
