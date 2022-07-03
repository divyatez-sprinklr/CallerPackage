const { Popup } = require("./popup.js");

window.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("is_popup_active", "true");
});

window.onbeforeunload = (event) => {
  localStorage.clear();
  //popup.informUnload();
  return '';
};

const popup = new Popup({
  sip: "1000",
  password: "1000_client",
  server_address: "18.212.171.223",
  port: "7443/ws",
});

popup.connect(() => {
  document.querySelector("h2").textContent = "CONNECTED";
  document.querySelector(".ripple").remove();
});
